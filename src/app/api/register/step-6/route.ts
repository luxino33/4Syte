import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { supplierId } = await req.json();

    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

    // Submit — set status to SUBMITTED_PENDING_BEE
    const { error } = await supabase
      .from("suppliers")
      .update({
        status: "SUBMITTED_PENDING_BEE",
        submitted_at: new Date().toISOString(),
        current_step: 6,
      })
      .eq("id", supplierId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
