"use client";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/wizard/stepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Construction } from "lucide-react";
export default function Step4Page() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
        <Stepper currentStep={4} completedSteps={[1, 2, 3]} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 flex flex-col items-center gap-4 text-center">
        <Construction className="h-10 w-10 text-[var(--primary)]" />
        <h1 className="text-xl font-bold">Step 4 — Product Offerings &amp; Bank Information</h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-sm">This step is under construction and will be available shortly.</p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => router.push("/app/register/step-3")}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button onClick={() => router.push("/app/register/step-5")}>Next <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
