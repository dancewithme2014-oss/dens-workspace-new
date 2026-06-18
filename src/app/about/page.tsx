import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "About | Den Workspace", description: "The builder, process and philosophy behind Den Workspace." };

export default function Page() { return <AboutPage/>; }
