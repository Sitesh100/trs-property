"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "agent-mini-crm-leads";
const STATUS_OPTIONS = ["Followup", "Postponed", "Closed", "Cancelled"];

const initialForm = {
    date: "",
    customerName: "",
    customerNumber: "",
    propertyName: "",
    builderTeam: "",
    notes: "",
    status: "Followup",
};

export default function AgentLeadsPage() {
    const [form, setForm] = useState(initialForm);
    const [leads, setLeads] = useState([]);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const agentProfile = {
        companyName: "TRS Property Advisor",
        name: "Rohit Malhotra",
        email: "rohit.malhotra@trspropertymall.com",
        description: "Track followups, close deals faster, and manage all customer conversations from one dashboard.",
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

    const onSubmit = (event) => {
        event.preventDefault();

        if (!form.customerName.trim() || !form.customerNumber.trim() || !form.propertyName.trim()) {
            return;
        }

        setLeads((prev) => [
            {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                ...form,
            },
            ...prev,
        ]);
        setForm(initialForm);
        setIsAddLeadModalOpen(false);
    };

    const updateLeadStatus = (id, nextStatus) => {
        setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)));
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-linear-to-b from-[#212121] via-[#212121] to-[#212121] px-4 py-8 text-[#F5EFE7] md:px-8">
                <section className="mx-auto max-w-7xl">
                    <section className="mb-6 rounded-2xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4 md:p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-[#C6A256]/40 bg-[#212121]/70 md:h-44 md:w-44">
                                <Image
                                    src={agentProfile.image}
                                    alt={agentProfile.companyName || agentProfile.name}
                                    fill
                                    sizes="(max-width: 768px) 160px, 208px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Agent Profile</p>
                                    <h1 className="mt-1 text-2xl font-bold leading-tight text-[#F5EFE7]">
                                        {agentProfile.companyName || agentProfile.name}
                                    </h1>
                                    <p className="text-sm text-[#F5EFE7]/85">{agentProfile.name}</p>
                                    <p className="mt-1 text-sm text-[#F5EFE7]/85">{agentProfile.email}</p>
                                    <p className="mt-2 max-w-2xl text-sm text-[#F5EFE7]/80">{agentProfile.description}</p>
                                </div>

                                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                                    <Link
                                        href="/agent/profile"
                                        className="inline-flex items-center justify-center rounded-lg border border-[#F5EFE7]/20 bg-[#F5EFE7]/8 px-4 py-2 text-sm font-medium text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/15"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddLeadModalOpen(true)}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#C6A256]/40 bg-[#C6A256]/15 px-4 py-2 text-sm font-medium text-[#E0C484] transition-colors hover:bg-[#C6A256]/25"
                                    >
                                        Add Lead
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4 sm:p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Total Leads</p>
                                <p className="mt-2 text-3xl font-bold">{totalLeads}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Active Leads</p>
                                <p className="mt-2 text-3xl font-bold">{activeLeads}</p>
                                <p className="text-xs text-[#F5EFE7]">Followup and postponed leads</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Closed Deals</p>
                                <p className="mt-2 text-3xl font-bold">{closedDeals}</p>
                                <p className="text-xs text-[#F5EFE7]">Successful conversions</p>
                            </article>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {STATUS_OPTIONS.map((status) => (
                                <div key={status} className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-4 py-3">
                                    <p className="text-xs text-[#F5EFE7]">{status}</p>
                                    <p className="text-xl font-bold">{statusCounts[status] || 0}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="overflow-x-auto rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold">Lead Pipeline</h2>
                            <span className="rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-3 py-1 text-xs text-[#C6A256]">
                                {totalLeads} Total Leads
                            </span>
                        </div>
                        <table className="w-full min-w-190 text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]">
                                    <th className="pb-3 pr-3">Date</th>
                                    <th className="pb-3 pr-3">Lead Name</th>
                                    <th className="pb-3 pr-3">Customer Number</th>
                                    <th className="pb-3 pr-3">Property Name</th>
                                    <th className="pb-3 pr-3">Builder Team</th>
                                    <th className="pb-3 pr-3">Notes</th>
                                    <th className="pb-3 pr-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-[#F5EFE7]" colSpan={7}>
                                            No leads added yet.
                                        </td>
                                    </tr>
                                )}
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-[#F5EFE7]/5">
                                        <td className="py-3 pr-3">{lead.date || "-"}</td>
                                        <td className="py-3 pr-3">{lead.customerName}</td>
                                        <td className="py-3 pr-3">{lead.customerNumber}</td>
                                        <td className="py-3 pr-3">{lead.propertyName}</td>
                                        <td className="py-3 pr-3">{lead.builderTeam || "-"}</td>
                                        <td className="py-3 pr-3 text-[#F5EFE7]">{lead.notes || "-"}</td>
                                        <td className="py-3 pr-3">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                className="rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-2 py-1 text-[#F5EFE7] outline-none"
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
                            className="absolute inset-0 bg-[#111827]/80 backdrop-blur-sm"
                            onClick={() => setIsAddLeadModalOpen(false)}
                        />
                        <div className="relative flex min-h-full items-center justify-center px-4 py-6">
                            <div className="w-full max-w-4xl rounded-2xl border border-[#F5EFE7]/20 bg-[#111827]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Add New Lead</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsAddLeadModalOpen(false)}
                                    className="rounded-md border border-[#F5EFE7]/25 px-3 py-1 text-sm text-[#F5EFE7]/90 hover:bg-[#F5EFE7]/10 cursor-pointer transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
                                <label className="text-sm">
                                    Date
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => onChange("date", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                    />
                                </label>

                                <label className="text-sm">
                                    Customer Name *
                                    <input
                                        type="text"
                                        value={form.customerName}
                                        onChange={(e) => onChange("customerName", e.target.value)}
                                        placeholder="Enter customer name"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                        required
                                    />
                                </label>

                                <label className="text-sm">
                                    Customer Number *
                                    <input
                                        type="tel"
                                        value={form.customerNumber}
                                        onChange={(e) => onChange("customerNumber", e.target.value)}
                                        placeholder="Enter phone number"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                        required
                                    />
                                </label>

                                <label className="text-sm">
                                    Project / Property Interested *
                                    <input
                                        type="text"
                                        value={form.propertyName}
                                        onChange={(e) => onChange("propertyName", e.target.value)}
                                        placeholder="Project or property name"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                        required
                                    />
                                </label>

                                <label className="text-sm">
                                    Builder Team
                                    <input
                                        type="text"
                                        value={form.builderTeam}
                                        onChange={(e) => onChange("builderTeam", e.target.value)}
                                        placeholder="Enter builder team"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                    />
                                </label>

                                <label className="text-sm">
                                    Status
                                    <select
                                        value={form.status}
                                        onChange={(e) => onChange("status", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] focus:border-[#C6A256] outline-none"
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="text-sm md:col-span-2">
                                    Notes
                                    <textarea
                                        rows={3}
                                        value={form.notes}
                                        onChange={(e) => onChange("notes", e.target.value)}
                                        placeholder="Notes"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/35 bg-[#0f172a]/75 px-3 py-2 text-[#F5EFE7] placeholder:text-[#F5EFE7]/55 focus:border-[#C6A256] outline-none"
                                    />
                                </label>

                                <div className="md:col-span-2 flex gap-3">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] px-5 py-2 font-semibold cursor-pointer text-[#212121]"
                                    >
                                        Add Lead
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddLeadModalOpen(false)}
                                        className="rounded-md border border-[#F5EFE7]/35 px-5 py-2 font-semibold text-[#F5EFE7] hover:bg-[#F5EFE7]/10 cursor-pointer transition-colors"
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
