"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3FormData, type OwnerData } from "@/lib/schemas/step3";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, Pencil } from "lucide-react";
import { BBBEE_SECTORS, SECTOR_TURNOVER_BANDS, SANAS_VAS, SHAREHOLDER_TYPES } from "@/lib/reference-data";

const sectorOptions = BBBEE_SECTORS.map((s) => ({ value: s.value, label: s.label }));
const sanasOptions = SANAS_VAS.map((v) => ({ value: v, label: v }));
const shareholderOptions = SHAREHOLDER_TYPES.map((t) => ({ value: t.value, label: t.label }));

const emptyOwner = (): OwnerData => ({
  id: crypto.randomUUID(), fullName: "", shareholderType: "INDIVIDUAL",
  percentageOwnership: 0, idOrRegNumber: "", positionInCompany: "",
});

interface Step3FormProps {
  defaultValues?: Partial<Step3FormData>;
  onSaveDraft: (data: Partial<Step3FormData>) => Promise<void>;
  onNext: (data: Step3FormData) => Promise<void>;
  onBack: () => void;
  isSaving?: boolean;
}

export function Step3Form({ defaultValues, onSaveDraft, onNext, onBack, isSaving }: Step3FormProps) {
  const [owners, setOwners] = useState<OwnerData[]>(defaultValues?.owners ?? []);
  const [editingOwner, setEditingOwner] = useState<OwnerData | null>(null);
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  const { register, handleSubmit, watch, control, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema) as Resolver<Step3FormData>,
    defaultValues: { hasBBBEEDocument: false, owners: [], ...defaultValues },
  });

  const hasBBBEE = watch("hasBBBEEDocument");
  const sector = watch("sector");
  const bdgPct = watch("bdgPct");
  const turnoverBands = sector ? (SECTOR_TURNOVER_BANDS[sector] ?? SECTOR_TURNOVER_BANDS.GENERIC) : [];

  // Auto-save
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => onSaveDraft({ ...watch(), owners }).catch(() => {}), 2000);
    return () => clearTimeout(t);
  }, [isDirty, watch, owners, onSaveDraft]);

  function handleSubmitWithOwners(data: Step3FormData) {
    return onNext({ ...data, owners });
  }

  function saveOwner(owner: OwnerData) {
    if (editingOwner?.id) {
      setOwners((prev) => prev.map((o) => o.id === editingOwner.id ? { ...owner, id: editingOwner.id } : o));
    } else {
      setOwners((prev) => [...prev, { ...owner, id: crypto.randomUUID() }]);
    }
    setShowOwnerForm(false);
    setEditingOwner(null);
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithOwners)} noValidate>
      {/* B-BBEE Document Question */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">B-BBEE Practices &amp; Documentation</h2>
        <FormField label="Does your company have a B-BBEE Certificate or Affidavit?" fieldRef="3000" required error={errors.hasBBBEEDocument?.message} className="mb-6">
          <Controller name="hasBBBEEDocument" control={control} render={({ field }) => (
            <RadioGroup name="hasBBBEEDocument" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
              value={field.value === true ? "true" : field.value === false ? "false" : undefined}
              onChange={(v) => field.onChange(v === "true")} />
          )} />
        </FormField>

        {hasBBBEE && (
          <div className="space-y-6 bg-[var(--accent)] rounded-xl p-6 border border-[var(--border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Sector */}
              <FormField label="B-BBEE Sector" fieldRef="3001" required>
                <Controller name="sector" control={control} render={({ field }) => (
                  <Select {...field} value={field.value ?? ""} options={sectorOptions} placeholder="Select sector..." />
                )} />
              </FormField>

              {/* Turnover Band */}
              <FormField label="Annual Turnover Band" fieldRef="3002" required>
                <Controller name="annualTurnoverBand" control={control} render={({ field }) => (
                  <Select {...field} value={field.value ?? ""} options={turnoverBands.map((b) => ({ value: b.label, label: `${b.label} → ${b.classification}` }))}
                    placeholder="Select turnover band..." onChange={(e) => {
                      field.onChange(e.target.value);
                      const band = turnoverBands.find((b) => b.label === e.target.value);
                      if (band) setValue("classification", band.classification);
                    }} />
                )} />
              </FormField>

              {/* Classification (read-only) */}
              <FormField label="B-BBEE Classification (auto-computed)" fieldRef="3002a">
                <Input value={watch("classification") ?? "— select sector & turnover —"} readOnly disabled className="bg-white font-bold text-[var(--primary)]" />
              </FormField>

              {/* B-BBEE Level */}
              <FormField label="B-BBEE Level" fieldRef="3007" required>
                <Controller name="bbbeeLevel" control={control} render={({ field }) => (
                  <Select {...field} value={field.value?.toString() ?? ""} onChange={(e) => field.onChange(Number(e.target.value))}
                    options={[1,2,3,4,5,6,7,8].map((n) => ({ value: String(n), label: `Level ${n}` }))} placeholder="Select level..." />
                )} />
              </FormField>

              {/* Black Ownership */}
              <FormField label="Black Ownership % (BO)" fieldRef="3003" required error={errors.blackOwnershipPct?.message}>
                <Input {...register("blackOwnershipPct", { valueAsNumber: true })} type="number" min={0} max={100} step={0.01} placeholder="e.g. 51.00" />
              </FormField>

              <FormField label="Is Black-Owned? (BO ≥ 51%)" fieldRef="3004">
                <Controller name="isBlackOwned" control={control} render={({ field }) => (
                  <RadioGroup name="isBlackOwned" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
                    value={field.value === true ? "true" : field.value === false ? "false" : undefined}
                    onChange={(v) => field.onChange(v === "true")} />
                )} />
              </FormField>

              {/* Black Woman Ownership */}
              <FormField label="Black Woman Ownership % (BWO)" fieldRef="3005" required error={errors.blackWomanOwnershipPct?.message}>
                <Input {...register("blackWomanOwnershipPct", { valueAsNumber: true })} type="number" min={0} max={100} step={0.01} placeholder="e.g. 30.00" />
              </FormField>

              <FormField label="Is Black-Woman-Owned? (BWO ≥ 30%)" fieldRef="3006">
                <Controller name="isBlackWomanOwned" control={control} render={({ field }) => (
                  <RadioGroup name="isBlackWomanOwned" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
                    value={field.value === true ? "true" : field.value === false ? "false" : undefined}
                    onChange={(v) => field.onChange(v === "true")} />
                )} />
              </FormField>

              {/* BDG */}
              <FormField label="Black Designated Group % (BDG total)" error={errors.bdgPct?.message}>
                <Input {...register("bdgPct", { valueAsNumber: true })} type="number" min={0} max={100} step={0.01} placeholder="e.g. 25.00" />
              </FormField>
            </div>

            {/* BDG Sub-breakdowns — shown when BDG > 0 */}
            {!!bdgPct && bdgPct > 0 && (
              <div>
                <p className="text-sm font-bold text-[var(--foreground)] mb-3">BDG Sub-breakdowns</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "bdgYouthPct" as const, label: "Youth %" },
                    { name: "bdgDisabledPct" as const, label: "Disabled %" },
                    { name: "bdgUnemployedPct" as const, label: "Unemployed %" },
                    { name: "bdgRuralPct" as const, label: "Rural Areas %" },
                    { name: "bdgMilitaryVetPct" as const, label: "Military Veterans %" },
                  ].map((f) => (
                    <FormField key={f.name} label={f.label} required>
                      <Input {...register(f.name, { valueAsNumber: true })} type="number" min={0} max={100} step={0.01} placeholder="0.00" />
                    </FormField>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Modified Flow-Through */}
              <FormField label="Modified Flow-Through Principle?" fieldRef="3008">
                <Controller name="modifiedFlowThrough" control={control} render={({ field }) => (
                  <RadioGroup name="modifiedFlowThrough" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
                    value={field.value === true ? "true" : field.value === false ? "false" : undefined}
                    onChange={(v) => field.onChange(v === "true")} />
                )} />
              </FormField>

              {/* SANAS VA */}
              <FormField label="SANAS Accredited Verification Agency" required>
                <Controller name="sanasAccreditedVA" control={control} render={({ field }) => (
                  <Select {...field} value={field.value ?? ""} options={sanasOptions} placeholder="Select verification agency..." />
                )} />
              </FormField>

              {/* Certificate Expiry */}
              <FormField label="Expiry Date of Certificate/Affidavit" fieldRef="3009" required error={errors.certExpiryDate?.message}>
                <Input {...register("certExpiryDate")} type="date" />
              </FormField>

              {/* Financial Year End */}
              <FormField label="Latest Financial Year End" fieldRef="3010" required error={errors.latestFinYearEnd?.message}>
                <Input {...register("latestFinYearEnd")} type="date" />
              </FormField>
            </div>
          </div>
        )}
      </section>

      {/* Ownership Profile */}
      <section className="mb-10">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-6">
          <h2 className="text-base font-bold text-[var(--primary)]">Ownership Profile <span className="text-xs font-normal text-[var(--muted-foreground)]">(ref 7001)</span></h2>
          <Button type="button" size="sm" variant="outline" onClick={() => { setEditingOwner(null); setShowOwnerForm(true); }}>
            <Plus className="h-4 w-4" /> Add Owner
          </Button>
        </div>

        {/* Owner list */}
        {owners.length > 0 && (
          <div className="space-y-3 mb-4">
            {owners.map((o) => (
              <div key={o.id} className="flex items-center justify-between bg-[var(--secondary)] rounded-lg px-4 py-3 border border-[var(--border)]">
                <div>
                  <p className="font-bold text-sm">{o.fullName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{o.shareholderType} · {o.percentageOwnership}% · {o.positionInCompany}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="icon" variant="ghost" onClick={() => { setEditingOwner(o); setShowOwnerForm(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setOwners((p) => p.filter((x) => x.id !== o.id))}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {owners.length === 0 && <p className="text-sm text-[var(--muted-foreground)] italic mb-4">No owners added yet. Add at least one owner.</p>}

        {/* Inline owner form */}
        {showOwnerForm && (
          <OwnerForm
            initial={editingOwner ?? emptyOwner()}
            onSave={saveOwner}
            onCancel={() => { setShowOwnerForm(false); setEditingOwner(null); }}
            shareholderOptions={shareholderOptions}
          />
        )}
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button type="button" variant="outline" size="sm" loading={isSaving} onClick={() => onSaveDraft({ ...watch(), owners }).catch(() => {})}><Save className="h-4 w-4" /> Save Draft</Button>
        </div>
        <Button type="submit" loading={isSubmitting} size="lg">Save & Continue <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}

function OwnerForm({ initial, onSave, onCancel, shareholderOptions }: {
  initial: OwnerData;
  onSave: (o: OwnerData) => void;
  onCancel: () => void;
  shareholderOptions: { value: string; label: string }[];
}) {
  const [form, setForm] = useState<OwnerData>(initial);
  return (
    <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-5 space-y-4">
      <p className="font-bold text-sm">{initial.fullName ? "Edit Owner" : "Add Owner"}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Full Name" required>
          <Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Full legal name" />
        </FormField>
        <FormField label="Shareholder Type" required>
          <Select value={form.shareholderType} options={shareholderOptions} onChange={(e) => setForm((p) => ({ ...p, shareholderType: e.target.value as "INDIVIDUAL" | "COMPANY" }))} />
        </FormField>
        <FormField label="Ownership %" required>
          <Input type="number" min={0} max={100} step={0.01} value={form.percentageOwnership} onChange={(e) => setForm((p) => ({ ...p, percentageOwnership: Number(e.target.value) }))} placeholder="e.g. 51.00" />
        </FormField>
        <FormField label="ID / Registration Number" required>
          <Input value={form.idOrRegNumber} onChange={(e) => setForm((p) => ({ ...p, idOrRegNumber: e.target.value }))} placeholder="ID or company reg number" />
        </FormField>
        <FormField label="Position in Company" required className="md:col-span-2">
          <Input value={form.positionInCompany} onChange={(e) => setForm((p) => ({ ...p, positionInCompany: e.target.value }))} placeholder="e.g. Director, Shareholder" />
        </FormField>
      </div>
      <div className="flex gap-3">
        <Button type="button" onClick={() => onSave(form)} disabled={!form.fullName || !form.idOrRegNumber || !form.positionInCompany}>
          {initial.fullName ? "Update Owner" : "Add Owner"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
