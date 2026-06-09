import { NextRequest, NextResponse } from "next/server";
import { step1Schema, step1DraftSchema } from "@/lib/schemas/step1";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const {
      draft = false,
      supplierId: incomingSupplierId,
      sessionId: incomingSessionId,
      ...rawData
    } = body;

    // Validate data — permissive draft schema vs strict submit schema
    const data: Partial<z.infer<typeof step1Schema>> = draft
      ? step1DraftSchema.parse(rawData)
      : step1Schema.parse(rawData);

    // ── Resolve supplier ──────────────────────────────────────────────────────
    // Ensure we always have a session_id (server-side fallback if client missing)
    const sessionId: string =
      (typeof incomingSessionId === "string" && incomingSessionId) ||
      crypto.randomUUID();

    let supplierId: string =
      typeof incomingSupplierId === "string" ? incomingSupplierId : "";

    // If no supplierId given, look up the most recent draft for this session
    if (!supplierId) {
      const { data: existing, error: lookupError } = await supabase
        .from("suppliers")
        .select("id")
        .eq("session_id", sessionId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(); // ← maybeSingle does NOT throw on 0 rows

      if (lookupError) {
        console.error("[step-1] supplier lookup failed:", lookupError);
        return NextResponse.json(
          { error: "Supplier lookup failed", detail: lookupError.message },
          { status: 500 }
        );
      }
      if (existing?.id) supplierId = existing.id;
    }

    // If still no supplier, create one
    if (!supplierId) {
      const { data: newSupplier, error: insertError } = await supabase
        .from("suppliers")
        .insert({ session_id: sessionId, status: "DRAFT", current_step: 1 })
        .select("id")
        .single();

      if (insertError || !newSupplier?.id) {
        console.error("[step-1] supplier insert failed:", insertError);
        return NextResponse.json(
          {
            error: "Failed to create supplier record",
            detail: insertError?.message,
          },
          { status: 500 }
        );
      }
      supplierId = newSupplier.id;
    }

    // ── Upsert company_info ───────────────────────────────────────────────────
    // Convert ISO date string ("2026-12-31") to a clean date for Postgres
    const taxExpiry =
      data.taxClearancePinExpiry && data.taxClearancePinExpiry.trim() !== ""
        ? data.taxClearancePinExpiry
        : null;

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
      tax_clearance_pin_expiry: taxExpiry,
    };

    const { error: upsertError } = await supabase
      .from("company_info")
      .upsert(payload, { onConflict: "supplier_id" });

    if (upsertError) {
      console.error("[step-1] company_info upsert failed:", upsertError);
      return NextResponse.json(
        { error: "Failed to save company info", detail: upsertError.message },
        { status: 500 }
      );
    }

    // Advance wizard step on full submit
    if (!draft) {
      const { error: stepError } = await supabase
        .from("suppliers")
        .update({ current_step: 2 })
        .eq("id", supplierId);
      if (stepError) {
        console.error("[step-1] step advance failed:", stepError);
      }
    }

    return NextResponse.json({ ok: true, supplierId, sessionId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("[step-1] unhandled:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal server error", detail: message },
      { status: 500 }
    );
  }
}
