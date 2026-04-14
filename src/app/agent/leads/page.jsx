"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

const STORAGE_KEY = "agent-mini-crm-leads";
const STATUS_OPTIONS = ["Followup", "Postponed", "Closed", "Cancelled"];

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const initialForm = {
  date: getTodayDate(),
  customerName: "",
  customerEmail: "",
  customerNumber: "",
  notes: "",
  status: "Followup",
};

const fieldBaseClass =
  "mt-2 w-full rounded-2xl border border-[#F5EFE7]/12 bg-[#0F172A]/55 px-4 py-3 text-sm text-[#F5EFE7] placeholder:text-[#F5EFE7]/35 outline-none transition-all duration-200 focus:border-[#C6A256]/55 focus:bg-[#0F172A]/80";

const getStatusTone = (status) => {
  if (status === "Closed") return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (status === "Cancelled") return "border-rose-400/25 bg-rose-400/10 text-rose-200";
  if (status === "Postponed") return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  return "border-sky-400/25 bg-sky-400/10 text-sky-200";
};

export default function AgentLeadsPage() {
  const [form, setForm] = useState(initialForm);
  const [leads, setLeads] = useState([]);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const agentProfile = {
    companyName: "TRS Property Advisor",
    name: "Rohit Malhotra",
    email: "rohit.malhotra@trspropertymall.com",
    description:
      "Track followups, sync new inquiries to Sell.Do, and manage every customer conversation from one clean workspace.",
    image: "/assets/images/agent1.png",
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLeads(parsed);
      }
    } catch (error) {
      console.error("Unable to read saved leads", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = leads.filter((lead) => lead.status === status).length;
      return acc;
    }, {});
  }, [leads]);

  const totalLeads = leads.length;
  const activeLeads = useMemo(() => {
    return (statusCounts.Followup || 0) + (statusCounts.Postponed || 0);
  }, [statusCounts]);
  const closedDeals = statusCounts.Closed || 0;

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeModal = () => {
    setIsAddLeadModalOpen(false);
    setForm(initialForm);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.customerName.trim() ||
      !form.customerEmail.trim() ||
      !form.customerNumber.trim()
    ) {
      toast.error("Please fill all required lead details.");
      return;
    }

    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/sell-do/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to create lead.");
      }

      const sellDoData = payload?.sellDo || {};

      setLeads((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...form,
          syncState: "Synced",
          externalLeadId: sellDoData.sell_do_lead_id || null,
          externalStage:
            sellDoData.stage_data?.value ||
            sellDoData.stage ||
            form.status,
          createdAt:
            sellDoData.sell_do_lead_details?.lead_created_at ||
            new Date().toISOString(),
        },
        ...prev,
      ]);

      toast.success(payload?.message || "Lead added successfully.");
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add lead.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const updateLeadStatus = (id, nextStatus) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-linear-to-b from-[#212121] via-[#212121] to-[#212121] px-4 py-8 text-[#F5EFE7] md:px-8">
        <section className="mx-auto max-w-7xl">
          <section className="mb-6 rounded-[28px] border border-[#F5EFE7]/10 bg-[linear-gradient(135deg,rgba(245,239,231,0.07),rgba(15,23,42,0.45))] p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
              <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border border-[#C6A256]/35 bg-[#212121]/70 md:h-44 md:w-44">
                <Image
                  src={agentProfile.image}
                  alt={agentProfile.companyName || agentProfile.name}
                  fill
                  sizes="(max-width: 768px) 160px, 208px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#F5EFE7]/65">Agent Profile</p>
                  <h1 className="mt-2 text-2xl font-bold leading-tight text-[#F5EFE7] md:text-3xl">
                    {agentProfile.companyName || agentProfile.name}
                  </h1>
                  <p className="mt-1 text-sm text-[#F5EFE7]/80">{agentProfile.name}</p>
                  <p className="text-sm text-[#F5EFE7]/80">{agentProfile.email}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#F5EFE7]/74">
                    {agentProfile.description}
                  </p>
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                  <Link
                    href="/agent/profile"
                    className="inline-flex items-center justify-center rounded-xl border border-[#F5EFE7]/18 bg-[#F5EFE7]/7 px-4 py-2.5 text-sm font-medium text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/13"
                  >
                    Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsAddLeadModalOpen(true)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C6A256]/35 bg-[#C6A256]/18 px-4 py-2.5 text-sm font-medium text-[#E7CB87] transition-colors hover:bg-[#C6A256]/26"
                  >
                    <Plus className="h-4 w-4" />
                    Add Lead
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-[24px] border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#F5EFE7]/65">Total Leads</p>
                <p className="mt-3 text-3xl font-bold">{totalLeads}</p>
              </article>
              <article className="rounded-2xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#F5EFE7]/65">Active Leads</p>
                <p className="mt-3 text-3xl font-bold">{activeLeads}</p>
                <p className="text-xs text-[#F5EFE7]/60">Followup and postponed leads</p>
              </article>
              <article className="rounded-2xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#F5EFE7]/65">Closed Deals</p>
                <p className="mt-3 text-3xl font-bold">{closedDeals}</p>
                <p className="text-xs text-[#F5EFE7]/60">Successful conversions</p>
              </article>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STATUS_OPTIONS.map((status) => (
                <div key={status} className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-4 py-3">
                  <p className="text-xs text-[#F5EFE7]/65">{status}</p>
                  <p className="text-xl font-bold">{statusCounts[status] || 0}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="overflow-x-auto rounded-[24px] border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Lead Pipeline</h2>
                <p className="text-sm text-[#F5EFE7]/60">Track local pipeline status while syncing fresh leads to Sell.Do.</p>
              </div>
              <span className="rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-3 py-1 text-xs text-[#C6A256]">
                {totalLeads} Total Leads
              </span>
            </div>

            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]/70">
                  <th className="pb-3 pr-3">Date</th>
                  <th className="pb-3 pr-3">Lead</th>
                  <th className="pb-3 pr-3">Contact</th>
                  <th className="pb-3 pr-3">Notes</th>
                  <th className="pb-3 pr-3">Sync</th>
                  <th className="pb-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td className="py-5 text-[#F5EFE7]/65" colSpan={6}>
                      No leads added yet.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#F5EFE7]/5 align-top">
                    <td className="py-4 pr-3">{lead.date || "-"}</td>
                    <td className="py-4 pr-3">
                      <p className="font-medium text-[#F5EFE7]">{lead.customerName}</p>
                      <p className="text-xs text-[#F5EFE7]/55">{lead.source || "Agent Panel"}</p>
                    </td>
                    <td className="py-4 pr-3">
                      <p>{lead.customerNumber}</p>
                      <p className="text-xs text-[#F5EFE7]/55">{lead.customerEmail || "-"}</p>
                    </td>
                    <td className="py-4 pr-3">
                      <p className="text-[#F5EFE7]/75 line-clamp-2">{lead.notes || "-"}</p>
                    </td>
                    <td className="py-4 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${getStatusTone(
                          lead.syncState || "Followup"
                        )}`}
                      >
                        {lead.syncState || "Local"}
                      </span>
                      {lead.externalLeadId && (
                        <p className="mt-2 text-xs text-[#F5EFE7]/55">Sell.Do ID: {lead.externalLeadId}</p>
                      )}
                    </td>
                    <td className="py-4 pr-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="rounded-xl border border-[#F5EFE7]/20 bg-[#212121]/45 px-3 py-2 text-[#F5EFE7] outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {isAddLeadModalOpen && (
          <div className="fixed inset-0 z-70">
            <div
              className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-md"
              onClick={closeModal}
            />

            <div className="relative flex min-h-full items-center justify-center px-4 py-6">
              <div className="w-full max-w-2xl rounded-[28px] border border-[#F5EFE7]/14 bg-[linear-gradient(145deg,rgba(17,24,39,0.98),rgba(10,15,28,0.98))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] md:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#F5EFE7]">Add New Lead</h2>
                    <p className="mt-2 text-sm text-[#F5EFE7]/65">
                      Simple lead entry for your agent panel.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F5EFE7]/15 bg-[#F5EFE7]/5 text-[#F5EFE7]/80 transition-colors hover:bg-[#F5EFE7]/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-[#F5EFE7]/80">
                    Customer Name *
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => onChange("customerName", e.target.value)}
                      placeholder="Enter customer name"
                      className={fieldBaseClass}
                      required
                    />
                  </label>

                  <label className="text-sm text-[#F5EFE7]/80">
                    Customer Email *
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => onChange("customerEmail", e.target.value)}
                      placeholder="customer@example.com"
                      className={fieldBaseClass}
                      required
                    />
                  </label>

                  <label className="text-sm text-[#F5EFE7]/80">
                    Customer Number *
                    <input
                      type="tel"
                      value={form.customerNumber}
                      onChange={(e) => onChange("customerNumber", e.target.value)}
                      placeholder="Enter phone number"
                      className={fieldBaseClass}
                      required
                    />
                  </label>

                  <label className="text-sm text-[#F5EFE7]/80 md:col-span-2">
                    Content / Notes
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(e) => onChange("notes", e.target.value)}
                      placeholder="Add notes"
                      className={`${fieldBaseClass} resize-none`}
                    />
                  </label>

                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#C6A256] via-[#D6B76A] to-[#C6A256] px-5 py-3 font-semibold text-[#1C1C1C] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmittingLead ? "Adding..." : "Add Lead"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-2xl border border-[#F5EFE7]/18 px-5 py-3 font-semibold text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/8"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <WhatsapBanner />
      <Footer />
    </>
  );
}
