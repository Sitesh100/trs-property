"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import LoanDealFormPopup from "@/components/services/loan-deal-form-popup";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const loanOffers = [
  {
    bank: "Kotak Mahindra Bank",
    rate: "7.55%",
    emi: "10,000",
    amount: "35,689",
    ltv: "90%",
    initials: "/assets/logo/1.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
  {
    bank: "HDFC Bank",
    rate: "8.50%",
    emi: "13,000",
    amount: "37,195",
    ltv: "90%",
    initials: "/assets/logo/2.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
  {
    bank: "LIC Housing Finance Ltd",
    rate: "6.90%",
    emi: "5,000",
    amount: "34,678",
    ltv: "90%",
    initials: "/assets/logo/3.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
  {
    bank: "SBI Home Loans",
    rate: "6.80%",
    emi: "10,000",
    amount: "34,524",
    ltv: "90%",
    initials: "/assets/logo/4.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
  {
    bank: "Axis Bank",
    rate: "6.90%",
    emi: "10,000",
    amount: "34,678",
    ltv: "90%",
    initials: "/assets/logo/5.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
  {
    bank: "PNB Housing Finance",
    rate: "9.25%",
    emi: "10,000",
    amount: "38,409",
    ltv: "90%",
    initials: "/assets/logo/7.png",
    accent: "bg-[#212121] text-[#C6A256]",
  },
];

function Metric({ label, value }) {
  return (
    <div className="text-left min-w-[86px]">
      <p className="text-[13px] leading-tight font-bold text-[#212121]">{value}</p>
      <p className="text-[11px] text-[#212121]">{label}</p>
    </div>
  );
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const parseNumericInput = (value) => {
  if (!value) return 0;
  const normalized = String(value).replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const principalFromAffordableEMI = (monthlyEmi, annualRate, months) => {
  if (!monthlyEmi || !months) return 0;
  if (annualRate <= 0) return monthlyEmi * months;

  const monthlyRate = annualRate / 12 / 100;
  const growthFactor = (1 + monthlyRate) ** months;
  return (monthlyEmi * (growthFactor - 1)) / (monthlyRate * growthFactor);
};

const buildProjectionData = (principal, annualRate, months, monthlyEmi) => {
  if (!principal || !months || !monthlyEmi) {
    return [{ year: "Y0", balance: 0, cumulativeInterest: 0 }];
  }

  const monthlyRate = annualRate > 0 ? annualRate / 12 / 100 : 0;
  let outstanding = principal;
  let cumulativeInterest = 0;
  const data = [{ year: "Y0", balance: principal, cumulativeInterest: 0 }];

  for (let month = 1; month <= months; month += 1) {
    const interestComponent = monthlyRate > 0 ? outstanding * monthlyRate : 0;
    const principalComponent = monthlyEmi - interestComponent;
    outstanding = Math.max(0, outstanding - Math.max(0, principalComponent));
    cumulativeInterest += interestComponent;

    if (month % 12 === 0 || month === months) {
      data.push({
        year: `Y${Math.ceil(month / 12)}`,
        balance: outstanding,
        cumulativeInterest,
      });
    }
  }

  return data;
};

const calculateEligibility = ({ borrowers, age, occupation, netIncome, existingEmi, annualRate, tenureYears }) => {
  const borrowerCount = borrowers === "two" ? 2 : 1;
  const retirementAge = occupation === "self-employed" ? 65 : 60;
  const maxPossibleTenure = Math.max(1, retirementAge - age);
  const effectiveTenureYears = Math.max(1, Math.min(tenureYears, maxPossibleTenure));
  const months = effectiveTenureYears * 12;

  const foirBase = occupation === "self-employed" ? 0.55 : 0.5;
  const foirBoost = borrowerCount === 2 ? 0.1 : 0;
  const foir = Math.min(0.7, foirBase + foirBoost);

  const maxAffordableEmi = Math.max(0, netIncome * foir - existingEmi);
  const borrowUpto = principalFromAffordableEMI(maxAffordableEmi, annualRate, months);
  const payableAmount = maxAffordableEmi * months;
  const projectionData = buildProjectionData(borrowUpto, annualRate, months, maxAffordableEmi);

  return {
    borrowUpto,
    payableAmount,
    monthlyEmi: maxAffordableEmi,
    months,
    effectiveTenureYears,
    projectionData,
  };
};

function LoanOffersPage() {
  const [isDealPopupOpen, setIsDealPopupOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [borrowers, setBorrowers] = useState("one");
  const [ageInput, setAgeInput] = useState("35");
  const [occupation, setOccupation] = useState("salaried");
  const [netIncomeInput, setNetIncomeInput] = useState("200000");
  const [existingEmiInput, setExistingEmiInput] = useState("20000");
  const [interestRateInput, setInterestRateInput] = useState("8.9");
  const [tenureInput, setTenureInput] = useState("20");

  const [result, setResult] = useState(() =>
    calculateEligibility({
      borrowers: "one",
      age: 35,
      occupation: "salaried",
      netIncome: 200000,
      existingEmi: 20000,
      annualRate: 8.9,
      tenureYears: 20,
    })
  );

  const handleCalculate = () => {
    setResult(
      calculateEligibility({
        borrowers,
        age: parseNumericInput(ageInput),
        occupation,
        netIncome: parseNumericInput(netIncomeInput),
        existingEmi: parseNumericInput(existingEmiInput),
        annualRate: parseNumericInput(interestRateInput),
        tenureYears: parseNumericInput(tenureInput),
      })
    );
  };

  const chartData = useMemo(() => result.projectionData, [result.projectionData]);

  const openDealPopup = (bankName) => {
    setSelectedBank(bankName);
    setIsDealPopupOpen(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#212121] text-[#F5EFE7] pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12">
          <div className="rounded-2xl border border-[#F5EFE7] bg-[#F5EFE7] shadow-sm overflow-hidden">
            {loanOffers.map((offer) => (
              <div
                key={offer.bank}
                className="grid grid-cols-1 md:grid-cols-[1.55fr_1.2fr_280px] items-center gap-4 px-4 sm:px-6 py-5 border-b border-[#D8CEC0] last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full border border-[#F5EFE7] bg-[#212121] flex items-center justify-center shrink-0 overflow-hidden">
                    <div className={`relative w-full h-full rounded-full flex items-center justify-center ${offer.accent}`}>
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

                <div className="flex items-center justify-start md:justify-end gap-3 md:gap-4">
                  <button className="hidden sm:inline-flex items-center gap-1.5 text-xs leading-none whitespace-nowrap text-[#212121] hover:text-[#212121] transition-colors">
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

          <div className="mt-8 rounded-2xl border border-[#F5EFE7] bg-[#F5EFE7] shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#212121]">Calculate housing loan eligibility</h2>
            <p className="text-sm text-[#212121] mt-2 mb-6">
              Calculate your borrowing eligibility by submitting your details below
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <div className="rounded-xl border border-[#212121] bg-[#212121] p-1 mb-5 flex items-center justify-between">
                  <span className="text-sm text-[#F5EFE7] px-3">Number of Borrowers</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setBorrowers("one")}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        borrowers === "one" ? "bg-[#212121] text-[#F5EFE7]" : "text-[#F5EFE7]"
                      }`}
                    >
                      One
                    </button>
                    <button
                      onClick={() => setBorrowers("two")}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        borrowers === "two" ? "bg-[#212121] text-[#F5EFE7]" : "text-[#F5EFE7]"
                      }`}
                    >
                      Two
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Your Age</p>
                    <div className="flex items-center justify-between">
                      <input
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        className="font-semibold w-20 text-[#212121] bg-transparent focus:outline-none"
                      />
                      <span className="text-sm text-[#212121]">Years</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Occupation</p>
                    <div className="flex items-center justify-between">
                      <select
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="font-semibold w-full text-[#212121] bg-transparent focus:outline-none"
                      >
                        <option value="salaried">Salaried</option>
                        <option value="self-employed">Self-employed</option>
                      </select>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Net Income</p>
                    <div className="flex items-center justify-between">
                      <input
                        value={netIncomeInput}
                        onChange={(e) => setNetIncomeInput(e.target.value)}
                        className="font-semibold w-32 text-[#212121] bg-transparent focus:outline-none"
                      />
                      <span className="text-sm text-[#212121]">Monthly</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Existing Monthly EMI</p>
                    <div className="flex items-center justify-between">
                      <input
                        value={existingEmiInput}
                        onChange={(e) => setExistingEmiInput(e.target.value)}
                        className="font-semibold w-28 text-[#212121] bg-transparent focus:outline-none"
                      />
                      <span className="text-sm text-[#212121]">Monthly</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Rate of Interest</p>
                    <div className="flex items-center justify-between">
                      <input
                        value={interestRateInput}
                        onChange={(e) => setInterestRateInput(e.target.value)}
                        className="font-semibold w-20 text-[#212121] bg-transparent focus:outline-none"
                      />
                      <span className="text-sm text-[#212121]">%</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#D8CEC0] p-3">
                    <p className="text-xs text-[#212121] mb-2">Tenure</p>
                    <div className="flex items-center justify-between">
                      <input
                        value={tenureInput}
                        onChange={(e) => setTenureInput(e.target.value)}
                        className="font-semibold w-20 text-[#212121] bg-transparent focus:outline-none"
                      />
                      <span className="text-sm text-[#212121]">Years</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  className="mt-4 w-full rounded-xl bg-[#212121] hover:bg-[#212121] text-[#F5EFE7] font-semibold py-3 transition-colors"
                >
                  Calculate
                </button>
              </div>

              <div className="rounded-xl border border-[#D8CEC0] p-4 sm:p-5">
                <p className="text-sm text-[#212121] text-center mb-4">Your Estimated Results</p>
                <div className="h-52 rounded-lg bg-[#212121] border border-[#F5EFE7] relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="borrowCurve" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C6A256" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#C6A256" stopOpacity={0.06} />
                        </linearGradient>
                        <linearGradient id="interestCurve" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F5EFE7" stopOpacity={0.38} />
                          <stop offset="100%" stopColor="#F5EFE7" stopOpacity={0.06} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#F5EFE7" strokeDasharray="2 4" />
                      <XAxis dataKey="year" tick={{ fill: "#F5EFE7", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, "dataMax"]} />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{ borderRadius: 12, border: "1px solid #F5EFE7" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulativeInterest"
                        stroke="#F5EFE7"
                        strokeWidth={1.5}
                        fill="url(#interestCurve)"
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#C6A256"
                        strokeWidth={1.8}
                        fill="url(#borrowCurve)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5 text-center">
                  <div>
                    <p className="text-xs text-[#212121]">You could borrow upto</p>
                    <p className="text-xl font-bold text-[#212121]">{formatCurrency(result.borrowUpto)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#F5EFE7]">Payable Amount</p>
                    <p className="text-xl font-bold text-[#C6A256]">{formatCurrency(result.payableAmount)}</p>
                  </div>
                </div>
                <p className="text-sm text-[#212121] text-center mt-4">
                  Monthly EMI <span className="font-bold text-[#212121]">{formatCurrency(result.monthlyEmi)}</span>
                </p>
                <p className="text-xs text-[#212121] text-center mt-1">
                  Tenure considered: {result.effectiveTenureYears} years ({result.months} months)
                </p>
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

export default LoanOffersPage;
