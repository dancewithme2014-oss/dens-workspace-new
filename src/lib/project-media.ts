import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import type { PortfolioProject } from "@/lib/projects-data";

const projectFolders: Record<string, string> = {
  biztok: "biztok",
  "osa-consulting": "osa",
  "virtual-coo": "Virtual COO",
  "warehouse-app": "warehouse",
  "n8n-news": "n8n_news",
  "mmz1-promo": "mmz1",
  "golden-house-dubai": "golden lion",
  chronos: "CHRONOS",
  lightbi: "LightBI",
  website: "Website",
};

const mediaPattern = /\.(avif|jpe?g|png|webp|mp4|webm|mov)$/i;
const imagePattern = /\.(avif|jpe?g|png|webp)$/i;
const mediaOrder: Record<string, number> = {
  main: 0,
  "main screen": 0,
  mainscreen: 0,
  mainscreenbt: 0,
  "1": 0,
  first: 1,
  "first screen": 1,
  second: 2,
  "second screen": 2,
  third: 3,
  "third screen": 3,
  fourth: 4,
  "fourth screen": 4,
  fifth: 5,
  "fifth screen": 5,
  sixth: 6,
  "sixth screen": 6,
};

function orderWeight(file: string) {
  const name = file.replace(/\.[^.]+$/, "").toLowerCase();
  return mediaOrder[name] ?? 50;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectName(folder: string) {
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function publicPath(folder: string, file: string) {
  return `/projects/${folder}/${file}`;
}

async function readFolder(folder: string, child?: string) {
  const directory = path.join(process.cwd(), "public", "projects", folder, child ?? "");
  try {
    return (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && mediaPattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export async function hydrateProjectMedia(projects: readonly PortfolioProject[]) {
  return Promise.all(projects.map(async (project) => {
    const folder = project.folder ?? projectFolders[project.architectureId];
    if (!folder) return project;
    const files = await readFolder(folder);
    if (!files.length) return project;

    const ordered = [...files].sort((a, b) => orderWeight(a) - orderWeight(b) || a.localeCompare(b, undefined, { numeric: true }));
    const cover = ordered.find((file) => imagePattern.test(file));
    return { ...project, folder, image: cover ? publicPath(folder, cover) : project.image, gallery: ordered.map((file) => publicPath(folder, file)) };
  }));
}

export async function discoverProjects(projects: readonly PortfolioProject[]) {
  const projectsRoot = path.join(process.cwd(), "public", "projects");
  let folders: string[] = [];
  try {
    folders = (await readdir(projectsRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name);
  } catch {
    return hydrateProjectMedia(projects);
  }

  const knownFolders = new Set(Object.values(projectFolders).map((folder) => folder.toLowerCase()));
  const discovered: PortfolioProject[] = [];

  for (const folder of folders) {
    if (knownFolders.has(folder.toLowerCase())) continue;
    const files = await readFolder(folder);
    if (!files.length) continue;
    const ordered = [...files].sort((a, b) => orderWeight(a) - orderWeight(b) || a.localeCompare(b, undefined, { numeric: true }));
    const cover = ordered.find((file) => imagePattern.test(file));
    if (!cover) continue;

    discovered.push({
      number: String(projects.length + discovered.length + 1).padStart(2, "0"),
      name: projectName(folder),
      subtitle: "Digital Product",
      description: "Independent digital product and interface experience.",
      image: publicPath(folder, cover),
      status: "Active",
      architectureId: slugify(folder) || `project-${projects.length + discovered.length + 1}`,
      gallery: ordered.map((file) => publicPath(folder, file)),
      tags: ["Product", "Web"],
      folder,
    });
  }

  return hydrateProjectMedia([...projects, ...discovered]);
}

export async function getProjectMobileMedia(projects: readonly PortfolioProject[]) {
  const entries = await Promise.all(projects.map(async (project) => {
    const folder = project.folder ?? projectFolders[project.architectureId];
    if (!folder) return [project.name, []] as const;
    const files = (await readFolder(folder, "mobile")).filter((file) => imagePattern.test(file));
    return [project.name, files.length >= 6 ? files.slice(0, 6).map((file) => `/projects/${folder}/mobile/${file}`) : []] as const;
  }));
  return Object.fromEntries(entries);
}
