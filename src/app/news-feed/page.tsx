import type { Metadata } from "next";
import NewsFeedPage from "@/components/NewsFeedPage";
import { getPublishedArticles } from "@/lib/editorial/server";

export const metadata: Metadata = {
  title: "News Feed | Den Workspace",
  description: "Signals and editorial intelligence about AI, automation, robotics and emerging technology.",
};

export default async function Page() {
  const [ru, en] = await Promise.all([getPublishedArticles("ru"), getPublishedArticles("en")]);
  return <NewsFeedPage articles={{ ru, en }}/>;
}
