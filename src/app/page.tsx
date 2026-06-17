import Landing from "@/components/Landing";
import { connection } from "next/server";
import { featuredProjects } from "@/lib/projects-data";
import { hydrateProjectMedia } from "@/lib/project-media";

export default async function Home() {
  await connection();
  return <Landing projects={await hydrateProjectMedia(featuredProjects)} />;
}
