"use client";
import { Field } from "@/components/form";
import { SubmitButton } from "@/components/submitButton";
import { supportForm } from "./actions";
// import { validateUser } from "@/utils/supabase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SupportPage() {
  const router = useRouter();
  const [submit, setSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    await supportForm(formData);
    setSubmit(true);
    console.log("form send");

    setIsLoading(false);
  };

  const [user, setUser] = useState<any>();
  const getUserData = async () => {
    setIsLoading(true);

    // const { userData } = await validateUser();
    // setUser(userData);
    // console.log(userData);
    // console.log(memberData);

    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <form className="group max-w-2xl w-full flex flex-col gap-2">
        <a
          className="text-2xl font-medium cursor-pointer mb-4"
          onClick={() => router.push("/home")}
        >
          GLOMAC Student Union - Support Form
        </a>
        {submit ? (
          <>
            <p>Thank you for submitting the form.</p>
            <p>フォームが送信されました。</p>
            <button
              type="submit"
              onClick={() => router.push("/home")}
              className=" mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30"
            >
              Return to Home
            </button>
          </>
        ) : (
          <>
            {user && user.email ? (
              <div className="flex-1 mb-3">
                <label
                  className="block text-sm font-medium leading-6 text-gray-900"
                  htmlFor="email"
                >
                  User Email | メールアドレス
                  <div className="peer mt-2 block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    {user.email}
                  </div>
                  <input
                    // className="hidden"
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    required
                    hidden
                  />
                </label>
              </div>
            ) : (
              <Field
                type="email"
                name="email"
                label="User Email | メールアドレス"
                placeholder=""
                required={true}
              />
            )}
            <Field
              type="text"
              name="subject"
              label="Subject | 件名"
              placeholder=""
              required={true}
            />
            <Field
              type="text"
              name="body"
              label="Content | 内容"
              placeholder=""
              required={true}
            />
            <div className="mt-4">
              <SubmitButton
                label="Send"
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleSubmit={handleSubmit}
              />
            </div>
          </>
        )}
      </form>
    </div>
  );
}
