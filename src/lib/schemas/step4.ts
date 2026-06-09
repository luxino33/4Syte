import { z } from "zod";

export const productLineSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required").max(1000),
  description: z.string().optional(),
  region: z.string().min(1, "Required"),
});

export const step4Schema = z.object({
  // Product offerings (4000-4005)
  unspscCodes: z.array(z.string()).min(1, "Select at least one product/service category"),
  businessSummary: z.string().min(10, "Required — min 10 characters").max(1000),
  productLines: z.array(productLineSchema).min(1, "Add at least one product/service line"),
  notifyOpportunities: z.boolean().default(false),
  // Bank information
  bankName: z.string().min(1, "Required"),
  accountType: z.enum(["CURRENT", "SAVINGS", "TRANSMISSION"]),
  branchName: z.string().min(1, "Required"),
  branchNumber: z.string().min(1, "Required"),
  swiftCode: z.string().min(1, "Required"),
  accountNumber: z.string().min(1, "Required"),
});

export const step4DraftSchema = step4Schema.partial().extend({
  unspscCodes: z.array(z.string()).default([]),
  productLines: z.array(productLineSchema).default([]),
});

export type Step4FormData = z.infer<typeof step4Schema>;
export type ProductLineData = z.infer<typeof productLineSchema>;
