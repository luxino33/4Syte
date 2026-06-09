"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({ checked, onChange, label, disabled, className, id }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2.5 cursor-pointer group", disabled && "opacity-50 cursor-not-allowed", className)}>
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        id={id}
        onKeyDown={(e) => e.key === " " && !disabled && onChange?.(!checked)}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors",
          checked ? "bg-[var(--primary)] border-[var(--primary)]" : "bg-white border-slate-300 group-hover:border-[var(--primary)]"
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
    </label>
  );
}
