"use client";
// import { signout, validateUser } from "@/utils/supabase/auth";
// import { useRouter, redirect } from "next/navigation";
import { signout } from "@/utils/supabase/auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmUser } from "./action";

const NavigationButton = ({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <button
      type="submit"
      onClick={() => router.push(url)}
      className="mt-6 flex w-full justify-center rounded-md border border-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm hover:bg-indigo-100"
    >
      {children}
    </button>
  );
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialLoad = async () => {
      await confirmUser();
      setIsLoading(false);
    };

    initialLoad();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white text-black">
      <div className="group max-w-2xl w-full flex flex-col">
        {isLoading ? (
          <>
            <button className="mt-6 w-full h-8 bg-indigo-100 rounded-md border border-indigo-600 shadow-sm animate-pulse text-indigo-600">Loading...</button>
            <button className="mt-6 w-full h-8 bg-indigo-100 rounded-md border border-indigo-600 shadow-sm animate-pulse" />
            <button className="mt-6 w-full h-8 bg-indigo-100 rounded-md border border-indigo-600 shadow-sm animate-pulse" />
          </>
        ) : (
          <>
            <NavigationButton url="/registration">
              Registration
            </NavigationButton>
            <NavigationButton url="/registration/force">
              Registration (Force)
            </NavigationButton>
            <NavigationButton url="/agreement">Agreement</NavigationButton>
            <NavigationButton url="/home">User Home</NavigationButton>
            <NavigationButton url="/admin/memberList">
              Admin - Member List
            </NavigationButton>
            <NavigationButton url="/admin/validationList">
              [Preparing...] Admin - Validation List
            </NavigationButton>
            <NavigationButton url="/admin/manualValidation">
              Admin - Manual Validation
            </NavigationButton>
            <NavigationButton url="/support">Help Desk</NavigationButton>
            <button
              type="submit"
              onClick={() => signout()}
              className="mt-10 flex w-full justify-center rounded-md border border-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-red-600 shadow-sm hover:bg-red-700"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
