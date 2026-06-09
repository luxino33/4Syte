"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /register simply kicks off the wizard at step 1
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/register/step-1");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-[#1a3a5c] border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-[#1a3a5c]">Starting your registration…</p>
      </div>
    </div>
  );
}
