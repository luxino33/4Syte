import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { supplierId, agreements = [], draft = false } = body;

    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

    // Save agreement acceptances
    for (const ag of agreements) {
      await supabase.from("agreements").upsert({
        supplier_id: supplierId,
        type: ag.type,
        version: ag.version ?? "1.0",
        accepted: ag.accepted ?? false,
        accepted_at: ag.accepted ? new Date().toISOString() : null,
      }, { onConflict: "supplier_id,type" });
    }

    if (!draft) {
      await supabase.from("suppliers").update({ current_step: 6 }).eq("id", supplierId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
