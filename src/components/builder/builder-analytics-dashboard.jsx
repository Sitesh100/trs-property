"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import { useMemo, useState } from "react";

const STATUS_OPTIONS = ["New", "Followup", "Site Visit", "Negotiation", "Closed", "Cancelled"];

const INITIAL_LEADS = [
    {
        id: "lead-1",
        date: "2026-04-03",
        customerName: "Rohan Khanna",
        customerNumber: "9876543210",
        propertyName: "Skyline One",
        notes: "Requested weekend site visit",
        status: "Followup",
    },
    {
        id: "lead-2",
        date: "2026-04-05",
        customerName: "Meera S",
        customerNumber: "9123456780",
        propertyName: "Marina Heights",
        notes: "Budget approval in progress",
        status: "Negotiation",
    },
];

const MONTHLY_ANALYTICS = [
    { month: "Jan", views: 1420, leads: 14, closed: 2 },
    { month: "Feb", views: 1680, leads: 18, closed: 3 },
    { month: "Mar", views: 1950, leads: 22, closed: 4 },
    { month: "Apr", views: 2210, leads: 26, closed: 5 },
    { month: "May", views: 2060, leads: 24, closed: 4 },
    { month: "Jun", views: 2440, leads: 29, closed: 6 },
];

const initialForm = {
    date: "",
    customerName: "",
    customerNumber: "",
    propertyName: "",
    notes: "",
    status: "New",
};

