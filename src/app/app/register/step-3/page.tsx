"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Step3Form } from "@/components/wizard/step3-form";
import type { Step3FormData } from "@/lib/schemas/step3";

function getStorage(key: string) { return typeof window !== "undefined" ? localStorage.getItem(key) ?? "" : ""; }

export default function Step3Page() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function post(data: Partial<Step3FormData>, draft: boolean) {
    const res = await fetch("/api/register/step-3", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, draft, supplierId: getStorage("4syte_supplier_id") }),
    });
    if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
  }

  async function handleSaveDraft(data: Partial<Step3FormData>) {
    setIsSaving(true);
    try { await post(data, true); setSavedAt(new Date()); } catch { } finally { setIsSaving(false); }
  }

  async function handleNext(data: Step3FormData) {
    await post(data, false);
    router.push("/app/register/step-4");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={3} completedSteps={[1, 2]} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Step 3 — B-BBEE Practices &amp; Ownership</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Fields marked <span className="text-red-500">*</span> are required.</p>
          </div>
          {savedAt && <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap mt-1">✓ Saved {savedAt.toLocaleTimeString()}</span>}
        </div>
        <Step3Form onSaveDraft={handleSaveDraft} onNext={handleNext} onBack={() => router.push("/app/register/step-2")} isSaving={isSaving} />
      </div>
    </div>
  );
}
