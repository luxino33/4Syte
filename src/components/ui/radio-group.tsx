"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function RadioGroup({ name, options, value, onChange, error, className }: RadioGroupProps) {
  return (
    <div className={cn("flex gap-4", className)} role="radiogroup">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex items-center gap-2 cursor-pointer rounded-md border px-4 py-2.5 text-sm font-medium transition-colors",
            value === opt.value
              ? "border-[var(--primary)] bg-[var(--accent)] text-[var(--primary)]"
              : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]",
            error && "border-[var(--destructive)]"
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            className="sr-only"
          />
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border-2",
              value === opt.value ? "border-[var(--primary)]" : "border-slate-300"
            )}
          >
            {value === opt.value && (
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            )}
          </span>
          {opt.label}
        </label>
      ))}
    </div>
  );
}
