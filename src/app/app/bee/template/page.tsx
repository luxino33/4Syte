"use client";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function BeeTemplatePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <Construction className="h-12 w-12 text-[#1a3a5c]" />
      <h1 className="text-2xl font-bold text-[#0f172a]">B-BBEE Affidavit Template</h1>
      <p className="text-sm text-[#64748b] max-w-sm">
        This page will display your pre-populated B-BBEE affidavit template for commissioning and re-upload.
        It is under construction and will be available shortly.
      </p>
      <Link href="/app" className="text-[#1a3a5c] font-bold hover:underline text-sm">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
