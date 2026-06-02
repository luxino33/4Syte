import { Stepper } from "@/components/wizard/stepper";

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--muted)]">
      {/* Top bar */}
      <header className="bg-[var(--primary)] text-white px-6 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-white/20 flex items-center justify-center">
            <span className="font-bold text-white text-sm">4S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">4Syte</span>
        </div>
        <span className="text-sm text-white/80">Supplier Registration</span>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
