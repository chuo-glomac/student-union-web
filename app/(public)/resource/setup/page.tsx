"use client";
import { useRouter } from "next/navigation";

export default function AgreementPage() {
  const router = useRouter();

  return (
    <div>
        How to setup GSU.
        <p onClick={() => router.push("/home")} className="text-blue-500 underline cursor-pointer hover:no-underline">Back to Home</p>
    </div>
  );
}
