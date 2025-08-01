"use client"

import { send } from "process";
import supabaseClient from "../../supabase/client";
import { buildPrompt } from "./promt";
import { addMessage} from "@/redux/dashboard/dashboard";

const CreateChatSession = async (title : string) : Promise<string> =>{
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                return "";
            }
            if (!data.user) {
                return "";
            }
            const { data: sessionData, error: sessionError } = await supabaseClient
                .from('chatSession')
                .insert([{ title: title, user_id: data.user.id }])
                .select();
            
            if (sessionError) {
                return;
            }
            return sessionData[0].id;
        }
    )
}

const CreateChatMessage = async (content : string, chatSessionId: string, role : string) =>{
    supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.error("Error fetching user:", error);
                return;
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return;
            }
            const { data: messageData, error: messageError } = await supabaseClient
                .from('chatMessage')
                .insert([{ content: content, session_id: chatSessionId, user_id: data.user.id, role : role}]);
            
            if (messageError) {
                console.error("Error creating chat message:", messageError);
            }
        }
    )
}

const GetAllSessions = async () : Promise<any[]> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.error("Error fetching user:", error);
                return [];
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return [];
            }
            let { data: sessionsData, error: sessionsError } = await supabaseClient
            .from('chatSession')
            .select('title, id')

            if (sessionsError) {
                console.error("Error fetching chat sessions:", sessionsError);
                return [];
            }
            return sessionsData || [];
        }
    )
}

const GetAllMessages = async (sessionId : string) : Promise<any[]> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.error("Error fetching user:", error);
                return [];
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return [];
            }
            let { data: chatsData, error: chatsError } = await supabaseClient
            .from('chatMessage')
            .select('content, id, role')
            .eq('session_id', sessionId)

            if (chatsError) {
                console.log("Error fetching chat messages:", chatsError);
                return [];
            } else {
                return chatsData || [];
            }
        }
    )
}

const ChatWithASession = async (userResponse : string, session_id : string, messages : any[]) => {
    CreateChatMessage(userResponse, session_id, "user");
    const prompt = buildPrompt(messages);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
     body: JSON.stringify({
        model: "gpt-4-1106-preview", 
        messages: prompt,
        temperature: 0.7,
    }),
    });

    const result = await response.json();
    CreateChatMessage(result.choices[0].message.content, session_id, "assistant");
    return result.choices[0].message.content;
}

const DeleteSession = async (sessionId: string) : Promise<boolean> => {

    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                return false;
            }
            if (!data.user) {
                return false;
            }
            const { error : messagesError } = await supabaseClient
                .from('chatMessage')
                .delete()
                .eq('session_id', sessionId);
            if (messagesError) {
                return false;
            }
            const { error : sessionError } = await supabaseClient
                .from('chatSession')
                .delete()
                .eq('id', sessionId);
            if (sessionError) {
                return false;
            }
            console.log("Session deleted successfully");
            return true;
        }
    )
}

export { CreateChatSession, CreateChatMessage, GetAllSessions, GetAllMessages, ChatWithASession, DeleteSession };