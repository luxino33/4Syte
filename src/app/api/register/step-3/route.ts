import { NextRequest, NextResponse } from "next/server";
import { step3Schema, step3DraftSchema } from "@/lib/schemas/step3";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { draft = false, supplierId, owners: rawOwners = [], ...rawData } = body;

    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

    const data = draft
      ? step3DraftSchema.parse({ ...rawData, owners: rawOwners })
      : step3Schema.parse({ ...rawData, owners: rawOwners });

    // Upsert bbbee_info
    await supabase.from("bbbee_info").upsert({
      supplier_id: supplierId,
      has_bbbee_document: data.hasBBBEEDocument ?? false,
      sector: (data.sector ?? null) as never,
      annual_turnover_band: data.annualTurnoverBand ?? null,
      classification: (data.classification ?? null) as never,
      black_ownership_pct: data.blackOwnershipPct ?? null,
      is_black_owned: data.isBlackOwned ?? null,
      black_woman_ownership_pct: data.blackWomanOwnershipPct ?? null,
      is_black_woman_owned: data.isBlackWomanOwned ?? null,
      bdg_pct: data.bdgPct ?? null,
      bdg_youth_pct: data.bdgYouthPct ?? null,
      bdg_disabled_pct: data.bdgDisabledPct ?? null,
      bdg_unemployed_pct: data.bdgUnemployedPct ?? null,
      bdg_rural_pct: data.bdgRuralPct ?? null,
      bdg_military_vet_pct: data.bdgMilitaryVetPct ?? null,
      bbbee_level: data.bbbeeLevel ?? null,
      modified_flow_through: data.modifiedFlowThrough ?? null,
      cert_expiry_date: data.certExpiryDate ?? null,
      latest_fin_year_end: data.latestFinYearEnd ?? null,
      sanas_accredited_va: data.sanasAccreditedVA ?? null,
    }, { onConflict: "supplier_id" });

    // Replace owners — delete existing and re-insert
    if (data.owners && data.owners.length > 0) {
      await supabase.from("owners").delete().eq("supplier_id", supplierId);
      await supabase.from("owners").insert(
        data.owners.map((o) => ({
          supplier_id: supplierId,
          full_name: o.fullName,
          shareholder_type: o.shareholderType as never,
          percentage_ownership: o.percentageOwnership,
          id_or_reg_number: o.idOrRegNumber,
          position_in_company: o.positionInCompany,
        }))
      );
    }

    if (!draft) {
      await supabase.from("suppliers").update({ current_step: 4 }).eq("id", supplierId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", issues: err.flatten().fieldErrors }, { status: 422 });
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
