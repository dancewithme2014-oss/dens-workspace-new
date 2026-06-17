import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "About | Den's Workspace", description: "The builder, process and philosophy behind Den's Workspace." };

export default function Page() { return <AboutPage/>; }
