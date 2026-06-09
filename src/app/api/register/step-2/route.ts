import { NextRequest, NextResponse } from "next/server";
import { step2Schema, step2DraftSchema } from "@/lib/schemas/step2";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { draft = false, supplierId, ...rawData } = body;

    if (!supplierId) return NextResponse.json({ error: "supplierId required" }, { status: 400 });

    const data = draft ? step2DraftSchema.parse(rawData) : step2Schema.parse(rawData);

    // Upsert physical address
    if (data.physStreet1 !== undefined) {
      await supabase.from("physical_addresses").upsert({
        supplier_id: supplierId,
        street1: data.physStreet1 ?? "",
        street2: data.physStreet2 ?? "",
        city: data.physCity ?? "",
        country: data.physCountry ?? "",
        province: data.physProvince ?? "",
        postal_code: data.physPostalCode ?? "",
      }, { onConflict: "supplier_id" });
    }

    // Upsert postal address
    const sameAsPhys = data.sameAsPhysical ?? false;
    await supabase.from("postal_addresses").upsert({
      supplier_id: supplierId,
      same_as_physical: sameAsPhys,
      street1: sameAsPhys ? (data.physStreet1 ?? "") : (data.postStreet1 ?? ""),
      street2: sameAsPhys ? (data.physStreet2 ?? "") : (data.postStreet2 ?? ""),
      city: sameAsPhys ? (data.physCity ?? "") : (data.postCity ?? ""),
      country: sameAsPhys ? (data.physCountry ?? "") : (data.postCountry ?? ""),
      province: sameAsPhys ? (data.physProvince ?? "") : (data.postProvince ?? ""),
      postal_code: sameAsPhys ? (data.physPostalCode ?? "") : (data.postPostalCode ?? ""),
    }, { onConflict: "supplier_id" });

    // Upsert contacts
    if (data.primaryFullName) {
      await supabase.from("contacts").upsert({
        supplier_id: supplierId, type: "PRIMARY",
        full_name: data.primaryFullName, email: data.primaryEmail ?? "", phone: data.primaryPhone ?? "",
      }, { onConflict: "supplier_id,type" });
    }
    if (data.secondaryFullName) {
      await supabase.from("contacts").upsert({
        supplier_id: supplierId, type: "SECONDARY",
        full_name: data.secondaryFullName, email: data.secondaryEmail ?? "", phone: data.secondaryPhone ?? "",
      }, { onConflict: "supplier_id,type" });
    }

    if (!draft) {
      await supabase.from("suppliers").update({ current_step: 3 }).eq("id", supplierId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", issues: err.flatten().fieldErrors }, { status: 422 });
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
