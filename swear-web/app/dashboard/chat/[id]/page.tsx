"use client"

import React, { useEffect } from "react";
import supabaseClient from "@/components/supabase/client";
import { SignInUser, SignOutUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession, GetAllMessages, GetAllSessions } from "@/components/functions/dashboard";
import { create } from "domain";
import { buildPrompt } from "@/components/functions/promt";
import { addMessage, setCurrentSessionId, setMessages, setUserResponse } from "@/redux/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChatWithASession } from "@/components/functions/dashboard";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {

    const dispatch = useAppDispatch();
    const currentSessionId = useAppSelector((state) => state.dashboard.currentSessionId);
    const currentUserResponse = useAppSelector((state) => state.dashboard.userResponse);
    const messages = useAppSelector((state) => state.dashboard.messages);

    useEffect(() => {
        const { id } = params;
        dispatch(setCurrentSessionId(id));
        GetAllMessages(id).then((history) => {
            dispatch(setMessages(history));
            console.log("Messages fetched and set in Redux store:", history);
        });
    }, []);

    const handleChat = async (userResponse : string, session_id : string) => {
        const res = await ChatWithASession(userResponse, session_id, [...messages,{
          role: "user",
          content: userResponse,
        }]);
        dispatch(addMessage({
            role : "user",
            content : userResponse,
        }))
        dispatch(addMessage({
          role: "assistant",
          content: res,
      }));
    }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <button onClick={() => SignInUser("abbazsr795@gmail.com", "abbazsr795@gmail.com")}>sign in</button> */}
        {/* <button onClick={() => SignOutUser()}>log out</button> */}
        {/* <button onClick={() => CreateChatMessage("whats up beiging", "2b2b3af2-1b7a-43b2-bacc-778c5b288fdc")}>Create Chat Message</button> */}
        {/* <button onClick={() => GetAllSessions()}>Get All Sessions</button> */}
        {/* <button onClick={() => GetAllMessages("60b83454-a78a-4348-bf04-cd5e00c2a9e2")}>Get All Messages</button> */}
        {/* <button onClick={() => ChatWithASession()}>Chat With A Session</button> */}
        <input onChange={(e) => dispatch(setUserResponse(e.target.value))}></input>
        <button onClick={() => handleChat(currentUserResponse, currentSessionId)}>Send Message</button>
      </div>
    </div>
  );
}