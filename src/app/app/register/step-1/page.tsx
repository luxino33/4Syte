"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Step1Form } from "@/components/wizard/step1-form";
import type { Step1FormData } from "@/lib/schemas/step1";

// Returns a stable browser session ID stored in localStorage
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("4syte_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("4syte_session_id", sid);
  }
  return sid;
}

function getSupplierId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("4syte_supplier_id") ?? "";
}

function setSupplierId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("4syte_supplier_id", id);
}

export default function Step1Page() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function post(data: Partial<Step1FormData>, draft: boolean) {
    const res = await fetch("/api/register/step-1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        draft,
        sessionId: getSessionId(),
        supplierId: getSupplierId(),
      }),
    });
    const json = await res.json();
    if (json.supplierId) setSupplierId(json.supplierId);
    return { ok: res.ok, json };
  }

  async function handleSaveDraft(data: Partial<Step1FormData>) {
    setIsSaving(true);
    try {
      await post(data, true);
      setSavedAt(new Date());
    } catch {
      // silent draft failure is acceptable
    } finally {
      setIsSaving(false);
    }
  }

  async function handleNext(data: Step1FormData) {
    const { ok, json } = await post(data, false);
    if (!ok) throw new Error(json.error ?? "Failed to save");
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
