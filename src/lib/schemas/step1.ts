import { z } from "zod";

// Regex helpers
const alphanumericMax = (max: number) =>
  z.string().max(max, `Max ${max} characters`).regex(/^[a-zA-Z0-9\s]*$/, "Letters and numbers only");

const phoneRegex = /^[+0-9\s\-()]{7,15}$/;

// Registration number formats per company type
export const REG_NUMBER_FORMATS = {
  PRIVATE_COMPANY: {
    pattern: /^\d{4}\/\d{6}\/\d{2}$/,
    mask: "____/______/__",
    example: "2023/123456/07",
  },
  CLOSE_CORPORATION: {
    pattern: /^\d{4}\/\d{6}\/\d{2}$/,
    mask: "____/______/__",
    example: "2023/123456/23",
  },
  SOLE_PROPRIETOR: {
    pattern: /^\d{6}\d{4}\d{3}$/,
    mask: "______/____/___",
    example: "8001015009087",
  },
  PUBLIC_COMPANY: {
    pattern: /^\d{4}\/\d{6}\/\d{2}$/,
    mask: "____/______/__",
    example: "2023/123456/06",
  },
  TRUST: { pattern: /^IT\d+\/\d{4}$/, mask: "IT______/____", example: "IT1234/2020" },
  PARTNERSHIP: { pattern: /^.+$/, mask: "", example: "Any format" },
  NGO: { pattern: /^\d{3}-\d{3}$/, mask: "___-___", example: "123-456" },
  OTHER: { pattern: /^.+$/, mask: "", example: "Any format" },
} as const;

// ── Shape ────────────────────────────────────────────────────────────────────
// Defined separately so we can build both a strict (refined) schema for submit
// and a permissive partial schema for draft saves. Calling .partial() directly
// on a refined schema is not supported by Zod.
const step1Shape = {
  // ── Submitter (1001–1006) ──────────────────────────────────────────────
  submitterFullName: alphanumericMax(40).min(2, "Required"),
  submitterRole: alphanumericMax(40).min(2, "Required"),
  generalEmail: z
    .string()
    .email("Must be a valid email address")
    .refine((v) => v.includes("@") && v.includes("."), "Must contain @ and a dot"),
  companyPhone: z
    .string()
    .min(7, "Too short")
    .max(15, "Max 15 characters")
    .regex(phoneRegex, "Numbers, spaces, +, -, () only"),
  companyFax: z
    .union([
      z.string().max(15).regex(phoneRegex, "Numbers only").optional(),
      z.literal(""),
    ])
    .optional(),
  companyWebsite: z
    .union([z.string().url("Must be a valid URL").optional(), z.literal("")])
    .optional(),
  linkedIn: z.string().optional(),
  facebook: z.string().optional(),

  // ── Company Registration (1007–1011) ───────────────────────────────────
  registeredName: alphanumericMax(40).min(2, "Required"),
  companyType: z.enum([
    "PRIVATE_COMPANY",
    "CLOSE_CORPORATION",
    "SOLE_PROPRIETOR",
    "PUBLIC_COMPANY",
    "TRUST",
    "PARTNERSHIP",
    "NGO",
    "OTHER",
  ]),
  companyTypeOther: z.string().optional(),
  tradingName: z
    .union([alphanumericMax(40).optional(), z.literal("")])
    .optional(),
  registrationNumber: z.string().min(1, "Required"),
  holdingCompanyName: z
    .union([alphanumericMax(40).optional(), z.literal("")])
    .optional(),

  // ── Tax (1012–1015) ────────────────────────────────────────────────────
  vatRegistered: z.boolean(),
  vatNumber: z.string().optional(),
  taxClearancePin: z.string().max(15).optional(),
  taxClearancePinExpiry: z.string().optional(), // ISO date string from date picker
} as const;

const step1BaseObject = z.object(step1Shape);

// Strict schema with cross-field refinements — used on final submit.
export const step1Schema = step1BaseObject.superRefine((data, ctx) => {
    // VAT number required if vatRegistered = true
    if (data.vatRegistered) {
      if (!data.vatNumber || data.vatNumber.trim() === "") {
        ctx.addIssue({
          path: ["vatNumber"],
          code: z.ZodIssueCode.custom,
          message: "VAT number is required when VAT registered",
        });
      } else if (!/^\d{9}$/.test(data.vatNumber)) {
        ctx.addIssue({
          path: ["vatNumber"],
          code: z.ZodIssueCode.custom,
          message: "VAT number must be exactly 9 digits",
        });
      } else if (!data.vatNumber.startsWith("4")) {
        ctx.addIssue({
          path: ["vatNumber"],
          code: z.ZodIssueCode.custom,
          message: "VAT number must start with 4",
        });
      }
    }

    // Tax clearance expiry required if PIN is provided
    if (data.taxClearancePin && data.taxClearancePin.trim() !== "") {
      if (!data.taxClearancePinExpiry || data.taxClearancePinExpiry.trim() === "") {
        ctx.addIssue({
          path: ["taxClearancePinExpiry"],
          code: z.ZodIssueCode.custom,
          message: "Expiry date is required when Tax Clearance PIN is provided",
        });
      }
    }

    // OTHER company type requires free text
    if (data.companyType === "OTHER") {
      if (!data.companyTypeOther || data.companyTypeOther.trim() === "") {
        ctx.addIssue({
          path: ["companyTypeOther"],
          code: z.ZodIssueCode.custom,
          message: "Please specify company type",
        });
      }
    }

    // Registration number format validation
    if (data.companyType !== "OTHER" && data.companyType !== "PARTNERSHIP") {
      const fmt = REG_NUMBER_FORMATS[data.companyType as keyof typeof REG_NUMBER_FORMATS];
      if (fmt && !fmt.pattern.test(data.registrationNumber)) {
        ctx.addIssue({
          path: ["registrationNumber"],
          code: z.ZodIssueCode.custom,
          message: `Format: ${fmt.example}`,
        });
      }
    }
});

// Permissive schema used for auto-save / draft endpoints. Every field optional,
// no cross-field rules — we just want type-safety on whatever the user has
// entered so far.
export const step1DraftSchema = step1BaseObject.partial();

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step1DraftData = z.infer<typeof step1DraftSchema>;

// Default values for the form
export const step1Defaults: Partial<Step1FormData> = {
  companyPhone: "+27 ",
  vatRegistered: undefined as unknown as boolean,
};
