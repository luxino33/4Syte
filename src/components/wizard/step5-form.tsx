"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Upload, CheckCircle, FileText, X } from "lucide-react";

interface DocFile { name: string; size: number; type: string; file?: File }
interface DocSlot { id: string; label: string; required: boolean; hint?: string }

const DOC_SLOTS: DocSlot[] = [
  { id: "COI",        label: "Certificate of Incorporation",   required: true,  hint: "CIPC issued certificate" },
  { id: "BANK_PROOF", label: "Certified Proof of Bank Account", required: true,  hint: "Not older than 3 months" },
  { id: "VAT_CERT",   label: "VAT Registration Certificate",   required: false, hint: "Required if VAT registered" },
  { id: "TAX_CLEARANCE", label: "Tax Clearance Certificate",   required: false, hint: "Required if Tax Clearance PIN captured" },
  { id: "BBBEE",      label: "B-BBEE Certificate / Affidavit", required: false, hint: "Required if B-BBEE document = Yes" },
];

const AGREEMENTS = [
  { type: "TERMS_AND_CONDITIONS",      label: "Terms and Conditions",          version: "1.0" },
  { type: "PRIVACY_POLICY",            label: "Privacy Policy",                version: "1.0" },
  { type: "SUPPLIER_CODE_OF_CONDUCT",  label: "Supplier Code of Conduct",      version: "1.0" },
  { type: "DATA_PROCESSING",           label: "Data Processing Agreement",     version: "1.0" },
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

interface Step5FormProps {
  onNext: (docs: Record<string, DocFile>, agreements: { type: string; version: string; accepted: boolean }[]) => Promise<void>;
  onBack: () => void;
}

export function Step5Form({ onNext, onBack }: Step5FormProps) {
  const [docs, setDocs] = useState<Record<string, DocFile>>({});
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFile(slotId: string, file: File | null) {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, [slotId]: "Only PDF, JPG, PNG allowed" }));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrors((p) => ({ ...p, [slotId]: "File must be under 10 MB" }));
      return;
    }
    setErrors((p) => { const n = { ...p }; delete n[slotId]; return n; });
    setDocs((p) => ({ ...p, [slotId]: { name: file.name, size: file.size, type: file.type, file } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    DOC_SLOTS.filter((s) => s.required).forEach((s) => {
      if (!docs[s.id]) newErrors[s.id] = "This document is required";
    });
    if (!agreements["TERMS_AND_CONDITIONS"]) newErrors["agree_terms"] = "You must accept the Terms and Conditions";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    try {
      const agList = AGREEMENTS.map((a) => ({ type: a.type, version: a.version, accepted: !!agreements[a.type] }));
      await onNext(docs, agList);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Documents */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-2">Supporting Documents</h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">Accepted formats: PDF, JPG, PNG · Max 10 MB per file · Must be latest and valid.</p>
        <div className="space-y-4">
          {DOC_SLOTS.map((slot) => {
            const uploaded = docs[slot.id];
            return (
              <div key={slot.id} className={`flex items-start gap-4 rounded-xl border p-4 ${uploaded ? "border-green-300 bg-green-50" : "border-[var(--border)] bg-white"}`}>
                <div className="flex-1">
                  <p className="font-bold text-sm">{slot.label} {slot.required && <span className="text-red-500">*</span>}</p>
                  {slot.hint && <p className="text-xs text-[var(--muted-foreground)]">{slot.hint}</p>}
                  {errors[slot.id] && <p className="text-xs text-red-500 mt-1">{errors[slot.id]}</p>}
                  {uploaded && <p className="text-xs text-green-700 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {uploaded.name} ({(uploaded.size / 1024).toFixed(0)} KB)</p>}
                </div>
                <div className="flex gap-2 items-center">
                  {uploaded && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => setDocs((p) => { const n = { ...p }; delete n[slot.id]; return n; })}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  <label className="cursor-pointer">
                    <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFile(slot.id, e.target.files?.[0] ?? null)} />
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-bold hover:bg-[var(--secondary)] transition-colors">
                      {uploaded ? <><FileText className="h-4 w-4" /> Replace</> : <><Upload className="h-4 w-4" /> Upload</>}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Agreements */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-6">Agreements &amp; Declarations</h2>
        <div className="space-y-4">
          {AGREEMENTS.map((ag) => (
            <div key={ag.type} className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-4">
              <Checkbox checked={!!agreements[ag.type]} onChange={(v) => setAgreements((p) => ({ ...p, [ag.type]: v }))} />
              <div>
                <p className="text-sm font-bold">{ag.label} <span className="text-xs font-normal text-[var(--muted-foreground)]">v{ag.version}</span></p>
                <p className="text-xs text-[var(--muted-foreground)]">I have read and agree to the {ag.label}.</p>
                {ag.type === "TERMS_AND_CONDITIONS" && errors["agree_terms"] && (
                  <p className="text-xs text-red-500 mt-1">{errors["agree_terms"]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back</Button>
        <Button type="submit" loading={isSubmitting} size="lg">Save & Continue <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}
