"use client";

import { createClient } from "@/utils/supabase/client";
import { Suspense, useEffect, useState } from "react";
import { SubmitButton } from "@/components/submitButton";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmUser } from "./action";
const supabase = createClient();

function LoginPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params_redirectTo = searchParams?.get("redirectTo") || "home";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lang, setLang] = useState<string>('');

  useEffect(() => {
    const initialLoad = async () => {
      await confirmUser(lang);
    }

    const fetchLabels = async (loadParams: any) => {
      const { lang } = await loadParams;
      console.log(lang);

      setLang(lang);
    };

    fetchLabels(params);
    initialLoad();
    // console.log('initial load')
  }, [])

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError("");

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください");
        return;
      }

      //   await login(email, password);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Login error:", error);
        setError("メールアドレスまたはパスワードが間違っています");
        return;
      }

      await confirmUser(lang);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <form className="max-w-lg w-full">
        <a className="text-2xl font-medium">Login Page</a>

        <label
          className="block text-sm font-medium leading-6 text-gray-900 mt-6"
          htmlFor="email"
        >
          メールアドレス
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
          パスワード
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
            handleSubmit={handleSubmit}
          />
          <p className="text-red-600 mt-2">{error}</p>
          <p className="ms-2 mt-4 text-sm text-right">
            Not yet registered?{" "}
            <span
              onClick={() => router.push("/registration")}
              className="text-blue-600 hover:underline"
            >
              Registration Page
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPageWrapper({ params }: { params: { lang: string } }) {
  return (
    <Suspense>
      <LoginPage params={params} />
    </Suspense>
  );
}
