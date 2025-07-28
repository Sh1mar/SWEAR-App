"use client"

import { send } from "process";
import {supabaseClient} from "../../supabase/client";
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
                console.log("Error fetching user:", error);
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
                console.log("Error creating chat message:", messageError);
            }
        }
    )
}

const GetAllSessions = async () : Promise<any[]> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.log("Error fetching user:", error);
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
                console.log("Error fetching chat sessions:", sessionsError);
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
                console.log("Error fetching user:", error);
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

const GetSessionsCount = async () : Promise<number> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.log("Error fetching user:", error);
                return -1;
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return -1;
            }
            const { count, error: countError } = await supabaseClient
                .from('chatSession')
                .select('*', { count: 'exact' });
            
            if (countError) {
                console.log("Error counting chat sessions:", countError);
                return 0;
            }
            return count || 0;
        }
    )
}

const GetLastSessionId = async () : Promise<string> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.log("Error fetching user:", error);
                return "";
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return "";
            }
            const { data: sessionsData, error: sessionsError } = await supabaseClient
                .from('chatSession')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1);

            if (sessionsError || !sessionsData || sessionsData.length === 0) {
                console.log("Error fetching last session ID:", sessionsError);
                return "";
            }
            return sessionsData[0].id;
        }
    );
}

const DeleteAllSessionsAndMessages = async () : Promise<boolean> => {
    return supabaseClient.auth.getUser().then(
        async ({ data, error }) => {
            if (error) {
                console.log("Error fetching user:", error);
                return false;
            }
            if (!data.user) {
                console.log("No user is authenticated.");
                return false;
            }
            const { error: messagesError } = await supabaseClient
                .from('chatMessage')
                .delete()
                .eq('user_id', data.user.id);
            if (messagesError) {
                console.log("Error deleting chat messages:", messagesError);
                return false;
            }
            const { error: sessionsError } = await supabaseClient
                .from('chatSession')
                .delete()
                .eq('user_id', data.user.id);
            if (sessionsError) {
                console.log("Error deleting chat sessions:", sessionsError);
                return false;
            }
            console.log("All sessions deleted successfully");
            return true;
        }
    );
}

export { CreateChatSession, CreateChatMessage, GetAllSessions, GetAllMessages, ChatWithASession, DeleteSession, GetSessionsCount, GetLastSessionId, DeleteAllSessionsAndMessages };