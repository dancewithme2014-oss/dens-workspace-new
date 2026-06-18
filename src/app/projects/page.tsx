import type { Metadata } from "next";
import { connection } from "next/server";
import ProjectsPage from "@/components/ProjectsPage";
import { allProjects } from "@/lib/projects-data";
import { discoverProjects, getProjectMobileMedia } from "@/lib/project-media";

export const metadata: Metadata = {
  title: "Projects | Den Workspace",
  description: "AI products, business systems, research and experiments by Den Workspace.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  await connection();
  const query = await searchParams;
  const project = Array.isArray(query.project) ? query.project[0] : query.project;
  const projects = await discoverProjects(allProjects);
  return <ProjectsPage projects={projects} mobileMedia={await getProjectMobileMedia(projects)} initialProjectId={project}/>;
}
