import Footer from "@/components/footer";
import Header from "@/components/header";
import WhatsapBanner from "@/components/home/whatsap-banner";
import Image from "next/image";
import Link from "next/link";

function ProjectViewsLineChart({ monthlyAnalytics }) {
    const width = 720;
    const height = 220;
    const maxViews = Math.max(...monthlyAnalytics.map((item) => item.views));
    const step = width / (monthlyAnalytics.length - 1);

    const points = monthlyAnalytics.map((item, index) => {
        const x = index * step;
        const y = height - (item.views / maxViews) * (height - 20) - 10;
        return { ...item, x, y };
    });

    const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return (
        <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#171717]/70 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Views Trend</h2>
                <span className="text-xs text-[#F5EFE7]/70">Last 6 months (dummy)</span>
            </div>
            <svg viewBox="0 0 720 240" className="h-56 w-full">
                <defs>
                    <linearGradient id="projectViewsArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6A256" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#C6A256" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                <g stroke="#2A2A2A" strokeWidth="1">
                    <line x1="0" y1="220" x2="720" y2="220" />
                    <line x1="0" y1="165" x2="720" y2="165" />
                    <line x1="0" y1="110" x2="720" y2="110" />
                    <line x1="0" y1="55" x2="720" y2="55" />
                </g>

                <path d={areaPath} fill="url(#projectViewsArea)" />
                <path d={linePath} fill="none" stroke="#C6A256" strokeWidth="3" strokeLinecap="round" />

                {points.map((point) => (
                    <g key={point.month}>
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
    );
}

function ProjectLeadBars({ monthlyAnalytics }) {
    const maxLeads = Math.max(...monthlyAnalytics.map((item) => item.leads));

    return (
        <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#171717]/70 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Lead and Closures</h2>
                <span className="text-xs text-[#F5EFE7]/70">Lead quality split</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {monthlyAnalytics.map((month) => {
                    const leadHeight = Math.max((month.leads / maxLeads) * 100, 12);
                    const closeHeight = Math.max((month.closed / maxLeads) * 100, 8);

                    return (
                        <div key={`bar-${month.month}`} className="rounded-lg border border-[#F5EFE7]/10 bg-[#111111]/50 p-3">
                            <p className="mb-2 text-xs text-[#F5EFE7]/75">{month.month}</p>
                            <div className="flex h-24 items-end gap-2">
                                <div className="w-6 rounded-md bg-[#C6A256]" style={{ height: `${leadHeight}%` }} />
                                <div className="w-6 rounded-md bg-[#56D3A7]" style={{ height: `${closeHeight}%` }} />
                            </div>
                            <div className="mt-2 text-xs text-[#F5EFE7]/85">
                                <p>{month.leads} leads</p>
                                <p>{month.closed} closed</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProjectAnalyticsPage({ project }) {
    const closedCount = project.completedVisits.filter((visit) => visit.outcome === "Closed").length;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#1A1A1A] px-4 py-8 text-[#F5EFE7] md:px-8">
                <section className="mx-auto max-w-7xl">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Project Analytics</p>
                            <h1 className="text-3xl font-bold">{project.name}</h1>
                        </div>
                        <Link
                            href="/builder/analytics"
                            className="rounded-lg border border-[#F5EFE7]/20 px-4 py-2 text-sm hover:bg-[#F5EFE7]/10"
                        >
                            Back to portfolio analytics
                        </Link>
                    </div>

                    <div className="mb-6 relative h-60 w-full overflow-hidden rounded-xl border border-[#F5EFE7]/10">
                        <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#111111]/80 via-[#111111]/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 rounded-full border border-[#C6A256]/40 bg-[#111111]/70 px-3 py-1 text-xs text-[#C6A256]">
                            {project.stage}
                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                            <p className="text-xs text-[#F5EFE7]/70">Location</p>
                            <p className="text-sm font-medium">{project.location}</p>
                        </div>
                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                            <p className="text-xs text-[#F5EFE7]/70">Typology</p>
                            <p className="text-sm font-medium">{project.typology}</p>
                        </div>
                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                            <p className="text-xs text-[#F5EFE7]/70">Possession</p>
                            <p className="text-sm font-medium">{project.possession}</p>
                        </div>
                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-3">
                            <p className="text-xs text-[#F5EFE7]/70">Avg Ticket</p>
                            <p className="text-sm font-medium">{project.avgTicket}</p>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-3 sm:grid-cols-3">
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Total Views</p>
                            <p className="mt-2 text-2xl font-bold">{project.totalViews}</p>
                        </article>
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Active Leads</p>
                            <p className="mt-2 text-2xl font-bold">{project.activeLeads}</p>
                        </article>
                        <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Closed Visits</p>
                            <p className="mt-2 text-2xl font-bold">{closedCount}</p>
                        </article>
                    </div>

                    <div className="mb-6 grid gap-4 lg:grid-cols-2">
                        <ProjectViewsLineChart monthlyAnalytics={project.monthlyAnalytics} />
                        <ProjectLeadBars monthlyAnalytics={project.monthlyAnalytics} />
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-base font-semibold">Upcoming Visits</h2>
                                <span className="text-xs text-[#F5EFE7]/75">{project.upcomingVisits.length} scheduled</span>
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
                                        {project.upcomingVisits.map((visit) => (
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
                                <h2 className="text-base font-semibold">Completed Visits</h2>
                                <span className="text-xs text-[#F5EFE7]/75">{project.completedVisits.length} outcomes</span>
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
                                        {project.completedVisits.map((visit) => (
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
                </section>
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
