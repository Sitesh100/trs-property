"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import { useMemo } from "react";

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

const UPCOMING_VISITS = [
    {
        id: "visit-up-1",
        visitDate: "2026-04-10",
        customerName: "Rohan Khanna",
        propertyName: "Skyline One",
        slot: "11:30 AM",
    },
    {
        id: "visit-up-2",
        visitDate: "2026-04-12",
        customerName: "Meera S",
        propertyName: "Marina Heights",
        slot: "04:00 PM",
    },
    {
        id: "visit-up-3",
        visitDate: "2026-04-15",
        customerName: "Dev Arora",
        propertyName: "Green Crest",
        slot: "02:15 PM",
    },
];

const COMPLETED_VISITS = [
    {
        id: "visit-done-1",
        visitDate: "2026-04-04",
        customerName: "Ananya Verma",
        propertyName: "Sunrise Elite",
        outcome: "Followup",
    },
    {
        id: "visit-done-2",
        visitDate: "2026-04-06",
        customerName: "Kunal Mehta",
        propertyName: "Palm Meadows",
        outcome: "Negotiation",
    },
    {
        id: "visit-done-3",
        visitDate: "2026-04-07",
        customerName: "Sara Khan",
        propertyName: "Marina Heights",
        outcome: "Closed",
    },
];

export default function BuilderAnalyticsDashboard() {
    const leads = INITIAL_LEADS;

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

    return (
        <>
            <Header />
            <main className="min-h-screen bg-linear-to-b from-[#212121] via-[#212121] to-[#212121] px-4 py-8 text-[#F5EFE7] md:px-8">
                <section className="mx-auto max-w-7xl">
                    <div className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <h1 className="text-2xl font-bold">Builder Analytics Dashboard</h1>
                        <p className="mt-2 text-sm text-[#F5EFE7]">
                            Personalised analytics for property views, lead tracking, and closed deals.
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Total Visits</p>
                            <p className="mt-2 text-3xl font-bold">{totalVisits}</p>
                            <p className="text-xs text-[#F5EFE7]">Property profile views</p>
                        </article>
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Active Leads</p>
                            <p className="mt-2 text-3xl font-bold">{totalLeads}</p>
                            <p className="text-xs text-[#F5EFE7]">All pipeline leads</p>
                        </article>
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]">Closed Deals</p>
                            <p className="mt-2 text-3xl font-bold">{closedDeals}</p>
                            <p className="text-xs text-[#F5EFE7]">Successful conversions</p>
                        </article>
                    </div>

                    

                    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {STATUS_OPTIONS.map((status) => (
                            <div key={status} className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-4 py-3">
                                <p className="text-xs text-[#F5EFE7]">{status}</p>
                                <p className="text-xl font-bold">{statusCounts[status] || 0}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Upcoming Visits</h3>
                                <span className="text-xs text-[#F5EFE7]">Next scheduled site visits</span>
                            </div>
                            <table className="w-full table-auto text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]">
                                        <th className="pb-3 pr-2">Visit Date</th>
                                        <th className="pb-3 pr-2">Customer</th>
                                        <th className="pb-3 pr-2">Property</th>
                                        <th className="pb-3 pr-2">Time Slot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {UPCOMING_VISITS.map((visit) => (
                                        <tr key={visit.id} className="border-b border-[#F5EFE7]/5">
                                            <td className="py-3 pr-2">{visit.visitDate}</td>
                                            <td className="py-3 pr-2">{visit.customerName}</td>
                                            <td className="py-3 pr-2">{visit.propertyName}</td>
                                            <td className="py-3 pr-2">{visit.slot}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Completed Visits</h3>
                                <span className="text-xs text-[#F5EFE7]">Latest visit outcomes</span>
                            </div>
                            <table className="w-full table-auto text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]">
                                        <th className="pb-3 pr-2">Visit Date</th>
                                        <th className="pb-3 pr-2">Customer</th>
                                        <th className="pb-3 pr-2">Property</th>
                                        <th className="pb-3 pr-2">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPLETED_VISITS.map((visit) => (
                                        <tr key={visit.id} className="border-b border-[#F5EFE7]/5">
                                            <td className="py-3 pr-2">{visit.visitDate}</td>
                                            <td className="py-3 pr-2">{visit.customerName}</td>
                                            <td className="py-3 pr-2">{visit.propertyName}</td>
                                            <td className="py-3 pr-2">
                                                <span className="rounded-full border border-[#C6A256]/30 bg-[#212121]/10 px-2 py-1 text-xs text-[#C6A256]">
                                                    {visit.outcome}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mb-6 mt-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Property Views Trend</h2>
                            <span className="text-xs text-[#F5EFE7]">Demo data - Last 6 months</span>
                        </div>

                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            {MONTHLY_ANALYTICS.slice(-3).map((item) => (
                                <div key={`preview-${item.month}`} className="rounded-lg border border-[#F5EFE7]/10 bg-[#212121]/30 px-3 py-2">
                                    <p className="text-xs text-[#F5EFE7]">{item.month}</p>
                                    <p className="text-sm font-semibold">{item.views} views</p>
                                    <p className="text-xs text-[#F5EFE7]">{item.leads} leads, {item.closed} closed</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#212121]/30 p-3">
                            <svg viewBox="0 0 680 240" className="h-56 w-full">
                                <defs>
                                    <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C6A256" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#C6A256" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>

                                <g stroke="#212121" strokeWidth="1">
                                    <line x1="0" y1="220" x2="680" y2="220" />
                                    <line x1="0" y1="165" x2="680" y2="165" />
                                    <line x1="0" y1="110" x2="680" y2="110" />
                                    <line x1="0" y1="55" x2="680" y2="55" />
                                </g>

                                <path d={areaPath} fill="url(#viewsArea)" />
                                <path d={linePath} fill="none" stroke="#C6A256" strokeWidth="3" strokeLinecap="round" />

                                {graphPoints.map((point) => (
                                    <g key={`point-${point.month}`}>
                                        <circle cx={point.x} cy={point.y} r="4" fill="#C6A256" />
                                        <text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="10" fill="#F5EFE7">
                                            {point.views}
                                        </text>
                                        <text x={point.x} y="236" textAnchor="middle" fontSize="10" fill="#F5EFE7">
                                            {point.month}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                </section>
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
