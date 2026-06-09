"use client";
import Link from "next/link";
import { FileText, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#1a3a5c] text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="font-bold text-white text-sm">4S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">4Syte</span>
        </Link>
        <span className="text-sm text-white/80">Supplier Portal</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-[#e2f0fb] flex items-center justify-center">
              <Clock className="h-7 w-7 text-[#1a3a5c]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Application In Progress</h1>
          <p className="text-sm text-[#64748b] max-w-sm mx-auto">
            Your supplier registration is saved as a draft. Continue where you left off.
          </p>
          <Link
            href="/app/register/step-1"
            className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#152e4d] transition-colors"
          >
            Continue Registration <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: "Step 1", desc: "Company Information", href: "/app/register/step-1" },
            { icon: FileText, label: "Step 2", desc: "Address & Contacts", href: "/app/register/step-2" },
            { icon: CheckCircle, label: "B-BBEE", desc: "Validation Status", href: "/app/register/step-6" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex items-center gap-4 hover:border-[#1a3a5c] transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-[#e2f0fb] flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-[#1a3a5c]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#0f172a]">{item.label}</p>
                <p className="text-xs text-[#64748b]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
