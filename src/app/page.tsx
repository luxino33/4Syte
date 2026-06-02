import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, FileText, BarChart3 } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "6-Step Registration Wizard",
    description:
      "Guided supplier onboarding covering company info, B-BBEE practices, product offerings, documents, and more.",
  },
  {
    icon: Shield,
    title: "Automated B-BBEE Validation",
    description:
      "AI-assisted document extraction paired with a deterministic rules engine — fully auditable, sector-aware validation.",
  },
  {
    icon: CheckCircle,
    title: "Onboarding Pipeline",
    description:
      "Multi-level approval workflow with 3rd-party vetting and ERP vendor number allocation.",
  },
  {
    icon: BarChart3,
    title: "Procurement Reporting",
    description:
      "B-BBEE P.P reports, supply overview, and forecasted scenario dashboards with live data.",
  },
];

const steps = [
  { number: "01", label: "Register & verify your account" },
  { number: "02", label: "Complete the 6-step supplier wizard" },
  { number: "03", label: "B-BBEE document auto-validated" },
  { number: "04", label: "Onboarded & allocated a vendor number" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      {/* Nav */}
      <header className="bg-[#1a3a5c] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="font-bold text-white text-sm">4S</span>
          </div>
          <span className="font-bold text-xl tracking-tight">4Syte</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-white/80 hover:text-white px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-white text-[#1a3a5c] px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Register as Supplier
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#0f2640] text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-200">
            <Shield className="h-4 w-4" />
            South African Procurement Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Supplier Registration &amp;<br />B-BBEE Validation Platform
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            Register your business, validate your B-BBEE documents automatically, and get
            onboarded faster — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a3a5c] font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-base"
            >
              Start Registration
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-base"
            >
              Continue Application
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1a3a5c] mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#e2f0fb] flex items-center justify-center">
                  <span className="text-[#1a3a5c] font-bold text-sm">{step.number}</span>
                </div>
                <p className="text-sm font-semibold text-[#0f172a] leading-snug">{step.label}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#1a3a5c] mb-12">
            Everything you need for compliant supplier onboarding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-[#e2e8f0] p-6 flex gap-4"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#e2f0fb] flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-[#1a3a5c]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] mb-1">{f.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#1a3a5c] text-white text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Ready to register your business?</h2>
          <p className="text-blue-200 text-sm">
            Join the supplier database. Your B-BBEE documents are validated automatically.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-[#1a3a5c] font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2640] text-white/50 text-xs text-center py-5 px-6">
        © {new Date().getFullYear()} 4Syte. South African Supplier Registration &amp; B-BBEE Validation Platform.
      </footer>
    </div>
  );
}
