"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "agent-mini-crm-leads";
const STATUS_OPTIONS = ["Followup", "Postponed", "Closed", "Cancelled"];

const initialForm = {
    date: "",
    customerName: "",
    customerNumber: "",
    propertyName: "",
    notes: "",
    status: "Followup",
};

export default function AgentLeadsPage() {
    const [form, setForm] = useState(initialForm);
    const [leads, setLeads] = useState([]);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

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
                <section className="mx-auto max-w-6xl">
                    <div className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Mini CRM - Leads</h1>
                                <p className="mt-2 text-sm text-[#F5EFE7]">
                                    Add leads, track status, and keep property interest notes in one place.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddLeadModalOpen(true)}
                                className="rounded-md cursor-pointer bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] px-5 py-2 font-semibold text-[#212121]"
                            >
                                Add Lead
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {STATUS_OPTIONS.map((status) => (
                            <div key={status} className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-4 py-3">
                                <p className="text-sm text-[#F5EFE7]">{status}</p>
                                <p className="text-xl font-bold">{statusCounts[status] || 0}</p>
                            </div>
                        ))}
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                        <table className="w-full min-w-190 text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]">
                                    <th className="pb-3 pr-3">Date</th>
                                    <th className="pb-3 pr-3">Lead Name</th>
                                    <th className="pb-3 pr-3">Customer Number</th>
                                    <th className="pb-3 pr-3">Property Name</th>
                                    <th className="pb-3 pr-3">Notes</th>
                                    <th className="pb-3 pr-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-[#F5EFE7]" colSpan={6}>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#212121]/75 px-4 py-6">
                        <div className="w-full max-w-4xl rounded-xl border border-[#F5EFE7]/10 bg-[#21212133] p-5 shadow-2xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Add New Lead</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsAddLeadModalOpen(false)}
                                    className="rounded-md border border-[#F5EFE7]/20 px-3 py-1 text-sm text-[#F5EFE7]/80 cursor-pointer"
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
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
                                    />
                                </label>

                                <label className="text-sm">
                                    Customer Name *
                                    <input
                                        type="text"
                                        value={form.customerName}
                                        onChange={(e) => onChange("customerName", e.target.value)}
                                        placeholder="Enter customer name"
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
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
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
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
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
                                        required
                                    />
                                </label>

                                <label className="text-sm">
                                    Status
                                    <select
                                        value={form.status}
                                        onChange={(e) => onChange("status", e.target.value)}
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
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
                                        className="mt-1 w-full rounded-md border border-[#F5EFE7]/20 bg-[#212121]/30 px-3 py-2 text-[#F5EFE7] outline-none"
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
                                        className="rounded-md border border-[#F5EFE7]/25 px-5 py-2 font-semibold text-[#F5EFE7] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
