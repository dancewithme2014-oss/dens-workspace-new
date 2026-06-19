import AdminHeading from "@/components/admin/AdminHeading";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminSettingsPage() {
  return <><AdminHeading eyebrow="WORKSPACE" title={{ ru: "Настройки", en: "Settings" }}/><AdminSettings/></>;
}
