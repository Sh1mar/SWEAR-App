"use client"

import React, { useEffect } from "react";
import supabaseClient from "@/supabase/client";
import { CheckIfAuthenticated, SignInUser, SignOutUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession, GetAllMessages, GetAllSessions } from "@/components/functions/dashboard";
import { create } from "domain";
import { buildPrompt } from "@/components/functions/promt";
import { addMessage, setCurrentSessionId, setMessages, setSessions, setUserResponse } from "@/redux/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChatWithASession } from "@/components/functions/dashboard";
import { useParams, useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();
    const params = useParams();

    const dispatch = useAppDispatch();
    const currentSessionId = useAppSelector((state) => state.dashboard.currentSessionId);
    const currentUserResponse = useAppSelector((state) => state.dashboard.userResponse);
    const allMessages = useAppSelector((state) => state.dashboard.messages);
    const allSessions = useAppSelector((state) => state.dashboard.sessions);

    useEffect(() => {
      const id = params.id as string;
      const isUserAuthenticated = CheckIfAuthenticated()
      if (!isUserAuthenticated) {
        router.push("/auth/login");
      }else{
        GetAllSessions().then((sessions) => {
          if (sessions.length === 0) {
            CreateChatSession("Fresh Start").then((newSessionId) => {
              if (newSessionId) {
                router.push(`/dashboard/chat/${newSessionId}`);
              }
            });
          }else if (!(sessions.find(session => session.id === id))) {
            router.push(`/dashboard/chat/${sessions[sessions.length - 1].id}`);
          }else{
            dispatch(setSessions(sessions));
            dispatch(setCurrentSessionId(id));
            GetAllMessages(id).then((history) => {
                dispatch(setMessages(history));
            });
          }
        });
      }
    }, []);

    const handleChat = async (userResponse : string, session_id : string) => {
        const res = await ChatWithASession(userResponse, session_id, [...allMessages,{
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

    const handleCreateSession = async (title: string) => {
        const res = await CreateChatSession(title);
        router.push(`/dashboard/chat/${res}`);
    }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col">
        {allMessages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <span className="role">{message.role}: </span>
            <span className="content">{message.content}</span>
          </div>
        ))}
        <br></br>
        <br></br>
        <button onClick={() => handleCreateSession("New Session 4ji3i3")}>Create New Session</button>
        <input onChange={(e) => dispatch(setUserResponse(e.target.value))}></input>
        <button onClick={() => handleChat(currentUserResponse, currentSessionId)}>Send Message</button>
        <br></br>
        <br></br>
        <button onClick={() => SignOutUser().then(() => router.push("/auth/login"))}>Sign Out</button>
      </div>
    </div>
  );
}