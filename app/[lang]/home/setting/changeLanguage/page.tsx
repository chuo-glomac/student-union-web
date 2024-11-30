"use client";

import { useLanguageSwitcher } from "@/utils/language";

export default function Page() {
  const { changeLanguage } = useLanguageSwitcher();
  //   const router = useRouter();

  return (
    <div className="m-3">
      <main className="flex flex-col gap-2">
        <p>Welcome to the localized page!</p>

        <div className="flex flex-row gap-2">
          <button
            className="border rounded px-4 py-1 w-max"
            onClick={() => changeLanguage("en-US")}
          >
            English
          </button>
          <button
            className="border rounded px-4 py-1 w-max"
            onClick={() => changeLanguage("ja")}
          >
            日本語
          </button>
        </div>
      </main>
    </div>
  );
}
