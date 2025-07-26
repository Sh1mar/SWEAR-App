"use client"

import { useEffect } from "react";
import supabaseClient from "@/components/supabase/client";
import { CheckExistingUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession } from "@/components/functions/dashboard";
import { create } from "domain";

export default function Page() {

    useEffect(() => {
        
    }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <button onClick={() => CreateChatMessage("whats up beiging", "b74b192b-2bec-433f-93c2-c00312da55af")}>Create Chat Message</button>
      </div>
    </div>
  );
}