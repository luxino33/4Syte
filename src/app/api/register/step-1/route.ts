import { NextRequest, NextResponse } from "next/server";
import { step1Schema } from "@/lib/schemas/step1";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draft = false, ...rawData } = body;

    // Server-side validation — same Zod schema as client
    // On draft saves we do a partial parse; on full submit we require all fields
    let data: Awaited<ReturnType<typeof step1Schema.parseAsync>>;

    if (draft) {
      // Partial parse: only validate fields that were provided
      const partial = step1Schema.partial();
      data = await partial.parseAsync(rawData) as typeof data;
    } else {
      data = await step1Schema.parseAsync(rawData);
    }

    // TODO: Replace with real session lookup
    // const session = await getServerSession();
    // const supplierId = session.user.supplierId;
    const supplierId = "dev-supplier-id"; // placeholder

    // Upsert company info
    await prisma.companyInfo.upsert({
      where: { supplierId },
      create: {
        supplierId,
        submitterFullName: data.submitterFullName ?? "",
        submitterRole: data.submitterRole ?? "",
        generalEmail: data.generalEmail ?? "",
        companyPhone: data.companyPhone ?? "",
        companyFax: data.companyFax ?? null,
        companyWebsite: data.companyWebsite ?? null,
        registeredName: data.registeredName ?? "",
        companyType: (data.companyType as never) ?? "PRIVATE_COMPANY",
        companyTypeOther: data.companyTypeOther ?? null,
        tradingName: data.tradingName ?? null,
        registrationNumber: data.registrationNumber ?? "",
        holdingCompanyName: data.holdingCompanyName ?? null,
        vatRegistered: data.vatRegistered ?? false,
        vatNumber: data.vatNumber ?? null,
        taxClearancePin: data.taxClearancePin ?? null,
        taxClearancePinExpiry: data.taxClearancePinExpiry
          ? new Date(data.taxClearancePinExpiry)
          : null,
      },
      update: {
        submitterFullName: data.submitterFullName,
        submitterRole: data.submitterRole,
        generalEmail: data.generalEmail,
        companyPhone: data.companyPhone,
        companyFax: data.companyFax ?? null,
        companyWebsite: data.companyWebsite ?? null,
        registeredName: data.registeredName,
        companyType: data.companyType as never,
        companyTypeOther: data.companyTypeOther ?? null,
        tradingName: data.tradingName ?? null,
        registrationNumber: data.registrationNumber,
        holdingCompanyName: data.holdingCompanyName ?? null,
        vatRegistered: data.vatRegistered,
        vatNumber: data.vatNumber ?? null,
        taxClearancePin: data.taxClearancePin ?? null,
        taxClearancePinExpiry: data.taxClearancePinExpiry
          ? new Date(data.taxClearancePinExpiry)
          : null,
      },
    });

    // Advance wizard step if not draft
    if (!draft) {
      await prisma.supplier.update({
        where: { id: supplierId },
        data: { currentStep: 2 },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("[step-1]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
