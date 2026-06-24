import AdminHeading from "@/components/admin/AdminHeading";
import AdminProfilePanel from "@/components/admin/AdminProfilePanel";
import { getCurrentEditorialProfile } from "@/lib/editorial/server";

export default async function AdminProfilePage() {
  const profile = await getCurrentEditorialProfile();
  return <><AdminHeading eyebrow={{ ru: "Аккаунт", en: "Account" }} title={{ ru: "Профиль", en: "Profile" }}/><AdminProfilePanel profile={profile}/></>;
}
