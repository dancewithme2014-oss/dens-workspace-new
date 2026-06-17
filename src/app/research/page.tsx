import type { Metadata } from "next";
import ResearchPage from "@/components/ResearchPage";

export const metadata: Metadata = { title: "Research | Den's Workspace", description: "Research, experiments and tools explored at Den's Workspace." };

export default function Page() { return <ResearchPage/>; }
