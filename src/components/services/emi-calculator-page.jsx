"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import LoanDealFormPopup from "@/components/services/loan-deal-form-popup";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const offers = [
  { bank: "Kotak Mahindra Bank", rate: "7.40%", emi: "10,000", amount: "35,689", ltv: "90%", initials: "/assets/logo/1.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "HDFC Bank", rate: "7.15%", emi: "13,000", amount: "37,195", ltv: "90%", initials: "/assets/logo/2.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "LIC Housing Finance Ltd", rate: "7.40%", emi: "5,000", amount: "34,678", ltv: "90%", initials: "/assets/logo/3.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "SBI Home Loans", rate: "7.10%", emi: "10,000", amount: "34,524", ltv: "90%", initials: "/assets/logo/4.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "Axis Bank", rate: "7.25%", emi: "10,000", amount: "34,678", ltv: "90%", initials: "/assets/logo/5.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "ICICI Bank", rate: "7.20%", emi: "7,500", amount: "34,524", ltv: "90%", initials: "/assets/logo/6.png", accent: "bg-[#212121] text-[#C6A256]" },
  { bank: "PNB Housing Finance", rate: "7.90%", emi: "10,000", amount: "38,409", ltv: "90%", initials: "/assets/logo/7.png", accent: "bg-[#212121] text-[#C6A256]" },
];

function Metric({ label, value }) {
  return (
    <div className="text-left min-w-[78px]">
      <p className="text-[13px] leading-tight font-bold text-[#212121]">{value}</p>
      <p className="text-[11px] text-[#212121]">{label}</p>
    </div>
  );
}

const tenureOptions = [
  { label: "5 Years", value: 5 },
  { label: "10 Years", value: 10 },
  { label: "15 Years", value: 15 },
  { label: "20 Years", value: 20 },
  { label: "25 Years", value: 25 },
  { label: "30 Years", value: 30 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const parseNumericInput = (value) => {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateEMI = (principal, annualRate, tenureYears) => {
  const totalMonths = Math.round(tenureYears * 12);

  if (!principal || !totalMonths) {
    return {
      emi: 0,
      principalAmount: principal || 0,
      interestAmount: 0,
      totalAmount: principal || 0,
      totalMonths,
    };
  }

  if (annualRate <= 0) {
    const emi = principal / totalMonths;
    return {
      emi: Number.isFinite(emi) ? emi : 0,
      principalAmount: principal,
      interestAmount: 0,
      totalAmount: principal,
      totalMonths,
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const growthFactor = (1 + monthlyRate) ** totalMonths;
  const emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1);
  const totalAmount = emi * totalMonths;
  const interestAmount = totalAmount - principal;

  return {
    emi: Number.isFinite(emi) ? emi : 0,
    principalAmount: principal,
    interestAmount: Number.isFinite(interestAmount) ? interestAmount : 0,
    totalAmount: Number.isFinite(totalAmount) ? totalAmount : principal,
    totalMonths,
  };
};

function EmiCalculatorPage() {
  const [isDealPopupOpen, setIsDealPopupOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [loanAmountInput, setLoanAmountInput] = useState("");
  const [tenureYears, setTenureYears] = useState(0);
  const [interestRateInput, setInterestRateInput] = useState("7.4");
  const [hasFinalizedProperty, setHasFinalizedProperty] = useState("");
  const [result, setResult] = useState({
    emi: 0,
    principalAmount: 0,
    interestAmount: 0,
    totalAmount: 0,
    totalMonths: 0,
  });

  const principal = parseNumericInput(loanAmountInput);
  const annualRate = parseNumericInput(interestRateInput);

  const pieData = useMemo(
    () => [
      { name: "Principal Amount", value: Math.max(result.principalAmount, 0), color: "#C6A256" },
      { name: "Interest Amount", value: Math.max(result.interestAmount, 0), color: "#C6A256" },
    ],
    [result.interestAmount, result.principalAmount]
  );

  const handleRecalculate = () => {
    const emiBreakup = calculateEMI(principal, annualRate, tenureYears);
    setResult(emiBreakup);
  };

  const openDealPopup = (bankName) => {
    setSelectedBank(bankName);
    setIsDealPopupOpen(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#212121] text-[#F5EFE7] pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
          <div className="rounded-2xl bg-[#F5EFE7] border border-[#D8CEC0] shadow-sm overflow-hidden">
            {offers.map((offer) => (
             <div
                key={offer.bank}
                className="grid grid-cols-1 md:grid-cols-[1.55fr_1.2fr_280px] items-center gap-4 px-4 sm:px-6 py-5 border-b border-[#D8CEC0] last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border border-[#D8CEC0] flex items-center justify-center shrink-0 overflow-hidden">
                    <div className={`relative h-full w-full rounded-full flex items-center justify-center ${offer.accent}`}>
                      <Image
                        src={offer.initials}
                        alt={`${offer.bank} logo`}
                        fill
                        className="object-contain "
                      />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#212121]">{offer.bank}</h3>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  <div className="min-w-[70px]">
                    <p className="text-lg font-bold text-[#C6A256] leading-tight">{offer.rate}</p>
                  </div>
                  <Metric label="EMI" value={`₹${offer.emi}`} />
                  <Metric label="Loan Amount" value={`₹${offer.amount}`} />
                  <Metric label="Loan to value ratio" value={offer.ltv} />
                </div>

                <div className="flex items-center justify-start md:justify-end gap-3">
                  <button className="hidden sm:flex items-center gap-1 text-[11px] text-[#212121] hover:text-[#212121] transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    Email me this deal
                  </button>
                  <button
                    onClick={() => openDealPopup(offer.bank)}
                    className="rounded-xl bg-[#212121] hover:bg-[#212121] text-[#F5EFE7] text-sm font-semibold px-5 py-2.5 transition-colors"
                  >
                    Get me this deal
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#F5EFE7]">Home Loan EMI Calculator</h1>
            <p className="text-[#F5EFE7] mt-3 max-w-5xl">
              Home Loan EMI Calculator provides an instant estimate of your EMI by requiring the loan amount,
              interest rate, and loan tenure. This ensures manageable debt repayment and aids in budget planning.
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#F5EFE7] border border-[#D8CEC0] shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h2 className="text-3xl font-bold text-[#212121] mb-5">Home Loans</h2>

                <label className="block text-sm text-[#212121] mb-2">Loan Amount</label>
                <input
                  className="w-full rounded-xl border border-[#D8CEC0] px-4 py-3 text-[#212121] bg-[#F5EFE7] mb-4"
                  placeholder="₹ Enter loan amount"
                  value={loanAmountInput}
                  onChange={(e) => setLoanAmountInput(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[#212121] mb-2">Loan Tenure</label>
                    <select
                      className="w-full rounded-xl border border-[#D8CEC0] px-3 py-3 text-[#212121] bg-[#F5EFE7]"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                    >
                      <option value={0}>Select Tenure</option>
                      {tenureOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#212121] mb-2">Interest Rate % (p.a.)</label>
                    <input
                      className="w-full rounded-xl border border-[#D8CEC0] px-3 py-3 text-[#212121] bg-[#F5EFE7]"
                      value={interestRateInput}
                      onChange={(e) => setInterestRateInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-[#212121] mb-2">Have you finalized your property?</p>
                  <div className="flex items-center gap-6 text-sm text-[#212121]">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="finalized"
                        checked={hasFinalizedProperty === "yes"}
                        onChange={() => setHasFinalizedProperty("yes")}
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="finalized"
                        checked={hasFinalizedProperty === "no"}
                        onChange={() => setHasFinalizedProperty("no")}
                      />
                      No
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleRecalculate}
                  className="mt-7 w-full rounded-full bg-[#212121] hover:bg-[#212121] text-[#F5EFE7] font-semibold py-3.5 transition-colors"
                >
                  Recalculate Your EMI
                </button>
              </div>

              <div className="rounded-xl border border-[#D8CEC0] p-4 sm:p-5">
                <h3 className="text-3xl font-bold text-center text-[#212121]">
                  You are Eligible for EMI Amount {formatCurrency(result.emi)}
                </h3>

                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        isAnimationActive
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{ borderRadius: 12, border: "1px solid #F5EFE7" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="space-y-2 text-[#212121]">
                    <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C6A256] mr-2" />Principal Amount</p>
                    <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C6A256] mr-2" />Interest Amount</p>
                  </div>
                  <div className="space-y-2 text-[#212121] font-semibold">
                    <p>{formatCurrency(result.principalAmount)}</p>
                    <p>{formatCurrency(result.interestAmount)}</p>
                  </div>
                </div>

                <p className="text-sm text-[#212121] mt-4">
                  Total repayment over {result.totalMonths || 0} months: <span className="font-semibold text-[#212121]">{formatCurrency(result.totalAmount)}</span>
                </p>

                <button className="mt-5 w-full rounded-full bg-[#212121] hover:bg-[#212121] text-[#F5EFE7] font-semibold py-3.5 transition-colors">
                  Check Bank Offers
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LoanDealFormPopup
        isOpen={isDealPopupOpen}
        bankName={selectedBank}
        onClose={() => setIsDealPopupOpen(false)}
      />
      <Footer />
    </>
  );
}

export default EmiCalculatorPage;
