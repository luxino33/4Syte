"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, CheckCircle, Clock } from "lucide-react";

function getStorage(key: string) { return typeof window !== "undefined" ? localStorage.getItem(key) ?? "" : ""; }

export default function Step6Page() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");
    try {
      const supplierId = getStorage("4syte_supplier_id");
      const res = await fetch("/api/register/step-6", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Submission failed"); }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 md:p-8">
        {!submitted ? (
          <>
            <div className="mb-8">
              <h1 className="text-xl font-bold">Step 6 — B-BBEE Validation</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Final submission — review and confirm.</p>
            </div>

            <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-6 mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">What happens after you submit?</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                    After pressing submit, your registration is pending B-BBEE validation on the affidavit/certificate you uploaded.
                    A confirmation email with next steps will follow shortly.
                  </p>
                </div>
              </div>
              <ul className="text-sm text-[var(--muted-foreground)] space-y-1.5 ml-8">
                <li>✓ Your B-BBEE document will be automatically validated</li>
                <li>✓ If valid, you will be advanced to the onboarding phase</li>
                <li>✓ If corrections are needed, you will be notified with a pre-filled template</li>
                <li>✓ You can track your status on your dashboard at any time</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">{error}</div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <Button type="button" variant="outline" onClick={() => router.push("/app/register/step-5")}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button size="lg" loading={isSubmitting} onClick={handleSubmit}>
                <Send className="h-4 w-4" /> Submit Registration
              </Button>
            </div>
          </>
        ) : (
          /* Success screen */
          <div className="flex flex-col items-center text-center py-12 gap-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Registration Submitted!</h1>
              <p className="text-[var(--muted-foreground)] mt-2 max-w-md leading-relaxed">
                Your registration is pending B-BBEE validation. A confirmation email with next steps will be sent to you shortly.
              </p>
            </div>
            <div className="bg-[var(--accent)] border border-[var(--border)] rounded-xl p-5 w-full max-w-sm text-left space-y-2">
              <p className="font-bold text-sm">What&apos;s next?</p>
              <ol className="text-sm text-[var(--muted-foreground)] space-y-1 list-decimal ml-4">
                <li>B-BBEE document validation (automated)</li>
                <li>Onboarding request initiation</li>
                <li>L1 &amp; L2 approval process</li>
                <li>3rd-party vetting checks</li>
                <li>Vendor number allocated via ERP</li>
              </ol>
            </div>
            <Button onClick={() => router.push("/app")}>Go to My Dashboard</Button>
          </div>
        )}
      </div>
    </div>
  );
}
