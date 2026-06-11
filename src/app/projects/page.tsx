import type { Metadata } from "next";
import ProjectsPage from "@/components/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects | Den's Workspace",
  description: "AI products, business systems, research and experiments by Den's Workspace.",
};

export default function Page() {
  return <ProjectsPage/>;
}
