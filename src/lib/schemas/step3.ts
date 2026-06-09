import { z } from "zod";

export const ownerSchema = z.object({
  id: z.string().optional(), // local key for repeatable group
  fullName: z.string().min(2, "Required"),
  shareholderType: z.enum(["INDIVIDUAL", "COMPANY"]),
  percentageOwnership: z.number().min(0).max(100),
  idOrRegNumber: z.string().min(1, "Required"),
  positionInCompany: z.string().min(1, "Required"),
});

export const step3Schema = z.object({
  hasBBBEEDocument: z.boolean(),
  // Only required when hasBBBEEDocument = true
  sector: z.string().optional(),
  annualTurnoverBand: z.string().optional(),
  classification: z.string().optional(),
  blackOwnershipPct: z.number().min(0).max(100).optional(),
  isBlackOwned: z.boolean().optional(),
  blackWomanOwnershipPct: z.number().min(0).max(100).optional(),
  isBlackWomanOwned: z.boolean().optional(),
  bdgPct: z.number().min(0).max(100).optional(),
  bdgYouthPct: z.number().min(0).max(100).optional(),
  bdgDisabledPct: z.number().min(0).max(100).optional(),
  bdgUnemployedPct: z.number().min(0).max(100).optional(),
  bdgRuralPct: z.number().min(0).max(100).optional(),
  bdgMilitaryVetPct: z.number().min(0).max(100).optional(),
  bbbeeLevel: z.number().min(1).max(8).optional(),
  modifiedFlowThrough: z.boolean().optional(),
  certExpiryDate: z.string().optional(),
  latestFinYearEnd: z.string().optional(),
  sanasAccreditedVA: z.string().optional(),
  owners: z.array(ownerSchema).default([]),
});

export const step3DraftSchema = step3Schema.partial().extend({ owners: z.array(ownerSchema).default([]) });
export type Step3FormData = z.infer<typeof step3Schema>;
export type OwnerData = z.infer<typeof ownerSchema>;
