import Header from "@/components/header";
import Footer from "@/components/footer";
import { Mail } from "lucide-react";
import Image from "next/image";

const loanOffers = [
  {
    bank: "Kotak Mahindra Bank",
    rate: "7.55%",
    emi: "10,000",
    amount: "35,689",
    ltv: "90%",
    initials: "/assets/logo/1.png",
    accent: "bg-red-100 text-red-700",
  },
  {
    bank: "HDFC Bank",
    rate: "8.50%",
    emi: "13,000",
    amount: "37,195",
    ltv: "90%",
    initials: "/assets/logo/2.png",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    bank: "LIC Housing Finance Ltd",
    rate: "6.90%",
    emi: "5,000",
    amount: "34,678",
    ltv: "90%",
    initials: "/assets/logo/3.png",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    bank: "SBI Home Loans",
    rate: "6.80%",
    emi: "10,000",
    amount: "34,524",
    ltv: "90%",
    initials: "/assets/logo/4.png",
    accent: "bg-cyan-100 text-cyan-700",
  },
  {
    bank: "Axis Bank",
    rate: "6.90%",
    emi: "10,000",
    amount: "34,678",
    ltv: "90%",
    initials: "/assets/logo/5.png",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    bank: "PNB Housing Finance",
    rate: "9.25%",
    emi: "10,000",
    amount: "38,409",
    ltv: "90%",
    initials: "/assets/logo/7.png",
    accent: "bg-orange-100 text-orange-700",
  },
];

function Metric({ label, value }) {
  return (
    <div className="text-left min-w-[86px]">
      <p className="text-[13px] leading-tight font-bold text-slate-700">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function LoanOffersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-100 text-slate-900 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loanOffers.map((offer) => (
              <div
                key={offer.bank}
                className="grid grid-cols-1 md:grid-cols-[1.55fr_1.2fr_280px] items-center gap-4 px-4 sm:px-6 py-5 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <div className={`relative w-full h-full rounded-full flex items-center justify-center ${offer.accent}`}>
                      <Image
                        src={offer.initials}
                        alt={`${offer.bank} logo`}
                        fill
                        className="object-contain "
                      />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">{offer.bank}</h3>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  <div className="min-w-[70px]">
                    <p className="text-lg font-bold text-emerald-600 leading-tight">{offer.rate}</p>
                  </div>
                  <Metric label="EMI" value={`₹${offer.emi}`} />
                  <Metric label="Loan Amount" value={`₹${offer.amount}`} />
                  <Metric label="Loan to value ratio" value={offer.ltv} />
                </div>

                <div className="flex items-center justify-start md:justify-end gap-3 md:gap-4">
                  <button className="hidden sm:inline-flex items-center gap-1.5 text-xs leading-none whitespace-nowrap text-slate-500 hover:text-slate-700 transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    Email me this deal
                  </button>
                  <button className="rounded-xl bg-[#24103f] hover:bg-[#321a52] text-white text-sm font-semibold px-5 py-2.5 transition-colors">
                    Get me this deal
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Calculate housing loan eligibility</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">
              Calculate your borrowing eligibility by submitting your details below
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-1 mb-5 flex items-center justify-between">
                  <span className="text-sm text-slate-700 px-3">Number of Borrowers</span>
                  <div className="flex gap-1">
                    <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#24103f] text-white">One</button>
                    <button className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600">Two</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Your Age</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">35</span>
                      <span className="text-sm text-slate-400">Years</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Occupation</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Salaried</span>
                      <span className="text-sm text-slate-400">v</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Net Income</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">₹ 2,00,000</span>
                      <span className="text-sm text-slate-400">Monthly</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Existing Monthly EMI</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">₹ 20,000</span>
                      <span className="text-sm text-slate-400">Monthly</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Rate of Interest</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">8.9</span>
                      <span className="text-sm text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">Tenure</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">20</span>
                      <span className="text-sm text-slate-400">Years</span>
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-xl bg-[#24103f] hover:bg-[#321a52] text-white font-semibold py-3 transition-colors">
                  Calculate
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <p className="text-sm text-slate-600 text-center mb-4">Your Estimated Results</p>
                <div className="h-52 rounded-lg bg-slate-50 border border-slate-200 relative overflow-hidden">
                  <svg viewBox="0 0 500 220" className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="areaA" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6fc3b6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#6fc3b6" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="areaB" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#526574" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#526574" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path d="M0 175 C65 130, 100 85, 170 75 C235 68, 250 145, 320 150 C390 154, 425 125, 500 112 L500 220 L0 220 Z" fill="url(#areaB)" />
                    <path d="M0 220 C55 160, 110 120, 170 125 C230 130, 245 175, 315 170 C380 165, 440 145, 500 220 L0 220 Z" fill="url(#areaA)" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5 text-center">
                  <div>
                    <p className="text-xs text-slate-500">You could borrow upto</p>
                    <p className="text-xl font-bold text-slate-800">₹ 1,34,33,270</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payable Amount</p>
                    <p className="text-xl font-bold text-emerald-600">₹ 2,88,00,000</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 text-center mt-4">Monthly EMI <span className="font-bold text-slate-700">₹ 1,20,000</span></p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default LoanOffersPage;
