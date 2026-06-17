import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { getCurrentEditorialProfile } from "@/lib/editorial/server";

export default async function AdminWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentEditorialProfile();
  if (!profile) redirect("/admin/login");
  return <main className="admin-workspace"><AdminNav profile={profile}/><div className="admin-main">{children}</div></main>;
}
