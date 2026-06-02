"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  fieldRef?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  fieldRef,
  error,
  hint,
  required,
  optional,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1">
        {fieldRef && (
          <span className="text-xs font-normal text-[var(--muted-foreground)] mr-1 tabular-nums">
            [{fieldRef}]
          </span>
        )}
        {label}
        {required && <span className="text-[var(--destructive)] ml-0.5">*</span>}
        {optional && (
          <span className="text-xs font-normal text-[var(--muted-foreground)] ml-1">(optional)</span>
        )}
      </label>
      {hint && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-[var(--destructive)] flex items-center gap-1" role="alert">
          <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
