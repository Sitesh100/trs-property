import Header from "@/components/header";
import Footer from "@/components/footer";
import { Mail } from "lucide-react";
import Image from "next/image";

const offers = [
  { bank: "Kotak Mahindra Bank", rate: "7.55%", emi: "10,000", amount: "35,689", ltv: "90%", initials: "/assets/logo/1.png", accent: "bg-red-100 text-red-700" },
  { bank: "HDFC", rate: "8.50%", emi: "13,000", amount: "37,195", ltv: "90%", initials: "/assets/logo/2.png", accent: "bg-blue-100 text-blue-700" },
  { bank: "LIC Housing Finance Ltd", rate: "6.90%", emi: "5,000", amount: "34,678", ltv: "90%", initials: "/assets/logo/3.png", accent: "bg-amber-100 text-amber-700" },
  { bank: "SBI Home Loans", rate: "6.80%", emi: "10,000", amount: "34,524", ltv: "90%", initials: "/assets/logo/4.png", accent: "bg-cyan-100 text-cyan-700" },
  { bank: "ICICI Bank", rate: "6.80%", emi: "7,500", amount: "34,524", ltv: "90%", initials: "/assets/logo/6.png", accent: "bg-rose-100 text-rose-700" },
  { bank: "PNB Housing Finance", rate: "9.25%", emi: "10,000", amount: "38,409", ltv: "90%", initials: "/assets/logo/5.png", accent: "bg-orange-100 text-orange-700" },
];

function Metric({ label, value }) {
  return (
    <div className="text-left min-w-[78px]">
      <p className="text-[13px] leading-tight font-bold text-slate-700">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function EmiCalculatorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-100 text-slate-900 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {offers.map((offer) => (
             <div
                key={offer.bank}
                className="grid grid-cols-1 md:grid-cols-[1.55fr_1.2fr_280px] items-center gap-4 px-4 sm:px-6 py-5 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bord flex items-center justify-center shrink-0 overflow-hidden">
                    <div className={`relative h-full w-full rounded-full flex items-center justify-center ${offer.accent}`}>
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

                <div className="flex items-center justify-start md:justify-end gap-3">
                  <button className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 transition-colors">
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

          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Home Loan EMI Calculator</h1>
            <p className="text-slate-600 mt-3 max-w-5xl">
              Home Loan EMI Calculator provides an instant estimate of your EMI by requiring the loan amount,
              interest rate, and loan tenure. This ensures manageable debt repayment and aids in budget planning.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-5">Home Loans</h2>

                <label className="block text-sm text-slate-600 mb-2">Loan Amount</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 mb-4"
                  placeholder="₹ Enter loan amount"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Loan Tenure</label>
                    <select className="w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-700">
                      <option>Select Tenure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Interest Rate % (p.a.)</label>
                    <input className="w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-700" defaultValue="7.4" />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-2">Have you finalized your property?</p>
                  <div className="flex items-center gap-6 text-sm text-slate-700">
                    <label className="inline-flex items-center gap-2"><input type="radio" name="finalized" /> Yes</label>
                    <label className="inline-flex items-center gap-2"><input type="radio" name="finalized" /> No</label>
                  </div>
                </div>

                <button className="mt-7 w-full rounded-full bg-[#24103f] hover:bg-[#321a52] text-white font-semibold py-3.5 transition-colors">
                  Recalculate Your EMI
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <h3 className="text-3xl font-bold text-center text-slate-800">You are Eligible for EMI Amount ₹0</h3>

                <div className="h-64 flex items-center justify-center">
                  <div className="relative h-40 w-40 rounded-full bg-[#24a48f]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm font-semibold">100%</span>
                    <span className="absolute right-2 top-1/2 h-[2px] w-16 bg-white/70 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="space-y-2 text-slate-700">
                    <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#24a48f] mr-2" />Principal Amount</p>
                    <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#e9b425] mr-2" />Interest Amount</p>
                  </div>
                  <div className="space-y-2 text-slate-800 font-semibold">
                    <p>₹0</p>
                    <p>₹0</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-2xl font-bold text-slate-800 mb-4">Top Banks home loan Offers</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold">B</div>
                        <div>
                          <p className="font-semibold text-slate-800">Bank of Baroda</p>
                          <p className="text-xs text-slate-500">Rate 8.4% | Max Term 30yrs</p>
                        </div>
                      </div>
                      <button className="text-indigo-500 text-sm font-medium">View</button>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center font-bold">SBI</div>
                        <div>
                          <p className="font-semibold text-slate-800">State Bank of India</p>
                          <p className="text-xs text-slate-500">Rate 8.5% | Max Term 30yrs</p>
                        </div>
                      </div>
                      <button className="text-indigo-500 text-sm font-medium">View</button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-yellow-300 bg-yellow-50 p-3">
                  <p className="text-yellow-800 text-sm font-semibold">Elite Club</p>
                  <p className="text-yellow-900 font-semibold mt-1">Assured Rewards Worth ₹90K</p>
                  <p className="text-yellow-700 text-sm mt-1">FREE B.B Prime + Movie Tickets + 2000- Gift Card + 1000- Gift Card + wall-Gift Card</p>
                </div>

                <button className="mt-5 w-full rounded-full bg-[#24103f] hover:bg-[#321a52] text-white font-semibold py-3.5 transition-colors">
                  Check Bank Offers
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default EmiCalculatorPage;
