"use client"

import { useEffect } from "react";
import supabaseClient from "@/components/supabase/client";
import { SignInUser, SignOutUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession, GetAllMessages, GetAllSessions } from "@/components/functions/dashboard";
import { create } from "domain";
import { buildPrompt } from "@/components/functions/promt";

export default function Page() {

    const testFuc = () => {
        GetAllMessages("60b83454-a78a-4348-bf04-cd5e00c2a9e2").then((history) => {
            const prompt = buildPrompt(history);
        });
    }

    const ChatWithASession = async (userRespose : string) => {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4-1106-preview", // or "gpt-4.0-nano" if you're accessing via Azure or OpenAI Teams
            messages: prompt,
            temperature: 0.7,
        }),
        });

        const result = await response.json();
        console.log(result.choices[0].message.content);
    }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <button onClick={() => SignInUser("abbazsr795@gmail.com", "abbazsr795@gmail.com")}>sign in</button>
        <button onClick={() => SignOutUser()}>log out</button>
        <button onClick={() => CreateChatMessage("whats up beiging", "2b2b3af2-1b7a-43b2-bacc-778c5b288fdc")}>Create Chat Message</button>
        <button onClick={() => GetAllSessions()}>Get All Sessions</button>
        <button onClick={() => GetAllMessages("60b83454-a78a-4348-bf04-cd5e00c2a9e2")}>Get All Messages</button>
        {/* <button onClick={() => ChatWithASession()}>Chat With A Session</button> */}
      </div>
    </div>
  );
}