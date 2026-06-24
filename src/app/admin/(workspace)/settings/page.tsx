import AdminHeading from "@/components/admin/AdminHeading";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminSettingsPage() {
  return <><AdminHeading eyebrow={{ ru: "Рабочее пространство", en: "Workspace" }} title={{ ru: "Настройки", en: "Settings" }}/><AdminSettings/></>;
}
