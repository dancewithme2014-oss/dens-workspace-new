import { getCurrentEditorialProfile } from "@/lib/editorial/server";

export default async function AdminProfilePage() {
  const profile = await getCurrentEditorialProfile();
  return <><header className="admin-heading"><div><p>ACCOUNT</p><h1>Профиль<i/></h1></div></header><section className="admin-panel admin-profile"><span>{(profile?.displayName ?? profile?.email ?? "DW").slice(0, 2).toUpperCase()}</span><div><h2>{profile?.displayName ?? "Редактор"}</h2><p>{profile?.email}</p><b>{profile?.role === "owner" ? "Владелец" : "Редактор"}</b></div></section></>;
}
