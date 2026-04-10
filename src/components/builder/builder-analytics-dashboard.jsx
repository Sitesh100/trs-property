"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsapBanner from "@/components/home/whatsap-banner";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
    {
        id: "lead-3",
        date: "2026-04-06",
        customerName: "Kunal Mehta",
        customerNumber: "9034567812",
        propertyName: "Palm Meadows",
        notes: "Requested payment plan breakup",
        status: "New",
    },
    {
        id: "lead-4",
        date: "2026-04-07",
        customerName: "Sara Khan",
        customerNumber: "9981234567",
        propertyName: "Marina Heights",
        notes: "Follow-up post site visit",
        status: "Followup",
    },
    {
        id: "lead-5",
        date: "2026-04-08",
        customerName: "Aakash Jain",
        customerNumber: "9872301456",
        propertyName: "Skyline One",
        notes: "Booked site visit for family",
        status: "Site Visit",
    },
    {
        id: "lead-6",
        date: "2026-04-09",
        customerName: "Ritika Das",
        customerNumber: "9812345087",
        propertyName: "Palm Meadows",
        notes: "Commercial unit shortlisted",
        status: "Closed",
    },
    {
        id: "lead-7",
        date: "2026-04-09",
        customerName: "Aman Verma",
        customerNumber: "9198123412",
        propertyName: "Skyline One",
        notes: "Loan declined by bank",
        status: "Cancelled",
    },
];

