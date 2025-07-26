"use client"

import { useEffect } from "react";
import supabaseClient from "@/components/supabase/client";
import { SignInUser, SignOutUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession, GetAllMessages, GetAllSessions } from "@/components/functions/dashboard";
import { create } from "domain";

export default function Page() {

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <button onClick={() => SignInUser("abbazsr795@gmail.com", "abbazsr795@gmail.com")}>sign in</button>
        <button onClick={() => SignOutUser()}>log out</button>
        <button onClick={() => CreateChatMessage("whats up beiging", "2b2b3af2-1b7a-43b2-bacc-778c5b288fdc")}>Create Chat Message</button>
        <button onClick={() => GetAllSessions()}>Get All Sessions</button>
        <button onClick={() => GetAllMessages("60b83454-a78a-4348-bf04-cd5e00c2a9e2")}>Get All Messages</button>
      </div>
    </div>
  );
}