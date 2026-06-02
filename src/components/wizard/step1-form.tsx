"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, step1Defaults, REG_NUMBER_FORMATS, type Step1FormData } from "@/lib/schemas/step1";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils";
import { Save, ArrowRight } from "lucide-react";

const COMPANY_TYPES = [
  { value: "PRIVATE_COMPANY", label: "Private Company (Pty) Ltd" },
  { value: "CLOSE_CORPORATION", label: "Close Corporation (CC)" },
  { value: "SOLE_PROPRIETOR", label: "Sole Proprietor" },
  { value: "PUBLIC_COMPANY", label: "Public Company (Ltd)" },
  { value: "TRUST", label: "Trust" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "NGO", label: "Non-Profit / NGO" },
  { value: "OTHER", label: "Other" },
];

interface Step1FormProps {
  defaultValues?: Partial<Step1FormData>;
  onSaveDraft: (data: Partial<Step1FormData>) => Promise<void>;
  onNext: (data: Step1FormData) => Promise<void>;
  isSaving?: boolean;
}

export function Step1Form({ defaultValues, onSaveDraft, onNext, isSaving }: Step1FormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: { ...step1Defaults, ...defaultValues },
    mode: "onBlur",
  });

  const vatRegistered = watch("vatRegistered");
  const taxClearancePin = watch("taxClearancePin");
  const companyType = watch("companyType");

  // Auto-save draft on change (debounced)
  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(() => {
      const values = watch();
      onSaveDraft(values).catch(() => {});
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isDirty, watch, onSaveDraft]);

  const regFormat = companyType
    ? REG_NUMBER_FORMATS[companyType as keyof typeof REG_NUMBER_FORMATS]
    : null;

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      {/* ── Section: Company Information ─────────────────────────────────── */}
      <section aria-labelledby="section-company-info" className="mb-10">
        <h2
          id="section-company-info"
          className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6"
        >
          Company Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Full name of person submitting"
            fieldRef="1001"
            required
            error={errors.submitterFullName?.message}
          >
            <Input
              {...register("submitterFullName")}
              placeholder="e.g. John Doe"
              error={errors.submitterFullName?.message}
              autoComplete="name"
            />
          </FormField>

          <FormField
            label="Role / Designation of submitter"
            fieldRef="1002"
            required
            error={errors.submitterRole?.message}
          >
            <Input
              {...register("submitterRole")}
              placeholder="e.g. Financial Director"
              error={errors.submitterRole?.message}
            />
          </FormField>

          <FormField
            label="General Company Email Address"
            fieldRef="1003"
            required
            hint="This becomes your login username"
            error={errors.generalEmail?.message}
          >
            <Input
              {...register("generalEmail")}
              type="email"
              placeholder="company@example.co.za"
              error={errors.generalEmail?.message}
              autoComplete="email"
            />
          </FormField>

          <FormField
            label="Company Telephone Number"
            fieldRef="1004"
            required
            error={errors.companyPhone?.message}
          >
            <Controller
              name="companyPhone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  placeholder="+27 72 565 1665"
                  error={errors.companyPhone?.message}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  autoComplete="tel"
                />
              )}
            />
          </FormField>

          <FormField
            label="Company Fax Number"
            fieldRef="1005"
            optional
            error={errors.companyFax?.message}
          >
            <Controller
              name="companyFax"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type="tel"
                  placeholder="+27 11 000 0000"
                  error={errors.companyFax?.message}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                />
              )}
            />
          </FormField>

          <FormField
            label="Company Website"
            fieldRef="1006"
            optional
            error={errors.companyWebsite?.message}
          >
            <Input
              {...register("companyWebsite")}
              type="url"
              placeholder="https://www.company.co.za"
              error={errors.companyWebsite?.message}
            />
          </FormField>
        </div>
      </section>

      {/* ── Section: Company Registration Information ─────────────────────── */}
      <section aria-labelledby="section-reg-info" className="mb-10">
        <h2
          id="section-reg-info"
          className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6"
        >
          Company Registration Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Registered Company Name"
            fieldRef="1007"
            required
            error={errors.registeredName?.message}
          >
            <Input
              {...register("registeredName")}
              placeholder="As on CIPC certificate"
              error={errors.registeredName?.message}
            />
          </FormField>

          <FormField
            label="Company Type"
            fieldRef="1008"
            required
            error={errors.companyType?.message}
          >
            <Controller
              name="companyType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={COMPANY_TYPES}
                  placeholder="Select company type..."
                  error={errors.companyType?.message}
                />
              )}
            />
          </FormField>

          {companyType === "OTHER" && (
            <FormField
              label="Please specify company type"
              required
              error={errors.companyTypeOther?.message}
            >
              <Input
                {...register("companyTypeOther")}
                placeholder="Describe your company type"
                error={errors.companyTypeOther?.message}
              />
            </FormField>
          )}

          <FormField
            label="Company Trading Name"
            fieldRef="1009"
            optional
            error={errors.tradingName?.message}
          >
            <Input
              {...register("tradingName")}
              placeholder="Trading name if different from registered"
              error={errors.tradingName?.message}
            />
          </FormField>

          <FormField
            label="Company Registration Number"
            fieldRef="1010"
            required
            hint={
              regFormat
                ? `Format: ${regFormat.example}`
                : "Select company type first"
            }
            error={errors.registrationNumber?.message}
          >
            <Input
              {...register("registrationNumber")}
              placeholder={regFormat?.example ?? "Select company type first"}
              error={errors.registrationNumber?.message}
            />
          </FormField>

          <FormField
            label="Holding Company Name"
            fieldRef="1011"
            optional
            error={errors.holdingCompanyName?.message}
          >
            <Input
              {...register("holdingCompanyName")}
              placeholder="Leave blank if not applicable"
              error={errors.holdingCompanyName?.message}
            />
          </FormField>
        </div>
      </section>

      {/* ── Section: Tax Information ───────────────────────────────────────── */}
      <section aria-labelledby="section-tax-info" className="mb-10">
        <h2
          id="section-tax-info"
          className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6"
        >
          Tax Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Is your company registered for VAT?"
            fieldRef="1012"
            required
            error={errors.vatRegistered?.message}
            className="md:col-span-2"
          >
            <Controller
              name="vatRegistered"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  name="vatRegistered"
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  value={
                    field.value === true
                      ? "true"
                      : field.value === false
                      ? "false"
                      : undefined
                  }
                  onChange={(v) => field.onChange(v === "true")}
                  error={errors.vatRegistered?.message}
                />
              )}
            />
          </FormField>

          {vatRegistered === true && (
            <FormField
              label="Company VAT Number"
              fieldRef="1013"
              required
              hint="9 digits, must start with 4"
              error={errors.vatNumber?.message}
            >
              <Input
                {...register("vatNumber")}
                placeholder="4xxxxxxxx"
                maxLength={9}
                error={errors.vatNumber?.message}
              />
            </FormField>
          )}

          <FormField
            label="Tax Clearance PIN Number"
            fieldRef="1014"
            optional
            hint="Providing this will require a TCC document and expiry date"
            error={errors.taxClearancePin?.message}
          >
            <Input
              {...register("taxClearancePin")}
              placeholder="Max 15 characters"
              maxLength={15}
              error={errors.taxClearancePin?.message}
            />
          </FormField>

          {taxClearancePin && taxClearancePin.trim() !== "" && (
            <FormField
              label="Tax Clearance PIN Expiry Date"
              fieldRef="1015"
              required
              error={errors.taxClearancePinExpiry?.message}
            >
              <Input
                {...register("taxClearancePinExpiry")}
                type="date"
                error={errors.taxClearancePinExpiry?.message}
              />
            </FormField>
          )}

          {/* Vendor number — read-only, shown if populated */}
          <FormField
            label="Vendor Number"
            fieldRef="1016"
            hint="Populated by the system after onboarding is complete"
          >
            <Input
              value={defaultValues?.registrationNumber ? "Pending" : "Not yet assigned"}
              readOnly
              disabled
              className="bg-[var(--muted)] cursor-not-allowed"
            />
          </FormField>
        </div>
      </section>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isSaving}
          onClick={() => onSaveDraft(watch())}
        >
          <Save className="h-4 w-4" />
          Save Draft
        </Button>

        <Button type="submit" loading={isSubmitting} size="lg">
          Save & Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
