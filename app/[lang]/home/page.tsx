"use client";
import { signout } from "@/utils/supabase/auth";
import { useEffect, useState } from "react";

export default function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const [lang, setLang] = useState<string>("");

  useEffect(() => {
    const initialLoad = async () => {
      const { lang } = await params;
      setLang(lang);
    };

    initialLoad();
    // console.log('initial load')
  }, []);

  return (
    <div>
      <h1>Welcome to the homepage!</h1>
      <p>Language: {lang}</p>
      <button onClick={() => signout()}>Sign Out</button>
    </div>
  );
}
