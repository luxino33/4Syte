import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(value: string): string {
  // Strip everything except digits, +, spaces
  return value.replace(/[^\d+\s\-()]/g, "").slice(0, 15);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
