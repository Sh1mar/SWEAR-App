"use client"

import { VerifyValidUser } from "@/functions/auth";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1>Please verify you email id by clicking the link send to you email inbox. then login. Note that you cant login without confirming</h1>
        <button onClick={() => {
            router.push(`/auth/login`)
        }}>After verifying, click here to continue</button>
      </div>
    </div>
  );
}