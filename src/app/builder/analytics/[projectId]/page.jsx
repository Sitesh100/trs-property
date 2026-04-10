import ProjectAnalyticsPage from "@/components/builder/project-analytics-page";
import { getProjectById } from "@/components/builder/project-analytics-data";
import { notFound } from "next/navigation";

export default async function BuilderProjectAnalyticsPage({ params }) {
    const project = getProjectById(params.projectId);

    if (!project) {
        notFound();
    }

    return <ProjectAnalyticsPage project={project} />;
}
