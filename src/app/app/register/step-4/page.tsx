"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Step4Form } from "@/components/wizard/step4-form";
import type { Step4FormData } from "@/lib/schemas/step4";

function getStorage(key: string) { return typeof window !== "undefined" ? localStorage.getItem(key) ?? "" : ""; }

export default function Step4Page() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function post(data: Partial<Step4FormData>, draft: boolean) {
    const res = await fetch("/api/register/step-4", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, draft, supplierId: getStorage("4syte_supplier_id") }),
    });
    if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
  }

  async function handleSaveDraft(data: Partial<Step4FormData>) {
    setIsSaving(true);
    try { await post(data, true); setSavedAt(new Date()); } catch { } finally { setIsSaving(false); }
  }

  async function handleNext(data: Step4FormData) {
    await post(data, false);
    router.push("/app/register/step-5");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={4} completedSteps={[1, 2, 3]} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Step 4 — Product Offerings &amp; Bank Information</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Fields marked <span className="text-red-500">*</span> are required.</p>
          </div>
          {savedAt && <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap mt-1">✓ Saved {savedAt.toLocaleTimeString()}</span>}
        </div>
        <Step4Form onSaveDraft={handleSaveDraft} onNext={handleNext} onBack={() => router.push("/app/register/step-3")} isSaving={isSaving} />
      </div>
    </div>
  );
}
