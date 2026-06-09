"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";

// No auth required — users resume their application via their browser session
export default function LoginPage() {
  const router = useRouter();

  function handleContinue() {
    // The session ID is already in localStorage from their previous visit
    // Just send them back into the wizard at step 1 — it will auto-resume
    router.push("/app/register/step-1");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Nav */}
      <header className="bg-[#1a3a5c] text-white px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="font-bold text-white text-sm">4S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">4Syte</span>
        </a>
        <a
          href="/register"
          className="text-sm font-bold bg-white text-[#1a3a5c] px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          New Registration
        </a>
      </header>

      {/* Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-[#e2f0fb] flex items-center justify-center">
              <FileText className="h-7 w-7 text-[#1a3a5c]" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Continue Your Application</h1>
            <p className="text-sm text-[#64748b] mt-2 leading-relaxed">
              Your progress is saved automatically in your browser. Click below to
              pick up where you left off.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1a3a5c] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#152e4d] transition-colors"
          >
            Continue Application
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="border-t border-[#e2e8f0] pt-4">
            <p className="text-sm text-[#64748b]">
              Starting a new registration?{" "}
              <a href="/register" className="text-[#1a3a5c] font-bold hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
