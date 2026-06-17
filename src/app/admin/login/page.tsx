import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentEditorialProfile } from "@/lib/editorial/server";

const loginErrors: Record<string, string> = {
  invalid_link: "Ссылка недействительна или уже была использована. Запросите новую ссылку.",
  access_denied: "Для этого пользователя не настроен активный редакционный профиль.",
  profile_error: "Не удалось проверить права доступа. Попробуйте еще раз после обновления страницы.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentEditorialProfile()) redirect("/admin");
  const { error } = await searchParams;
  return <main className="admin-login-page">
    <Link href="/"><ArrowLeft/>Den’s Workspace</Link>
    <section><span><ShieldCheck/></span><p className="eyebrow">EDITORIAL CONTROL</p><h1>Вход в редакцию<i/></h1><p>Закрытая рабочая зона для владельца и приглашенных редакторов. Мы отправим одноразовую ссылку на ваш email.</p><LoginForm initialError={error ? loginErrors[error] ?? loginErrors.invalid_link : ""}/></section>
  </main>;
}
