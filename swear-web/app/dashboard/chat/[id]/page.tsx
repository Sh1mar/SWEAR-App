"use client"

import React, { useEffect } from "react";
import { SignInUser, SignOutUser, DeleteUser, VerifyValidUser } from "@/components/functions/auth";
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

    const LoadContent = async () => {
      const id = params.id as string;
      const {success, error} = await VerifyValidUser();
      if(success){
        dispatch(setShowContent(true));
        if(id == "newsession") {
          const {success : didCreateNewSession, data : newSessionId} = await CreateChatSession("New Session");
          if(didCreateNewSession && newSessionId){
            router.push(`/dashboard/chat/${newSessionId}`);
          }
        }else if (id === "lastsession") {
          GetLastSessionId().then(({data, success}) => {
            if (success && data) {
              router.push(`/dashboard/chat/${data}`);
            }else{
              router.push(`/dashboard/chat/newsession`);
            }
          });
        }else{
          GetAllSessions().then(({data, success}) => {
            if(data && success){
              if (!(data.find(session => session.id === id))) {
                router.push(`/dashboard/chat/lastsession`);
              }else{
                dispatch(setSessions(data));
                dispatch(setCurrentSessionId(id));
                GetAllMessages(id).then(({data : allMessages, error : didGetAllMessages}) => {
                    if(didGetAllMessages && allMessages){
                      dispatch(setMessages(allMessages));
                    }
                });
              }
            }
          });
        }
      }else{
        router.push("/auth/login");
      }
    }

    const handleChat = async (userResponse : string, session_id : string) => {
      const {data, success} = await ChatWithASession(userResponse, session_id, [...allMessages,{
        role: "user",
        content: userResponse,
      }]);
      dispatch(addMessage({
          role : "user",
          content : userResponse,
      }))
      if(success && data){
        dispatch(addMessage({
          role: "assistant",
          content: data,
        }));
      }
    }

    const handleCreateSession = async (title: string) => {
      const {success : didCreateNewSession, data : newSessionId} = await CreateChatSession(title);
      if(didCreateNewSession && newSessionId){
        router.push(`/dashboard/chat/${newSessionId}`);
      }
    }

    const handleDeleteSession = async (currentSession : string) => {
      const {success} = await DeleteSession(currentSession);
      const {data, success : didGetSessionCount} = await GetSessionsCount();
      if(success){
        if(data && didGetSessionCount){
          if(data <= 0) {
            CreateChatSession("New Session").then(({data : newSessionId, success : gotNewSessionId}) => {
              if (newSessionId && gotNewSessionId) {
                router.push(`/dashboard/chat/${newSessionId}`);
              }
            });
          }else{
            GetLastSessionId().then((lastSessionId) => {
              router.push(`/dashboard/chat/${lastSessionId}`);
            });
          }
        }
      }
    }

    useEffect(() => {
      LoadContent();
    }, []);

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
          <button onClick={() => handleDeleteSession(currentSessionId)}>Delete Session</button>
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

          <br></br>
          <button onClick={() => VerifyValidUser()}>verify</button>
        </div>
      </div>
    ) : null
  );
}