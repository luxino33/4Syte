import { NextRequest, NextResponse } from "next/server";
import { step4Schema, step4DraftSchema } from "@/lib/schemas/step4";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { draft = false, supplierId, ...rawData } = body;

    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

    const data = draft ? step4DraftSchema.parse(rawData) : step4Schema.parse(rawData);

    // Upsert product_offerings
    await supabase.from("product_offerings").upsert({
      supplier_id: supplierId,
      unspsc_codes: data.unspscCodes ?? [],
      business_summary: data.businessSummary ?? "",
      notify_opportunities: data.notifyOpportunities ?? false,
    }, { onConflict: "supplier_id" });

    // Replace product service lines
    if (data.productLines && data.productLines.length > 0) {
      await supabase.from("product_service_lines").delete().eq("supplier_id", supplierId);
      await supabase.from("product_service_lines").insert(
        data.productLines.map((l) => ({
          supplier_id: supplierId,
          name: l.name,
          description: l.description ?? null,
          region: l.region,
        }))
      );
    }

    // Upsert bank info
    if (data.bankName) {
      await supabase.from("bank_info").upsert({
        supplier_id: supplierId,
        bank_name: data.bankName,
        account_type: (data.accountType ?? "CURRENT") as never,
        branch_name: data.branchName ?? "",
        branch_number: data.branchNumber ?? "",
        swift_code: data.swiftCode ?? "",
        account_number: data.accountNumber ?? "",
      }, { onConflict: "supplier_id" });
    }

    if (!draft) {
      await supabase.from("suppliers").update({ current_step: 5 }).eq("id", supplierId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", issues: err.flatten().fieldErrors }, { status: 422 });
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
