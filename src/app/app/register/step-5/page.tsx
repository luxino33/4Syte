"use client";

import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Step5Form } from "@/components/wizard/step5-form";

function getStorage(key: string) { return typeof window !== "undefined" ? localStorage.getItem(key) ?? "" : ""; }

export default function Step5Page() {
  const router = useRouter();

  async function handleNext(_docs: Record<string, unknown>, agreements: { type: string; version: string; accepted: boolean }[]) {
    const supplierId = getStorage("4syte_supplier_id");
    const res = await fetch("/api/register/step-5", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, agreements }),
    });
    if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
    router.push("/app/register/step-6");
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={5} completedSteps={[1, 2, 3, 4]} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Step 5 — Supporting Documents &amp; Agreements</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Upload required documents and accept the agreements to continue.</p>
        </div>
        <Step5Form onNext={handleNext} onBack={() => router.push("/app/register/step-4")} />
      </div>
    </div>
  );
}
