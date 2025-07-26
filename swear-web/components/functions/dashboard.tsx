"use client"

import supabaseClient from "../supabase/client";

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
            } else {
                console.log("Chat session created successfully");
            }
        }
    )
}

const CreateChatMessage = async (content : string, chatSessionId: string) =>{
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
                .insert([{ content: content, session_id: chatSessionId, user_id: data.user.id, sender : "user" }]);
            
            if (messageError) {
                console.error("Error creating chat message:", messageError);
            } else {
                console.log("Chat message created successfully");
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
            } else {
                console.log("Chat sessions fetched successfully", sessionsData);
            }
        }
    )
}

const GetAllMessages = async (sessionId : string) => {
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
            let { data: chatsData, error: chatsError } = await supabaseClient
            .from('chatMessage')
            .select('content, id')
            .eq('session_id', sessionId)

            if (chatsError) {
                console.error("Error fetching chat messages:", chatsError);
            } else {
                console.log("Chat messages fetched successfully", chatsData);
            }
        }
    )
}

export { CreateChatSession, CreateChatMessage, GetAllSessions, GetAllMessages };