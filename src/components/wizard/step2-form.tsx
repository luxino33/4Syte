"use client";

import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2FormData } from "@/lib/schemas/step2";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { COUNTRIES, SA_PROVINCES } from "@/lib/reference-data";

const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));
const provinceOptions = SA_PROVINCES.map((p) => ({ value: p.code, label: p.name }));

interface Step2FormProps {
  defaultValues?: Partial<Step2FormData>;
  prefillFromStep1?: { fullName?: string; email?: string; phone?: string };
  onSaveDraft: (data: Partial<Step2FormData>) => Promise<void>;
  onNext: (data: Step2FormData) => Promise<void>;
  onBack: () => void;
  isSaving?: boolean;
}

export function Step2Form({ defaultValues, prefillFromStep1, onSaveDraft, onNext, onBack, isSaving }: Step2FormProps) {
  const { register, handleSubmit, watch, control, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema) as Resolver<Step2FormData>,
    defaultValues: {
      sameAsPhysical: false,
      physStreet2: "", postStreet2: "",
      physCountry: "ZA", postCountry: "ZA",
      physProvince: "", postProvince: "",
      primaryFullName: prefillFromStep1?.fullName ?? "",
      primaryEmail: prefillFromStep1?.email ?? "",
      primaryPhone: prefillFromStep1?.phone ?? "",
      ...defaultValues,
    },
  });

  const sameAsPhysical = watch("sameAsPhysical");
  const phys = watch(["physStreet1", "physStreet2", "physCity", "physCountry", "physProvince", "physPostalCode"]);

  // Auto-copy physical to postal when checkbox is ticked
  useEffect(() => {
    if (sameAsPhysical) {
      setValue("postStreet1", phys[0] ?? "");
      setValue("postStreet2", phys[1] ?? "");
      setValue("postCity", phys[2] ?? "");
      setValue("postCountry", phys[3] ?? "ZA");
      setValue("postProvince", phys[4] ?? "");
      setValue("postPostalCode", phys[5] ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameAsPhysical, ...phys, setValue]);

  // Auto-save
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => onSaveDraft(watch()).catch(() => {}), 2000);
    return () => clearTimeout(t);
  }, [isDirty, watch, onSaveDraft]);

  const AddressSection = ({ prefix, title }: { prefix: "phys" | "post"; title: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Street Address (line 1)" required error={(errors as Record<string, { message?: string }>)[`${prefix}Street1`]?.message} className="md:col-span-2">
        <Input {...register(`${prefix}Street1` as keyof Step2FormData)} placeholder="e.g. 123 Main Street" disabled={prefix === "post" && sameAsPhysical} />
      </FormField>
      <FormField label="Street Address (line 2)" error={(errors as Record<string, { message?: string }>)[`${prefix}Street2`]?.message} className="md:col-span-2">
        <Input {...register(`${prefix}Street2` as keyof Step2FormData)} placeholder="Suburb / Building" disabled={prefix === "post" && sameAsPhysical} />
      </FormField>
      <FormField label="City" required error={(errors as Record<string, { message?: string }>)[`${prefix}City`]?.message}>
        <Input {...register(`${prefix}City` as keyof Step2FormData)} placeholder="e.g. Johannesburg" disabled={prefix === "post" && sameAsPhysical} />
      </FormField>
      <FormField label="Postal Code" required error={(errors as Record<string, { message?: string }>)[`${prefix}PostalCode`]?.message}>
        <Input {...register(`${prefix}PostalCode` as keyof Step2FormData)} placeholder="e.g. 2001" maxLength={5} disabled={prefix === "post" && sameAsPhysical} />
      </FormField>
      <FormField label="Country" required error={(errors as Record<string, { message?: string }>)[`${prefix}Country`]?.message}>
        <Controller name={`${prefix}Country` as keyof Step2FormData} control={control} render={({ field }) => (
          <Select {...field} value={String(field.value ?? "")} options={countryOptions} placeholder="Select country" disabled={prefix === "post" && sameAsPhysical} />
        )} />
      </FormField>
      <FormField label="Province / State" required error={(errors as Record<string, { message?: string }>)[`${prefix}Province`]?.message}>
        <Controller name={`${prefix}Province` as keyof Step2FormData} control={control} render={({ field }) => (
          <Select {...field} value={String(field.value ?? "")} options={provinceOptions} placeholder="Select province" disabled={prefix === "post" && sameAsPhysical} />
        )} />
      </FormField>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      {/* Physical Address */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">Physical Address</h2>
        <AddressSection prefix="phys" title="Physical Address" />
      </section>

      {/* Postal Address */}
      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-6">
          <h2 className="text-base font-bold text-[var(--primary)]">Postal Address</h2>
          <Controller name="sameAsPhysical" control={control} render={({ field }) => (
            <Checkbox checked={!!field.value} onChange={field.onChange} label="Same as physical address" />
          )} />
        </div>
        <AddressSection prefix="post" title="Postal Address" />
      </section>

      {/* Primary Contact */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">
          Primary Contact <span className="text-xs font-normal text-[var(--muted-foreground)] ml-2">Auto-populated from Step 1 — editable</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Full Name" required error={errors.primaryFullName?.message}>
            <Input {...register("primaryFullName")} placeholder="Full name" />
          </FormField>
          <FormField label="Email Address" required error={errors.primaryEmail?.message}>
            <Input {...register("primaryEmail")} type="email" placeholder="email@company.co.za" />
          </FormField>
          <FormField label="Phone Number" required error={errors.primaryPhone?.message}>
            <Input {...register("primaryPhone")} type="tel" placeholder="+27 11 000 0000" />
          </FormField>
        </div>
      </section>

      {/* Secondary Contact */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">Secondary Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField label="Full Name" required error={errors.secondaryFullName?.message}>
            <Input {...register("secondaryFullName")} placeholder="Full name" />
          </FormField>
          <FormField label="Email Address" required error={errors.secondaryEmail?.message}>
            <Input {...register("secondaryEmail")} type="email" placeholder="email@company.co.za" />
          </FormField>
          <FormField label="Phone Number" required error={errors.secondaryPhone?.message}>
            <Input {...register("secondaryPhone")} type="tel" placeholder="+27 11 000 0000" />
          </FormField>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button type="button" variant="outline" size="sm" loading={isSaving} onClick={() => onSaveDraft(watch())}><Save className="h-4 w-4" /> Save Draft</Button>
        </div>
        <Button type="submit" loading={isSubmitting} size="lg">Save & Continue <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}
