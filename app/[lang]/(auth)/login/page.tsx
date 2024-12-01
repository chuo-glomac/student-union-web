"use client";

import { createClient } from "@/utils/supabase/client";
import { Suspense, useEffect, useState } from "react";
import { SubmitButton } from "@/components/submitButton";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmUser, login } from "./action";
import { LanguageSwitcher } from "@/components/changeLanguageButton";
import { getLabels } from "@/utils/labels";
import { LoadingScreen } from "@/components/loading";
const supabase = createClient();

function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params_redirectTo = searchParams?.get("redirectTo") || "/home";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // useEffect(() => {
  //   const initialLoad = async () => {
  //     return confirmUser(lang, params_redirectTo);
  //   };

  //   const fetchLang = async () => {
  //     const resolvedParams = await params;
  //     setLang(resolvedParams.lang);
  //   };

  //   fetchLang();
  //   initialLoad();
  // }, [params]);

  const [lang, setLang] = useState<string>("");
  const [labels, setLabels] = useState<any | null>(null);
  useEffect(() => {
    const fetchLabels = async (loadParams: any) => {
      const { lang } = await loadParams;
      setLang(lang);
      // console.log(lang);

      const localizedLabels = getLabels(lang);
      setLabels(localizedLabels);
    };

    fetchLabels(params);
  }, [params]);

  const handleLogin = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError("");

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Login error:", error);
        setError("メールアドレスまたはパスワードが間違っています");
        return;
      }

      return confirmUser(lang, params_redirectTo);
    } catch (err) {
      alert(err);
    }
  };

  // const handleLogin = async (formData: FormData) => {
  //   return login
  // }
  if (!labels) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <form className="max-w-lg w-full">
        <div className="flex justify-between mb-10">
          <p className="text-2xl font-medium">
            Student Union {labels.login.title}
          </p>
          <LanguageSwitcher />
        </div>

        <label
          className="block text-sm font-medium leading-6 text-gray-900 mt-6"
          htmlFor="email"
        >
          {labels.login.email_label}
        </label>
        <input
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          id="email"
          name="email"
          type="email"
          required
        />
        <label
          className="block text-sm font-medium leading-6 text-gray-900 mt-6"
          htmlFor="password"
        >
          {labels.login.password_label}
        </label>
        <input
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          id="password"
          name="password"
          type="password"
          required
        />
        <div className="mt-8">
          <SubmitButton
            label="Log In"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleSubmit={handleLogin}
          />
          <p className="text-red-600 mt-2">{error}</p>
          <p className="ms-2 mt-4 text-sm text-right">
            {labels.login.registration_label}{" "}
            <span
              onClick={() => router.push(`/${lang}/registration`)}
              className="text-blue-600 hover:underline"
            >
              {labels.login.registration_page}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPageWrapper({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return (
    <Suspense>
      <LoginPage params={params} />
    </Suspense>
  );
}
