"use server"
import { LanguageSwitcher } from "@/components/changeLanguageButton";
import Link from "next/link";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div>
      <h1>Welcome to the Top Page!</h1>
      <p>Language: {lang}</p>
      <LanguageSwitcher />
      <Link href={`/${lang}/home`}>To Home</Link>
    </div>
  );
}
