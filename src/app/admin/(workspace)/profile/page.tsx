import AdminHeading from "@/components/admin/AdminHeading";
import AdminProfilePanel from "@/components/admin/AdminProfilePanel";
import { getCurrentEditorialProfile } from "@/lib/editorial/server";

export default async function AdminProfilePage() {
  const profile = await getCurrentEditorialProfile();
  return <><AdminHeading eyebrow="ACCOUNT" title={{ ru: "Профиль", en: "Profile" }}/><AdminProfilePanel profile={profile}/></>;
}
