import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import ProjectsPage from "@/components/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects | Den's Workspace",
  description: "AI products, business systems, research and experiments by Den's Workspace.",
};

const mobileFolders: Record<string, string> = {
  BizTok: "biztok",
  "Virtual COO": "Virtual COO",
  "Warehouse AI": "warehouse",
  "Marketing Engine": "n8n_news",
};

async function getMobileMedia() {
  const entries = await Promise.all(Object.entries(mobileFolders).map(async ([project, folder]) => {
    const directory = path.join(process.cwd(), "public", "projects", folder, "mobile");

    try {
      const files = (await readdir(directory, { withFileTypes: true }))
        .filter(entry => entry.isFile() && /\.(avif|jpe?g|png|webp)$/i.test(entry.name))
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      if (files.length < 6) return [project, []] as const;

      return [project, files.slice(0, 6).map(file => `/projects/${folder}/mobile/${file}`)] as const;
    } catch {
      return [project, []] as const;
    }
  }));

  return Object.fromEntries(entries);
}

export default async function Page() {
  return <ProjectsPage mobileMedia={await getMobileMedia()}/>;
}
