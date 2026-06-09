import { z } from "zod";

const addressShape = {
  street1: z.string().min(1, "Required").max(40),
  street2: z.string().max(40).optional().default(""),
  city: z.string().min(1, "Required").max(40),
  country: z.string().min(1, "Required"),
  province: z.string().min(1, "Required"),
  postalCode: z.string().min(1, "Required").max(5),
};

const contactShape = {
  fullName: z.string().min(2, "Required").max(60),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Required").max(15),
};

export const step2Schema = z.object({
  // Physical address (2001-2006)
  physStreet1: z.string().min(1, "Required").max(40),
  physStreet2: z.string().max(40),
  physCity: z.string().min(1, "Required").max(40),
  physCountry: z.string().min(1, "Required"),
  physProvince: z.string().min(1, "Required"),
  physPostalCode: z.string().min(1, "Required").max(5),
  // Postal address (2000, 2007-2012)
  sameAsPhysical: z.boolean(),
  postStreet1: z.string().min(1, "Required").max(40),
  postStreet2: z.string().max(40),
  postCity: z.string().min(1, "Required").max(40),
  postCountry: z.string().min(1, "Required"),
  postProvince: z.string().min(1, "Required"),
  postPostalCode: z.string().min(1, "Required").max(5),
  // Primary contact (2013)
  primaryFullName: z.string().min(2, "Required").max(60),
  primaryEmail: z.string().email("Valid email required"),
  primaryPhone: z.string().min(7, "Required").max(15),
  // Secondary contact (2014)
  secondaryFullName: z.string().min(2, "Required").max(60),
  secondaryEmail: z.string().email("Valid email required"),
  secondaryPhone: z.string().min(7, "Required").max(15),
});

export const step2DraftSchema = step2Schema.partial();
export type Step2FormData = z.infer<typeof step2Schema>;
