"use client"

import React, { useEffect } from "react";
import { CheckIfAuthenticated, SignInUser, SignOutUser, DeleteUser } from "@/components/functions/auth";
import { CreateChatMessage, CreateChatSession, DeleteSession, GetAllMessages, GetAllSessions, GetLastSessionId, GetSessionsCount } from "@/components/functions/dashboard";
import { create } from "domain";
import { buildPrompt } from "@/components/functions/promt";
import { addMessage, setCurrentSessionId, setMessages, setSessions, setUserResponse } from "@/redux/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChatWithASession } from "@/components/functions/dashboard";
import { useParams, useRouter } from "next/navigation";
import { setShowContent } from "@/redux/auth/auth";

export default function Page() {

    const router = useRouter();
    const params = useParams();

    const dispatch = useAppDispatch();

    const showContent = useAppSelector((state) => state.auth.showContent);
    const currentSessionId = useAppSelector((state) => state.dashboard.currentSessionId);
    const currentUserResponse = useAppSelector((state) => state.dashboard.userResponse);
    const allMessages = useAppSelector((state) => state.dashboard.messages);
    const allSessions = useAppSelector((state) => state.dashboard.sessions);

    useEffect(() => {
      const id = params.id as string;
      CheckIfAuthenticated().then((isUserAuthenticated) => {
        if (!isUserAuthenticated) {
          router.push("/auth/login");
        }else{
          dispatch(setShowContent(true));
          if(id == "newsession") {
            CreateChatSession("New Session").then((newSessionId) => {
              if (newSessionId) {
                router.push(`/dashboard/chat/${newSessionId}`);
              }
            });
          }else if (id === "lastsession") {
            GetLastSessionId().then((lastSessionId) => {
              if (lastSessionId) {
                router.push(`/dashboard/chat/${lastSessionId}`);
              }
            });
          }else{
            GetAllSessions().then((sessions) => {
              if (!(sessions.find(session => session.id === id))) {
                GetLastSessionId().then((lastSessionId) => {
                  if (lastSessionId) {
                    router.push(`/dashboard/chat/${lastSessionId}`);
                  }
                });
              }else{
                dispatch(setSessions(sessions));
                dispatch(setCurrentSessionId(id));
                GetAllMessages(id).then((history) => {
                    dispatch(setMessages(history));
                });
              }
            });
          }
        }
      });
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
    showContent ? (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="flex flex-col w-full max-w-2xl">
          {allSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                router.push(`/dashboard/chat/${session.id}`);
              }}
            >
              <p>{session.title}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          {allMessages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <span className="role">{message.role}: </span>
              <span className="content">{message.content}</span>
            </div>
          ))}
          <br></br>
          <br></br>
          <button onClick={() => handleCreateSession("New Session")}>Create New Session</button>
          <input onChange={(e) => dispatch(setUserResponse(e.target.value))}></input>
          <button onClick={() => handleChat(currentUserResponse, currentSessionId)}>Send Message</button>
          <br></br>
          <br></br>
          <button onClick={() => DeleteSession(currentSessionId).then(() => {
            GetSessionsCount().then((count) => {
              if(count <= 0) {
                CreateChatSession("New Session").then((newSessionId) => {
                if (newSessionId) {
                  router.push(`/dashboard/chat/${newSessionId}`);
                }
              });
              }else{
                GetLastSessionId().then((lastSessionId) => {
                  router.push(`/dashboard/chat/${lastSessionId}`);
                });
              }
            });
          })}>Delete Session</button>
          <br></br>
          <br></br>
          <button onClick={() => SignOutUser().then(() => router.push("/auth/login"))}>Sign Out</button>
          <br></br>
          <br></br>
          <button onClick={() => {
            DeleteUser().then((success) => {
              if (success) {
                router.push("/auth/sign-up");
              } else {
                console.log("Failed to delete user.");
              }
            });
          }}>Delete User</button>
        </div>
      </div>
    ) : null
  );
}