"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import WhatsapBanner from "@/components/home/whatsap-banner";
import {
    BUILDER_PROJECTS,
    INITIAL_LEADS,
    PORTFOLIO_ANALYTICS,
    STATUS_OPTIONS,
} from "@/components/builder/project-analytics-data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const NEW_PROJECT_INITIAL_STATE = {
    name: "",
    location: "",
    typology: "",
    inventory: "",
    possession: "",
    avgTicket: "",
    stage: "Under Construction",
    totalViews: "1200",
    activeLeads: "3",
    image: "/assets/images/project/project1.webp",
};

export default function BuilderAnalyticsDashboard() {
    const router = useRouter();
    const leads = INITIAL_LEADS;
    const [projects, setProjects] = useState(BUILDER_PROJECTS);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [newProject, setNewProject] = useState(NEW_PROJECT_INITIAL_STATE);
    const builderProfile = {
        companyName: "Emerald",
        name: "Aditya Singh",
        email: "aditya.singh@trspropertymall.com",
        description: "Personalised analytics for property views, lead tracking, and closed deals.",
        image: "/assets/images/builderLogo/emerald.webp",
    };

    const statusCounts = useMemo(() => {
        return STATUS_OPTIONS.reduce((acc, status) => {
            acc[status] = leads.filter((lead) => lead.status === status).length;
            return acc;
        }, {});
    }, [leads]);

    const closedDeals = useMemo(() => {
        return projects.reduce((sum, project) => {
            return sum + project.completedVisits.filter((visit) => visit.outcome === "Closed").length;
        }, 0);
    }, [projects]);

    const totalLeads = leads.length;
    const totalVisits = useMemo(() => projects.reduce((sum, project) => sum + project.totalViews, 0), [projects]);

    const comparisonProjects = useMemo(() => BUILDER_PROJECTS.slice(0, 3), []);

    const chartData = useMemo(() => {
        return PORTFOLIO_ANALYTICS.map((item, index) => {
            const row = { month: item.month };

            comparisonProjects.forEach((project) => {
                row[project.id] = project.monthlyAnalytics?.[index]?.views || 0;
            });

            return row;
        });
    }, [comparisonProjects]);

    const projectLineStyles = [
        { stroke: "#C6A256", opacity: 1 },
        { stroke: "#56D3A7", opacity: 0.95 },
        { stroke: "#7AB8FF", opacity: 0.95 },
    ];

    useEffect(() => {
        if (!isAddProjectOpen) return undefined;

        const onEscape = (event) => {
            if (event.key === "Escape") {
                setIsAddProjectOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onEscape);
        };
    }, [isAddProjectOpen]);

    const handleProjectInputChange = (event) => {
        const { name, value } = event.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleProjectImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setNewProject((prev) => ({ ...prev, image: reader.result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddProject = (event) => {
        event.preventDefault();

        const projectId = newProject.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const viewsNumber = Number(newProject.totalViews) || 0;
        const leadsNumber = Number(newProject.activeLeads) || 0;

        const generatedMonthlyAnalytics = [
            { month: "Jan", views: Math.round(viewsNumber * 0.14), leads: Math.max(1, Math.round(leadsNumber * 0.6)), closed: 0 },
            { month: "Feb", views: Math.round(viewsNumber * 0.16), leads: Math.max(1, Math.round(leadsNumber * 0.7)), closed: 1 },
            { month: "Mar", views: Math.round(viewsNumber * 0.17), leads: Math.max(1, Math.round(leadsNumber * 0.8)), closed: 1 },
            { month: "Apr", views: Math.round(viewsNumber * 0.18), leads: Math.max(1, Math.round(leadsNumber * 0.9)), closed: 1 },
            { month: "May", views: Math.round(viewsNumber * 0.17), leads: Math.max(1, Math.round(leadsNumber * 0.8)), closed: 1 },
            { month: "Jun", views: Math.round(viewsNumber * 0.18), leads: Math.max(1, leadsNumber), closed: 1 },
        ];

        const createdProject = {
            id: projectId || `project-${Date.now()}`,
            name: newProject.name.trim(),
            location: newProject.location.trim(),
            image: newProject.image.trim() || "/assets/images/project/project1.webp",
            typology: newProject.typology.trim(),
            inventory: newProject.inventory.trim(),
            possession: newProject.possession.trim(),
            avgTicket: newProject.avgTicket.trim(),
            stage: newProject.stage.trim(),
            totalViews: viewsNumber,
            activeLeads: leadsNumber,
            monthlyAnalytics: generatedMonthlyAnalytics,
            upcomingVisits: [],
            completedVisits: [],
            analyticsEnabled: false,
        };

        setProjects((prev) => [createdProject, ...prev]);
        setNewProject(NEW_PROJECT_INITIAL_STATE);
        setIsAddProjectOpen(false);
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
                                    src={builderProfile.image}
                                    alt={builderProfile.companyName || builderProfile.name}
                                    fill
                                    sizes="(max-width: 768px) 160px, 208px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Builder Profile</p>
                                    <h1 className="mt-1 text-2xl font-bold leading-tight text-[#F5EFE7]">
                                        {builderProfile.companyName || builderProfile.name}
                                    </h1>
                                    <p className="text-sm text-[#F5EFE7]/85">{builderProfile.name}</p>
                                    <p className="mt-1 text-sm text-[#F5EFE7]/85">{builderProfile.email}</p>
                                    <p className="mt-2 max-w-2xl text-sm text-[#F5EFE7]/80">{builderProfile.description}</p>
                                </div>

                                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                                    <Link
                                        href="/builder/profile"
                                        className="inline-flex items-center justify-center rounded-lg border border-[#F5EFE7]/20 bg-[#F5EFE7]/8 px-4 py-2 text-sm font-medium text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/15"
                                    >
                                        Edit Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddProjectOpen(true)}
                                        className="inline-flex items-center justify-center rounded-lg border border-[#C6A256]/40 bg-[#C6A256]/15 px-4 py-2 text-sm font-medium text-[#E0C484] transition-colors hover:bg-[#C6A256]/25"
                                    >
                                        Add Project
                                    </button>
                                     <Link
                                        href="/builder/post-property"
                                        className="inline-flex items-center justify-center rounded-lg border border-[#F5EFE7]/20 bg-[#F5EFE7]/8 px-4 py-2 text-sm font-medium text-[#F5EFE7] transition-colors hover:bg-[#F5EFE7]/15"
                                    >
                                        post property
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4 sm:p-5">
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Total Views</p>
                                <p className="mt-2 text-3xl font-bold">{totalVisits}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Total Leads</p>
                                <p className="mt-2 text-3xl font-bold">{totalLeads}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Active Leads</p>
                                <p className="mt-2 text-3xl font-bold">{statusCounts["Followup"] || 0}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Not Interested</p>
                                <p className="mt-2 text-3xl font-bold">{statusCounts["Cancelled"] || 0}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Site Visits</p>
                                <p className="mt-2 text-3xl font-bold">{statusCounts["Site Visit"] || 0}</p>
                            </article>
                            <article className="rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-4">
                                <p className="text-xs uppercase tracking-wider text-[#F5EFE7]/70">Closed Deals</p>
                                <p className="mt-2 text-3xl font-bold">{closedDeals}</p>
                            </article>
                        </div>
                    </section>

                    <section className="mb-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-xl font-semibold">Builder Project Portfolio</h2>
                            <span className="rounded-full border border-[#C6A256]/35 bg-[#C6A256]/10 px-3 py-1 text-xs text-[#C6A256]">
                                {projects.length} Active Projects
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <article
                                    key={project.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        if (project.analyticsEnabled === false) return;
                                        router.push(`/builder/analytics/${project.id}`);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            if (project.analyticsEnabled === false) return;
                                            router.push(`/builder/analytics/${project.id}`);
                                        }
                                    }}
                                    className={`group overflow-hidden rounded-xl border border-[#F5EFE7]/10 bg-[#212121]/45 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A256]/50 hover:shadow-[0_16px_40px_-25px_rgba(198,162,86,0.7)] ${
                                        project.analyticsEnabled === false ? "cursor-not-allowed" : "cursor-pointer"
                                    }`}
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
                                            {project.analyticsEnabled === false ? (
                                                <span className="font-medium text-[#F5EFE7]/70">Analytics page pending</span>
                                            ) : (
                                                <Link href={`/builder/analytics/${project.id}`} className="font-medium hover:text-[#E0C484]">
                                                    View full analytics
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <div className="mb-6 mt-6 rounded-xl border border-[#F5EFE7]/10 bg-[#F5EFE7]/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Portfolio Views Trend</h2>
                            <span className="text-xs text-[#F5EFE7]">Demo data - Last 6 months</span>
                        </div>

                        <div className="mb-4 grid gap-3 sm:grid-cols-3">
                            {PORTFOLIO_ANALYTICS.slice(-3).map((item) => (
                                <div key={`preview-${item.month}`} className="rounded-lg border border-[#F5EFE7]/10 bg-[#212121]/30 px-3 py-2">
                                    <p className="text-xs text-[#F5EFE7]">{item.month}</p>
                                    <p className="text-sm font-semibold">{item.views} views</p>
                                    <p className="text-xs text-[#F5EFE7]">
                                        {item.leads} leads, {item.closed} closed
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg border border-[#F5EFE7]/10 bg-[#212121]/30 p-3">
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 8, right: 14, left: 0, bottom: 4 }}>
                                        <CartesianGrid stroke="#F5EFE7" strokeOpacity={0.08} vertical={false} />
                                        <XAxis dataKey="month" tick={{ fill: "#F5EFE7", fontSize: 11 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: "#F5EFE7", fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#171717",
                                                border: "1px solid rgba(198, 162, 86, 0.4)",
                                                borderRadius: "10px",
                                                color: "#F5EFE7",
                                            }}
                                            labelStyle={{ color: "#E0C484" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: "12px", color: "#F5EFE7" }} />

                                        {comparisonProjects.map((project, index) => (
                                            <Line
                                                key={project.id}
                                                type="monotone"
                                                dataKey={project.id}
                                                name={project.name}
                                                stroke={projectLineStyles[index]?.stroke || "#C6A256"}
                                                strokeOpacity={projectLineStyles[index]?.opacity || 1}
                                                strokeWidth={2.5}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>

                {isAddProjectOpen && (
                    <div className="fixed inset-0 z-50">
                        <button
                            type="button"
                            className="absolute inset-0 bg-[#0C0C0C]/75 backdrop-blur-sm"
                            onClick={() => setIsAddProjectOpen(false)}
                            aria-label="Close add project panel"
                        />

                        <aside className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-[#F5EFE7]/10 bg-[#171717] p-5 text-[#F5EFE7] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold">Add New Project</h3>
                                    <p className="mt-1 text-sm text-[#F5EFE7]/75">Fill project details to add it to your portfolio.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddProjectOpen(false)}
                                    className="rounded-lg border border-[#F5EFE7]/20 px-3 py-2 text-sm hover:bg-[#F5EFE7]/10"
                                >
                                    Close
                                </button>
                            </div>

                            <form onSubmit={handleAddProject} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Project Name</span>
                                        <input
                                            required
                                            name="name"
                                            value={newProject.name}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. Riverfront Residences"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Location</span>
                                        <input
                                            required
                                            name="location"
                                            value={newProject.location}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. Sector 89, Gurugram"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Typology</span>
                                        <input
                                            required
                                            name="typology"
                                            value={newProject.typology}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. 2, 3 & 4 BHK"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Inventory</span>
                                        <input
                                            required
                                            name="inventory"
                                            value={newProject.inventory}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. 240 Units"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Possession</span>
                                        <input
                                            required
                                            name="possession"
                                            value={newProject.possession}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. Nov 2028"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Avg Ticket</span>
                                        <input
                                            required
                                            name="avgTicket"
                                            value={newProject.avgTicket}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                            placeholder="e.g. 1.75 Cr"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Construction Stage</span>
                                        <select
                                            name="stage"
                                            value={newProject.stage}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                        >
                                            <option>Pre Launch</option>
                                            <option>Under Construction</option>
                                            <option>Ready to Move</option>
                                        </select>
                                    </label>
                                    <div className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Project Image</span>
                                        <label className="flex h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#F5EFE7]/25 bg-[#0F0F0F] px-3 text-center text-xs text-[#F5EFE7]/75 hover:border-[#C6A256]/45">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProjectImageUpload}
                                                className="hidden"
                                            />
                                            Click to upload image
                                        </label>
                                        <p className="text-[11px] text-[#F5EFE7]/55">Supported: JPG, PNG, WEBP. This is local preview data for now.</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-[#F5EFE7]/10 bg-[#101010]">
                                    <p className="border-b border-[#F5EFE7]/10 px-3 py-2 text-xs text-[#F5EFE7]/75">Image Preview</p>
                                    <div className="relative h-40 w-full">
                                        <Image src={newProject.image} alt="Project preview" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 500px" />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Expected Total Views</span>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            name="totalViews"
                                            value={newProject.totalViews}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm">
                                        <span className="text-[#F5EFE7]/80">Active Leads</span>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            name="activeLeads"
                                            value={newProject.activeLeads}
                                            onChange={handleProjectInputChange}
                                            className="w-full rounded-lg border border-[#F5EFE7]/15 bg-[#0F0F0F] px-3 py-2 text-sm outline-none ring-[#C6A256]/50 focus:ring-2"
                                        />
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t border-[#F5EFE7]/10 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddProjectOpen(false)}
                                        className="rounded-lg border border-[#F5EFE7]/20 px-4 py-2 text-sm hover:bg-[#F5EFE7]/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg border border-[#C6A256]/40 bg-[#C6A256]/20 px-4 py-2 text-sm font-semibold text-[#E0C484] hover:bg-[#C6A256]/30"
                                    >
                                        Add Project
                                    </button>
                                </div>
                            </form>
                        </aside>
                    </div>
                )}
            </main>
            <WhatsapBanner />
            <Footer />
        </>
    );
}
