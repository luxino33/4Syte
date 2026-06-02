"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
        "placeholder:text-[var(--muted-foreground)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--muted)]",
        error
          ? "border-[var(--destructive)] focus-visible:ring-red-300"
          : "border-[var(--border)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