const BUILDER_PROJECTS = [
    {
        id: "project-1",
        name: "Skyline One",
        location: "Sector 102, Gurugram",
        image: "/assets/images/project/project1.webp",
        typology: "2 & 3 BHK",
        inventory: "186 Units",
        possession: "Dec 2026",
        avgTicket: "1.35 Cr",
        stage: "Ready to Move",
        totalViews: 4210,
        activeLeads: 9,
        upcomingVisits: [
            { id: "sky-up-1", visitDate: "2026-04-10", customerName: "Rohan Khanna", slot: "11:30 AM", source: "Website", visitedBy: "Rahul Mehta" },
            { id: "sky-up-2", visitDate: "2026-04-13", customerName: "Aakash Jain", slot: "05:00 PM", source: "Broker", visitedBy: "Nisha Arora" },
        ],
        completedVisits: [
            { id: "sky-done-1", visitDate: "2026-04-04", customerName: "Ananya Verma", outcome: "Followup", visitedBy: "Rahul Mehta" },
            { id: "sky-done-2", visitDate: "2026-04-08", customerName: "Ritika Das", outcome: "Closed", visitedBy: "Nisha Arora" },
        ],
    },
    {
        id: "project-2",
        name: "Marina Heights",
        location: "Noida Extension, Greater Noida",
        image: "/assets/images/project/project2.webp",
        typology: "3 & 4 BHK",
        inventory: "242 Units",
        possession: "Mar 2027",
        avgTicket: "1.9 Cr",
        stage: "Under Construction",
        totalViews: 3890,
        activeLeads: 7,
        upcomingVisits: [
            { id: "mar-up-1", visitDate: "2026-04-12", customerName: "Meera S", slot: "04:00 PM", source: "Campaign", visitedBy: "Aditya Singh" },
            { id: "mar-up-2", visitDate: "2026-04-15", customerName: "Dev Arora", slot: "02:15 PM", source: "Referral", visitedBy: "Priya Nair" },
        ],
        completedVisits: [
            { id: "mar-done-1", visitDate: "2026-04-06", customerName: "Kunal Mehta", outcome: "Negotiation", visitedBy: "Aditya Singh" },
            { id: "mar-done-2", visitDate: "2026-04-07", customerName: "Sara Khan", outcome: "Closed", visitedBy: "Priya Nair" },
        ],
    },
    {
        id: "project-3",
        name: "Green Crest",
        location: "Whitefield, Bengaluru",
        image: "/assets/images/project/project3.webp",
        typology: "2, 3 & 4 BHK",
        inventory: "320 Units",
        possession: "Sep 2027",
        avgTicket: "2.1 Cr",
        stage: "Pre Launch",
        totalViews: 3660,
        activeLeads: 5,
        upcomingVisits: [
            { id: "grn-up-1", visitDate: "2026-04-11", customerName: "Neha Sharma", slot: "01:00 PM", source: "Instagram", visitedBy: "Karan Dsouza" },
            { id: "grn-up-2", visitDate: "2026-04-17", customerName: "Tarun Iyer", slot: "03:45 PM", source: "Website", visitedBy: "Sneha Kulkarni" },
        ],
        completedVisits: [
            { id: "grn-done-1", visitDate: "2026-04-05", customerName: "Pooja Nair", outcome: "Followup", visitedBy: "Karan Dsouza" },
            { id: "grn-done-2", visitDate: "2026-04-09", customerName: "Ishaan Paul", outcome: "Negotiation", visitedBy: "Sneha Kulkarni" },
        ],
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

export default function BuilderAnalyticsDashboard() {
    const [selectedProject, setSelectedProject] = useState(null);
    const leads = INITIAL_LEADS;

    const maxViews = useMemo(() => Math.max(...MONTHLY_ANALYTICS.map((item) => item.views)), []);

    const statusCounts = useMemo(() => {
        return STATUS_OPTIONS.reduce((acc, status) => {
            acc[status] = leads.filter((lead) => lead.status === status).length;
            return acc;
        }, {});
    }, [leads]);

    const closedDeals = useMemo(() => {
        return BUILDER_PROJECTS.reduce((sum, project) => {
            return sum + project.completedVisits.filter((visit) => visit.outcome === "Closed").length;
        }, 0);
    }, []);

    const totalLeads = leads.length;
    const totalVisits = useMemo(() => BUILDER_PROJECTS.reduce((sum, project) => sum + project.totalViews, 0), []);

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

    useEffect(() => {
        const onEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedProject(null);
            }
        };

        if (selectedProject) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", onEscape);
        }

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onEscape);
        };
    }, [selectedProject]);

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
                            <p className="text-xs text-[#F5EFE7]">Portfolio profile views</p>
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

                    <section className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-xl font-semibold">Builder Project Portfolio</h2>
                            <span className="rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-3 py-1 text-xs text-[#C6A256]">
                                {BUILDER_PROJECTS.length} Active Projects
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {BUILDER_PROJECTS.map((project) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => setSelectedProject(project)}
                                    className="group overflow-hidden rounded-xl border border-[#F5EFE7]/10 bg-[#212121]/45 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A256]/50 hover:shadow-[0_16px_40px_-25px_rgba(198,162,86,0.7)]"
                                >
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={project.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#212121]/80 via-transparent to-transparent" />
                                        <span className="absolute left-3 top-3 rounded-full border border-[#F5EFE7]/25 bg-[#212121]/70 px-2 py-1 text-xs">
                                            {project.stage}
                                        </span>
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#F5EFE7]">{project.name}</h3>
                                            <p className="text-sm text-[#F5EFE7]/80">{project.location}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-[#F5EFE7]/85">
                                            <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-2 py-2">
                                                <p className="text-[#F5EFE7]/65">Typology</p>
                                                <p className="font-medium">{project.typology}</p>
                                            </div>
                                            <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-2 py-2">
                                                <p className="text-[#F5EFE7]/65">Inventory</p>
                                                <p className="font-medium">{project.inventory}</p>
                                            </div>
                                            <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-2 py-2">
                                                <p className="text-[#F5EFE7]/65">Possession</p>
                                                <p className="font-medium">{project.possession}</p>
                                            </div>
                                            <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 px-2 py-2">
                                                <p className="text-[#F5EFE7]/65">Avg Ticket</p>
                                                <p className="font-medium">{project.avgTicket}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-[#F5EFE7]/10 pt-3 text-sm text-[#C6A256]">
                                            <span>{project.activeLeads} active leads</span>
                                            <span className="font-medium">View details</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

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

                {selectedProject && (
                    <div className="fixed inset-0 z-50">
                        <button
                            type="button"
                            className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm"
                            onClick={() => setSelectedProject(null)}
                            aria-label="Close project details"
                        />

                        <aside className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-[#F5EFE7]/10 bg-[#1D1D1D] p-4 text-[#F5EFE7] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">{selectedProject.name}</h3>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProject(null)}
                                    className="rounded-lg border border-[#F5EFE7]/20 px-3 py-2 text-sm hover:bg-[#F5EFE7]/10"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl border border-[#F5EFE7]/10">
                                <Image
                                    src={selectedProject.image}
                                    alt={selectedProject.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 960px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#212121]/75 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 rounded-full border border-[#C6A256]/40 bg-[#212121]/70 px-3 py-1 text-xs text-[#C6A256]">
                                    {selectedProject.stage}
                                </div>
                            </div>

                            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                                    <p className="text-xs text-[#F5EFE7]/70">Location</p>
                                    <p className="text-sm font-medium">{selectedProject.location}</p>
                                </div>
                                <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                                    <p className="text-xs text-[#F5EFE7]/70">Typology</p>
                                    <p className="text-sm font-medium">{selectedProject.typology}</p>
                                </div>
                                <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                                    <p className="text-xs text-[#F5EFE7]/70">Possession</p>
                                    <p className="text-sm font-medium">{selectedProject.possession}</p>
                                </div>
                                <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                                    <p className="text-xs text-[#F5EFE7]/70">Avg Ticket</p>
                                    <p className="text-sm font-medium">{selectedProject.avgTicket}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-base font-semibold">Upcoming Visits</h4>
                                        <span className="text-xs text-[#F5EFE7]/75">{selectedProject.upcomingVisits.length} scheduled</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]/80">
                                                    <th className="pb-2 pr-2">Date</th>
                                                    <th className="pb-2 pr-2">Customer</th>
                                                    <th className="pb-2 pr-2">Slot</th>
                                                    <th className="pb-2 pr-2">Source</th>
                                                    <th className="pb-2 pr-2">Visited By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProject.upcomingVisits.map((visit) => (
                                                    <tr key={visit.id} className="border-b border-[#F5EFE7]/5">
                                                        <td className="py-2 pr-2">{visit.visitDate}</td>
                                                        <td className="py-2 pr-2">{visit.customerName}</td>
                                                        <td className="py-2 pr-2">{visit.slot}</td>
                                                        <td className="py-2 pr-2">{visit.source}</td>
                                                        <td className="py-2 pr-2">{visit.visitedBy}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-base font-semibold">Completed Visits</h4>
                                        <span className="text-xs text-[#F5EFE7]/75">{selectedProject.completedVisits.length} outcomes</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-[#F5EFE7]/10 text-[#F5EFE7]/80">
                                                    <th className="pb-2 pr-2">Date</th>
                                                    <th className="pb-2 pr-2">Customer</th>
                                                    <th className="pb-2 pr-2">Visited By</th>
                                                    <th className="pb-2 pr-2">Outcome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProject.completedVisits.map((visit) => (
                                                    <tr key={visit.id} className="border-b border-[#F5EFE7]/5">
                                                        <td className="py-2 pr-2">{visit.visitDate}</td>
                                                        <td className="py-2 pr-2">{visit.customerName}</td>
                                                        <td className="py-2 pr-2">{visit.visitedBy}</td>
                                                        <td className="py-2 pr-2">
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
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
