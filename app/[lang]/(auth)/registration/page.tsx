"use client";
import { useState } from "react";
import { Field, FieldForPrivateEmail } from "@/components/form";
import { getUrl } from "@/utils/getUrl";
import { SubmitButton } from "@/components/submitButton";
import { generateRandomId } from "@/utils/generateRandomId";

import { supabase } from "@/utils/supabase";

export default function SignUpPage() {
  const [page, setPage] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [isCheckedAgreement, setIsCheckedAgreement] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConf = formData.get("password-confirm") as string;

    if (password != passwordConf) {
      alert("同じパスワードを入力してください。");
      return;
    }

    // console.log(email, password, getUrl());
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          temporary_id: generateRandomId(),
        },
      },
    });
    if (error) {
      alert(error);
      return;
    }

    setEmail(email);
    setPage(2);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <div className="group max-w-2xl w-full flex flex-col">
        <p className="text-2xl font-medium mb-10">
          Student Union (Page: {page})
        </p>

        {page === 1 && (
          <form>
            <FieldForPrivateEmail
              type="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              name="email"
              label="Private Email | 個人メールアドレス"
              placeholder="sample@gmail.com"
              description="！DO NOT USE iCloud　iCloudは使用できません！<br />This email will be used after graduations. (Chuo Email is not allowed)<br />このメールアドレスは卒業後の連絡にも使用されます。(全学メールは使用できません）"
              required={true}
            />
            <Field
              type="password"
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}"
              name="password"
              label="Password | パスワード"
              placeholder="********"
              description="This is used to login to apps with Private Email.<br />Must contain letter, number, and be at least 8 characters.<br />個人メールアドレスと主にログイン時に必要です。<br />必ず英大文字、英小文字、数字を含んでください。"
              required={true}
            />
            <Field
              type="password"
              name="password-confirm"
              label="Confirm Password | パスワード確認"
              placeholder="********"
              description="Please confirm your password.<br />確認のためパスワードを再度入力してください。"
              required={true}
            />
            <div className="flex items-center justify-center mt-4 mb-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={isCheckedAgreement}
                    onChange={() => setIsCheckedAgreement(prevStatus => !prevStatus)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2"
                  />
                  <label htmlFor="agree" className="ms-2 text-sm">
                    <a
                      target="_blank"
                      href={`${getUrl()}resource/agreement`}
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      利用規約
                    </a>
                    に同意する。
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-4">
              <SubmitButton
                label="Sign Up"
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSubmit={signUp}
                isValid={isCheckedAgreement}
              />
            </div>
          </form>
        )}

        {page === 2 && (
          <>
            <h1 className="font-sans text-xl">メール送信完了</h1>
            <p className="my-4">
              以下のメールアドレスにメールを送信しました。<br />
              <span className="font-semibold">{email}</span><br />
              受信メールから引き続き登録をお願いいたします。
            </p>
            <p>
              ※メールが届かない場合は、迷惑メールの設定によりブロックされている場合がございます。お手数ですが、@student-union.proを受信許可にご設定の上、再度最初からお手続きください。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
