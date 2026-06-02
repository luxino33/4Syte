"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const WIZARD_STEPS = [
  { number: 1, label: "Company Information" },
  { number: 2, label: "Address & Contacts" },
  { number: 3, label: "B-BBEE Practices" },
  { number: 4, label: "Products & Bank" },
  { number: 5, label: "Documents" },
  { number: 6, label: "B-BBEE Validation" },
] as const;

interface StepperProps {
  currentStep: number;
  completedSteps?: number[];
}

export function Stepper({ currentStep, completedSteps = [] }: StepperProps) {
  return (
    <nav aria-label="Registration progress" className="w-full">
      {/* Desktop */}
      <ol className="hidden md:flex items-center w-full">
        {WIZARD_STEPS.map((step, idx) => {
          const isComplete = completedSteps.includes(step.number);
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep && !isComplete;

          return (
            <li key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 group">
                {/* Circle */}
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 font-bold text-sm transition-all",
                    isComplete &&
                      "bg-[var(--primary)] border-[var(--primary)] text-white",
                    isCurrent &&
                      "bg-white border-[var(--primary)] text-[var(--primary)] ring-4 ring-blue-100",
                    isUpcoming && "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : step.number}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    "text-xs font-bold text-center max-w-[80px] leading-tight",
                    isCurrent && "text-[var(--primary)]",
                    isComplete && "text-[var(--primary)]",
                    isUpcoming && "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector */}
              {idx < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mb-5",
                    isComplete ? "bg-[var(--primary)]" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile — compact progress */}
      <div className="md:hidden flex items-center gap-3">
        <div className="flex gap-1">
          {WIZARD_STEPS.map((step) => {
            const isComplete = completedSteps.includes(step.number);
            const isCurrent = step.number === currentStep;
            return (
              <div
                key={step.number}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  isCurrent ? "w-6 bg-[var(--primary)]" : isComplete ? "w-3 bg-[var(--primary)]" : "w-3 bg-slate-200"
                )}
              />
            );
          })}
        </div>
        <span className="text-sm font-bold text-[var(--foreground)]">
          Step {currentStep} of {WIZARD_STEPS.length} —{" "}
          {WIZARD_STEPS.find((s) => s.number === currentStep)?.label}
        </span>
      </div>
    </nav>
  );
}