export default function BuilderAnalyticsDashboard() {
    const [form, setForm] = useState(initialForm);
    const [leads, setLeads] = useState(INITIAL_LEADS);

    const maxViews = useMemo(() => Math.max(...MONTHLY_ANALYTICS.map((item) => item.views)), []);

    const statusCounts = useMemo(() => {
        return STATUS_OPTIONS.reduce((acc, status) => {
            acc[status] = leads.filter((lead) => lead.status === status).length;
            return acc;
        }, {});
    }, [leads]);

    const closedDeals = statusCounts.Closed || 0;
    const totalLeads = leads.length;
    const totalVisits = MONTHLY_ANALYTICS.reduce((sum, item) => sum + item.views, 0);

    const graphPoints = useMemo(() => {
        const width = 680;
        const height = 220;
        const step = width / (MONTHLY_ANALYTICS.length - 1);

        return MONTHLY_ANALYTICS.map((item, index) => {
            const x = index * step;
            const y = height - (item.views / maxViews) * (height - 20) - 10;
            return { ...item, x, y };
        });
    }, [maxViews]);

    const linePath = useMemo(() => {
        if (graphPoints.length === 0) return "";
        return graphPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
    }, [graphPoints]);

    const areaPath = useMemo(() => {
        if (graphPoints.length === 0) return "";
        const width = 680;
        const height = 220;
        return `${linePath} L${width},${height} L0,${height} Z`;
    }, [linePath, graphPoints]);

    const onChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (!form.customerName.trim() || !form.customerNumber.trim() || !form.propertyName.trim()) return;

        setLeads((prev) => [
            {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                ...form,
            },
            ...prev,
        ]);

        setForm(initialForm);
    };

    const updateLead = (id, key, value) => {
        setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, [key]: value } : lead)));
    };

    const deleteLead = (id) => {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#101019] to-[#0b0b0f] px-4 py-8 text-white md:px-8">
                <section className="mx-auto max-w-7xl">
                    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5">
                        <h1 className="text-2xl font-bold">Builder Analytics Dashboard</h1>
                        <p className="mt-2 text-sm text-gray-300">
                            Personalised analytics for property views, lead tracking, and closed deals.
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-gray-400">Total Visits</p>
                            <p className="mt-2 text-3xl font-bold">{totalVisits}</p>
                            <p className="text-xs text-gray-400">Property profile views</p>
                        </article>
                        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-gray-400">Active Leads</p>
                            <p className="mt-2 text-3xl font-bold">{totalLeads}</p>
                            <p className="text-xs text-gray-400">All pipeline leads</p>
                        </article>
                        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-gray-400">Closed Deals</p>
                            <p className="mt-2 text-3xl font-bold">{closedDeals}</p>
                            <p className="text-xs text-gray-400">Successful conversions</p>
                        </article>
                    </div>

                    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Property Views Trend</h2>
                            <span className="text-xs text-gray-400">Demo data - Last 6 months</span>
                        </div>

                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            {MONTHLY_ANALYTICS.slice(-3).map((item) => (
                                <div key={`preview-${item.month}`} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                                    <p className="text-xs text-gray-400">{item.month}</p>
                                    <p className="text-sm font-semibold">{item.views} views</p>
                                    <p className="text-xs text-gray-400">{item.leads} leads, {item.closed} closed</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                            <svg viewBox="0 0 680 240" className="h-56 w-full">
                                <defs>
                                    <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f2d18b" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#f2d18b" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>

                                <g stroke="#2a2f3d" strokeWidth="1">
                                    <line x1="0" y1="220" x2="680" y2="220" />
                                    <line x1="0" y1="165" x2="680" y2="165" />
                                    <line x1="0" y1="110" x2="680" y2="110" />
                                    <line x1="0" y1="55" x2="680" y2="55" />
                                </g>

                                <path d={areaPath} fill="url(#viewsArea)" />
                                <path d={linePath} fill="none" stroke="#f2d18b" strokeWidth="3" strokeLinecap="round" />

                                {graphPoints.map((point) => (
                                    <g key={`point-${point.month}`}>
                                        <circle cx={point.x} cy={point.y} r="4" fill="#f2d18b" />
                                        <text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="10" fill="#d9dce3">
                                            {point.views}
                                        </text>
                                        <text x={point.x} y="236" textAnchor="middle" fontSize="10" fill="#9ca3af">
                                            {point.month}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {STATUS_OPTIONS.map((status) => (
                            <div key={status} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-gray-300">{status}</p>
                                <p className="text-xl font-bold">{statusCounts[status] || 0}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={onSubmit} className="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
                        <label className="text-sm">
                            Date
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => onChange("date", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                            />
                        </label>
                        <label className="text-sm">
                            Customer Name *
                            <input
                                type="text"
                                value={form.customerName}
                                onChange={(e) => onChange("customerName", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm">
                            Customer Number *
                            <input
                                type="tel"
                                value={form.customerNumber}
                                onChange={(e) => onChange("customerNumber", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm">
                            Property / Project Interested *
                            <input
                                type="text"
                                value={form.propertyName}
                                onChange={(e) => onChange("propertyName", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm">
                            Status
                            <select
                                value={form.status}
                                onChange={(e) => onChange("status", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm md:col-span-2">
                            Notes
                            <textarea
                                rows={3}
                                value={form.notes}
                                onChange={(e) => onChange("notes", e.target.value)}
                                className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-white outline-none"
                            />
                        </label>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="rounded-md bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 px-5 py-2 font-semibold text-black"
                            >
                                Add Lead
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4">
                        <table className="w-full min-w-200 text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-300">
                                    <th className="pb-3 pr-3">Date</th>
                                    <th className="pb-3 pr-3">Lead Name</th>
                                    <th className="pb-3 pr-3">Customer Number</th>
                                    <th className="pb-3 pr-3">Property</th>
                                    <th className="pb-3 pr-3">Notes</th>
                                    <th className="pb-3 pr-3">Status</th>
                                    <th className="pb-3 pr-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-gray-400" colSpan={7}>No leads added yet.</td>
                                    </tr>
                                )}
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-white/5">
                                        <td className="py-3 pr-3">{lead.date || "-"}</td>
                                        <td className="py-3 pr-3">{lead.customerName}</td>
                                        <td className="py-3 pr-3">{lead.customerNumber}</td>
                                        <td className="py-3 pr-3">{lead.propertyName}</td>
                                        <td className="py-3 pr-3">{lead.notes || "-"}</td>
                                        <td className="py-3 pr-3">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLead(lead.id, "status", e.target.value)}
                                                className="rounded-md border border-white/20 bg-black/30 px-2 py-1 text-white outline-none"
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => deleteLead(lead.id)}
                                                className="rounded-md border border-red-400/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
