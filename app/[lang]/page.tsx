import { LanguageSwitcher } from "@/components/changeLanguageButton";
import { useRouter } from "next/navigation";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const router = useRouter();
  const { lang } = await params;

  return (
    <div>
      <h1>Welcome to the Top Page!</h1>
      <p>Language: {lang}</p>
      <LanguageSwitcher />
      <a onClick={() => router.push(`/${lang}/login`)}>To Home</a>
    </div>
  );
}
