"use client";
import { useEffect, useState } from "react";
import { Field, FieldForPrivateEmail } from "@/components/form";
import { getUrl } from "@/utils/getUrl";
import { SubmitButton } from "@/components/submitButton";
import { generateRandomId } from "@/utils/generateRandomId";

import { supabase } from "@/utils/supabase";
import { checkUserExist } from "./action";
import { getLabels } from "@/utils/labels";
import { LanguageSwitcher } from "@/components/changeLanguageButton";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading";

export default function SignUpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [isCheckedAgreement, setIsCheckedAgreement] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConf = formData.get("password-confirm") as string;

    if (password != passwordConf) {
      alert("同じパスワードを入力してください。");
      return;
    }

    const { ok } = await checkUserExist(email);
    if (!ok) {
      alert(labels?.registration.user_exist as String);
      window.location.reload();
      return;
    }

    // console.log(email, password, getUrl());
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          temporary_id: generateRandomId(),
        },
      },
    });
    console.log(data);
    if (error) {
      alert(error);
      return;
    }

    setEmail(email);
    setPage(2);
  };

  if (!labels) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <div className="group max-w-2xl w-full flex flex-col">
        <div className="flex justify-between mb-10">
          <p className="text-2xl font-medium">
            Student Union {labels.registration.title}
          </p>
          <LanguageSwitcher />
        </div>

        {page === 1 && (
          <form>
            <FieldForPrivateEmail
              type="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              name="email"
              label={labels.registration.private_email_label}
              placeholder="sample@gmail.com"
              description={labels.registration.private_email_desc}
              required={true}
            />
            <Field
              type="password"
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}"
              name="password"
              label={labels.registration.password_label}
              placeholder="********"
              description={labels.registration.password_desc}
              required={true}
            />
            <Field
              type="password"
              name="password-confirm"
              label={labels.registration.password_confirm_label}
              placeholder="********"
              description={labels.registration.password_confirm_desc}
              required={true}
            />
            <div className="flex items-center justify-center mt-4 mb-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={isCheckedAgreement}
                    onChange={() =>
                      setIsCheckedAgreement((prevStatus) => !prevStatus)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2"
                  />
                  <label htmlFor="agree" className="ms-2 text-sm">
                    {labels.registration.agreement_label_prefix}
                    <a
                      target="_blank"
                      href={`${getUrl()}/resource/agreement`}
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {labels.registration.agreement_label}
                    </a>
                    {labels.registration.agreement_label_suffix}
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <SubmitButton
                label="Sign Up"
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSubmit={signUp}
                isValid={isCheckedAgreement}
              />
              <p className="ms-2 mt-4 text-sm text-right">
                {labels.registration.login_label}{" "}
                <span
                  onClick={() => router.push(`/${lang}/login`)}
                  className="text-blue-600 hover:underline"
                >
                  {labels.registration.login_page}
                </span>
              </p>
            </div>
          </form>
        )}

        {page === 2 && (
          <>
            <h1 className="font-sans text-xl">
              {labels.registration.confirm_title}
            </h1>
            <p className="my-4">
              {labels.registration.confirm_text_1}
              <br />
              <span className="font-semibold">{email}</span>
              <br />
              {labels.registration.confirm_text_2}
            </p>
            <p>{labels.registration.confirm_text_3}</p>
          </>
        )}
      </div>
    </div>
  );
}
