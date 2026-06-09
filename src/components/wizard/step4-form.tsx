"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, type Step4FormData, type ProductLineData } from "@/lib/schemas/step4";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2 } from "lucide-react";
import { SA_BANKS, ACCOUNT_TYPES, UNSPSC_CODES, SA_PROVINCES } from "@/lib/reference-data";

const bankOptions = SA_BANKS.map((b) => ({ value: b, label: b }));
const accountTypeOptions = ACCOUNT_TYPES;
const regionOptions = SA_PROVINCES.map((p) => ({ value: p.code, label: p.name }));

interface Step4FormProps {
  defaultValues?: Partial<Step4FormData>;
  onSaveDraft: (data: Partial<Step4FormData>) => Promise<void>;
  onNext: (data: Step4FormData) => Promise<void>;
  onBack: () => void;
  isSaving?: boolean;
}

export function Step4Form({ defaultValues, onSaveDraft, onNext, onBack, isSaving }: Step4FormProps) {
  const [productLines, setProductLines] = useState<ProductLineData[]>(defaultValues?.productLines ?? []);

  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting, isDirty } } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema) as Resolver<Step4FormData>,
    defaultValues: {
      unspscCodes: [],
      productLines: [],
      notifyOpportunities: false,
      accountType: "CURRENT",
      ...defaultValues,
    },
  });

  const selectedCodes = watch("unspscCodes") ?? [];

  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => onSaveDraft({ ...watch(), productLines }).catch(() => {}), 2000);
    return () => clearTimeout(t);
  }, [isDirty, watch, productLines, onSaveDraft]);

  function toggleCode(code: string, currentCodes: string[], onChange: (v: string[]) => void) {
    if (currentCodes.includes(code)) onChange(currentCodes.filter((c) => c !== code));
    else onChange([...currentCodes, code]);
  }

  function addProductLine() {
    setProductLines((p) => [...p, { id: crypto.randomUUID(), name: "", description: "", region: "GP" }]);
  }

  function updateLine(id: string, field: keyof ProductLineData, value: string) {
    setProductLines((p) => p.map((l) => l.id === id ? { ...l, [field]: value } : l));
  }

  return (
    <form onSubmit={handleSubmit((d) => onNext({ ...d, productLines }))} noValidate>
      {/* Product Offerings */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">Product &amp; Service Offerings</h2>

        {/* UNSPSC Code selection */}
        <FormField label="Select Products and/or Services (UNSPSC)" fieldRef="4000" required error={errors.unspscCodes?.message} className="mb-6">
          <Controller name="unspscCodes" control={control} render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {UNSPSC_CODES.map((item) => (
                <Checkbox key={item.code} checked={field.value?.includes(item.code)}
                  onChange={() => toggleCode(item.code, field.value ?? [], field.onChange)}
                  label={`${item.code} — ${item.title}`} />
              ))}
            </div>
          )} />
        </FormField>

        {/* Business Summary */}
        <FormField label="Summary of nature of business" fieldRef="4001" required error={errors.businessSummary?.message} className="mb-6">
          <Controller name="businessSummary" control={control} render={({ field }) => (
            <Textarea {...field} placeholder="Describe what your company does (max 1000 characters)..." maxLength={1000} rows={4} error={errors.businessSummary?.message} />
          )} />
          <p className="text-xs text-[var(--muted-foreground)] text-right">{watch("businessSummary")?.length ?? 0}/1000</p>
        </FormField>

        {/* Product/Service Lines */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Product / Service Lines <span className="text-red-500">*</span></p>
            <Button type="button" size="sm" variant="outline" onClick={addProductLine}><Plus className="h-4 w-4" /> Add Line</Button>
          </div>
          {productLines.length === 0 && <p className="text-sm italic text-[var(--muted-foreground)]">No product lines added. Click &ldquo;Add Line&rdquo;.</p>}
          <div className="space-y-3">
            {productLines.map((line, idx) => (
              <div key={line.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[var(--secondary)] rounded-lg p-4 border border-[var(--border)]">
                <FormField label={`Name ${idx + 1}`} required>
                  <Input value={line.name} onChange={(e) => updateLine(line.id!, "name", e.target.value)} placeholder="Product or service name" />
                </FormField>
                <FormField label="Description">
                  <Input value={line.description ?? ""} onChange={(e) => updateLine(line.id!, "description", e.target.value)} placeholder="Brief description" />
                </FormField>
                <div className="flex gap-2 items-end">
                  <FormField label="Region available" required className="flex-1">
                    <Select value={line.region} options={regionOptions} onChange={(e) => updateLine(line.id!, "region", e.target.value)} />
                  </FormField>
                  <Button type="button" size="icon" variant="ghost" className="mb-0.5" onClick={() => setProductLines((p) => p.filter((l) => l.id !== line.id))}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify opportunities */}
        <Controller name="notifyOpportunities" control={control} render={({ field }) => (
          <Checkbox checked={!!field.value} onChange={field.onChange} label="Notify me about new procurement opportunities (eRFx alerts)" />
        )} />
      </section>

      {/* Bank Information */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">Bank Information</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-5">Certified proof of bank account required (upload in Step 5).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Bank Name" required error={errors.bankName?.message}>
            <Controller name="bankName" control={control} render={({ field }) => (
              <Select {...field} value={field.value ?? ""} options={bankOptions} placeholder="Select bank..." />
            )} />
          </FormField>
          <FormField label="Account Type" required error={errors.accountType?.message}>
            <Controller name="accountType" control={control} render={({ field }) => (
              <Select {...field} value={field.value ?? ""} options={accountTypeOptions} placeholder="Select type..." />
            )} />
          </FormField>
          <FormField label="Branch Name" required error={errors.branchName?.message}>
            <Input {...register("branchName")} placeholder="e.g. Sandton City" />
          </FormField>
          <FormField label="Branch Number" required error={errors.branchNumber?.message}>
            <Input {...register("branchNumber")} placeholder="e.g. 198765" />
          </FormField>
          <FormField label="SWIFT / BIC Code" required error={errors.swiftCode?.message}>
            <Input {...register("swiftCode")} placeholder="e.g. ABSAZAJJ" />
          </FormField>
          <FormField label="Account Number" required error={errors.accountNumber?.message}>
            <Input {...register("accountNumber")} placeholder="Account number" />
          </FormField>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button type="button" variant="outline" size="sm" loading={isSaving} onClick={() => onSaveDraft({ ...watch(), productLines }).catch(() => {})}><Save className="h-4 w-4" /> Save Draft</Button>
        </div>
        <Button type="submit" loading={isSubmitting} size="lg">Save & Continue <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}
