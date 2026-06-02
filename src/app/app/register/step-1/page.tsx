"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Step1Form } from "@/components/wizard/step1-form";
import type { Step1FormData } from "@/lib/schemas/step1";

// Placeholder — will be replaced by auth session in the full build
const MOCK_SUPPLIER_ID = "dev-supplier-id";

export default function Step1Page() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function handleSaveDraft(data: Partial<Step1FormData>) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/register/step-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, draft: true }),
      });
      if (res.ok) setSavedAt(new Date());
    } catch {
      // Silent draft save failure is acceptable
    } finally {
      setIsSaving(false);
    }
  }

  async function handleNext(data: Step1FormData) {
    const res = await fetch("/api/register/step-1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to save");
    }

    router.push("/app/register/step-2");
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={1} completedSteps={[]} />
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Step 1 — Company Information
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              All fields marked <span className="text-[var(--destructive)]">*</span> are required.
              Your progress is saved automatically.
            </p>
          </div>
          {savedAt && (
            <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap mt-1">
              ✓ Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>

        <Step1Form
          onSaveDraft={handleSaveDraft}
          onNext={handleNext}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
