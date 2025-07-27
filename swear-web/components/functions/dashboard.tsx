"use client"

import { send } from "process";
import supabaseClient from "../../supabase/client";
import { buildPrompt } from "./promt";
import { addMessage} from "@/redux/dashboard/dashboard";

const CreateChatSession = async (title : string) =>{
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
            const { data: sessionData, error: sessionError } = await supabaseClient
                .from('chatSession')
                .insert([{ title: title, user_id: data.user.id }]);
            
            if (sessionError) {
                console.error("Error creating chat session:", sessionError);
            }
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

const GetAllSessions = async () => {
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
            let { data: sessionsData, error: sessionsError } = await supabaseClient
            .from('chatSession')
            .select('title, id')

            if (sessionsError) {
                console.error("Error fetching chat sessions:", sessionsError);
            }
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
                console.error("Error fetching chat messages:", chatsError);
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

export { CreateChatSession, CreateChatMessage, GetAllSessions, GetAllMessages, ChatWithASession };