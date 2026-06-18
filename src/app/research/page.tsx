import type { Metadata } from "next";
import ResearchPage from "@/components/ResearchPage";

export const metadata: Metadata = { title: "Research | Den Workspace", description: "Research, experiments and tools explored at Den Workspace." };

export default function Page() { return <ResearchPage/>; }
