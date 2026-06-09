import { NextRequest, NextResponse } from "next/server";
import { step1Schema } from "@/lib/schemas/step1";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { draft = false, supplierId: existingSupplierId, sessionId, ...rawData } = body;

    // Validate data (partial on draft, full on submit)
    let data: Partial<z.infer<typeof step1Schema>>;
    if (draft) {
      data = step1Schema.partial().parse(rawData);
    } else {
      data = step1Schema.parse(rawData);
    }

    // ── Get or create a supplier row linked to this browser session ──────────
    let supplierId: string = existingSupplierId;

    if (!supplierId && sessionId) {
      // Look up existing draft for this session
      const { data: existing } = await supabase
        .from("suppliers")
        .select("id")
        .eq("session_id", sessionId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      supplierId = existing?.id ?? "";
    }

    if (!supplierId) {
      // Create a new supplier row for this session
      const sid = sessionId ?? crypto.randomUUID();
      const { data: newSupplier, error } = await supabase
        .from("suppliers")
        .insert({ session_id: sid, status: "DRAFT", current_step: 1 })
        .select("id")
        .single();

      if (error || !newSupplier) {
        return NextResponse.json({ error: "Failed to create supplier record" }, { status: 500 });
      }
      supplierId = newSupplier.id;
    }

    // ── Upsert company_info ───────────────────────────────────────────────────
    const payload = {
      supplier_id: supplierId,
      submitter_full_name: data.submitterFullName ?? "",
      submitter_role: data.submitterRole ?? "",
      general_email: data.generalEmail ?? "",
      company_phone: data.companyPhone ?? "",
      company_fax: data.companyFax || null,
      company_website: data.companyWebsite || null,
      linked_in: data.linkedIn || null,
      facebook: data.facebook || null,
      registered_name: data.registeredName ?? "",
      company_type: (data.companyType ?? "PRIVATE_COMPANY") as never,
      company_type_other: data.companyTypeOther || null,
      trading_name: data.tradingName || null,
      registration_number: data.registrationNumber ?? "",
      holding_company_name: data.holdingCompanyName || null,
      vat_registered: data.vatRegistered ?? false,
      vat_number: data.vatNumber || null,
      tax_clearance_pin: data.taxClearancePin || null,
      tax_clearance_pin_expiry: data.taxClearancePinExpiry || null,
    };

    const { error: upsertError } = await supabase
      .from("company_info")
      .upsert(payload, { onConflict: "supplier_id" });

    if (upsertError) {
      console.error("[step-1] upsert error:", upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Advance wizard step if full submit
    if (!draft) {
      await supabase
        .from("suppliers")
        .update({ current_step: 2 })
        .eq("id", supplierId);
    }

    return NextResponse.json({ ok: true, supplierId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("[step-1]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
