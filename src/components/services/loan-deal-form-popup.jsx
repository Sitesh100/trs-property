"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useApplyHomeLoanMutation } from "@/service/homeLoanApi";

const initialFormState = {
  loanAmount: "",
  tenure: "20",
  age: "35",
  propertyIdentified: "",
  propertyCity: "",
  propertyCost: "",
  employment: "salaried",
  income: "",
  totalEmi: "",
  fullName: "",
  email: "",
  mobile: "",
  consent: false,
};

const cityOptions = ["Indore", "Bhopal", "Pune", "Mumbai", "Delhi"];

const parseNumber = (value) => Number(String(value || "").replace(/,/g, "").trim() || 0);

const validateForm = (form) => {
  const errors = {};

  if (parseNumber(form.loanAmount) <= 0) errors.loanAmount = "Enter a valid loan amount";
  if (parseNumber(form.tenure) < 1 || parseNumber(form.tenure) > 35) errors.tenure = "Tenure should be 1 to 35 years";
  if (parseNumber(form.age) < 18 || parseNumber(form.age) > 70) errors.age = "Age should be between 18 and 70";
  if (!form.employment) errors.employment = "Employment type is required";
  if (parseNumber(form.income) <= 0) errors.income = "Enter valid monthly income";
  if (parseNumber(form.totalEmi) < 0) errors.totalEmi = "EMI cannot be negative";
  if (!form.fullName.trim() || form.fullName.trim().length < 2) errors.fullName = "Enter full name";
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = "Enter valid email";
  if (!/^\d{10}$/.test(form.mobile.trim())) errors.mobile = "Enter valid 10 digit mobile number";
  if (!form.consent) errors.consent = "Please authorize to continue";

  return errors;
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

function LoanDealFormPopup({ isOpen, bankName, onClose, onSubmit }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [applyHomeLoan, { isLoading: isSubmitting }] = useApplyHomeLoanMutation();

  const title = useMemo(
    () => `We just need a few details to match you with the right home loan product${bankName ? ` for ${bankName}` : ""}`,
    [bankName]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const onEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (!bankName?.trim()) {
      toast.error("Please select a bank deal first.");
      return;
    }

    const payload = {
      bank_name: bankName,
      loan_amount: parseNumber(form.loanAmount),
      tenure_years: parseNumber(form.tenure),
      age: parseNumber(form.age),
      employment_type: form.employment === "self-employed" ? "Self-employed" : "Salaried",
      monthly_income: parseNumber(form.income),
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.mobile.trim(),
    };

    if (form.propertyIdentified) {
      payload.is_property_identified = form.propertyIdentified === "yes" ? "Yes" : "No";
    }
    if (form.propertyCity.trim()) {
      payload.property_city = form.propertyCity.trim();
    }
    if (form.propertyCost.trim()) {
      payload.property_cost = parseNumber(form.propertyCost);
    }
    if (form.totalEmi.trim()) {
      payload.current_emis = parseNumber(form.totalEmi);
    }

    try {
      const response = await applyHomeLoan(payload).unwrap();
      await Promise.resolve(onSubmit?.({ ...form, bankName, applicationId: response?.application_id }));
      toast.success(response?.message || "Your loan application has been received.");
      setForm(initialFormState);
      onClose();
    } catch (error) {
      toast.error(error?.data?.detail || error?.data?.message || "Failed to submit loan application. Please try again.");
    }
  };

  return (
    <div className="fixed top-40 inset-0 z-[120] backdrop-blur-[2px] px-3 py-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Close form"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Loan amount</label>
              <input
                value={form.loanAmount}
                onChange={(e) => updateField("loanAmount", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="6,00,000"
              />
              <FieldError message={errors.loanAmount} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Tenure</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <input
                  value={form.tenure}
                  onChange={(e) => updateField("tenure", e.target.value)}
                  className="w-full px-3 py-2.5"
                  placeholder="20"
                />
                <span className="px-3 py-2.5 text-slate-500 bg-slate-50 border-l border-slate-200">Years</span>
              </div>
              <FieldError message={errors.tenure} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Your Age</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <input
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full px-3 py-2.5"
                  placeholder="35"
                />
                <span className="px-3 py-2.5 text-slate-500 bg-slate-50 border-l border-slate-200">Years</span>
              </div>
              <FieldError message={errors.age} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Is your property identified?</label>
              <select
                value={form.propertyIdentified}
                onChange={(e) => updateField("propertyIdentified", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <FieldError message={errors.propertyIdentified} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Property city</label>
              <select
                value={form.propertyCity}
                onChange={(e) => updateField("propertyCity", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
              >
                <option value="">Select</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <FieldError message={errors.propertyCity} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Property Cost</label>
              <input
                value={form.propertyCost}
                onChange={(e) => updateField("propertyCost", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                placeholder="37,50,000"
              />
              <FieldError message={errors.propertyCost} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">How are you currently employed?</label>
              <select
                value={form.employment}
                onChange={(e) => updateField("employment", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-employed</option>
              </select>
              <FieldError message={errors.employment} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Your Income</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <input
                  value={form.income}
                  onChange={(e) => updateField("income", e.target.value)}
                  className="w-full px-3 py-2.5"
                  placeholder="1,00,000"
                />
                <span className="px-3 py-2.5 text-slate-500 bg-slate-50 border-l border-slate-200">Monthly</span>
              </div>
              <FieldError message={errors.income} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Current total EMIs</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <input
                  value={form.totalEmi}
                  onChange={(e) => updateField("totalEmi", e.target.value)}
                  className="w-full px-3 py-2.5"
                  placeholder="10,000"
                />
                <span className="px-3 py-2.5 text-slate-500 bg-slate-50 border-l border-slate-200">Monthly</span>
              </div>
              <FieldError message={errors.totalEmi} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Full name is mandatory</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <FieldError message={errors.fullName} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Email ID is mandatory</label>
              <input
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1">Mobile number is mandatory</label>
              <input
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                maxLength={10}
              />
              <FieldError message={errors.mobile} />
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2 text-sm text-slate-500">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
              />
              <span>
                I authorize Roome/relevant loan providers and their representatives to call, SMS or email me with
                reference to this application and accept <span className="text-blue-600">TRS Property Mall Terms & Conditions</span>.
              </span>
            </label>
            <FieldError message={errors.consent} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#24103f] hover:bg-[#321a52] text-white font-semibold py-3 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit Details"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Please note that our privacy policy does not govern the use of your data by financial institutions once it is
            shared.
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoanDealFormPopup;
