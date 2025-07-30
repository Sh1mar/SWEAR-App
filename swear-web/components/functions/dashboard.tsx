"use client"

import { send } from "process";
import {supabaseClient} from "../../supabase/client";
import { buildPrompt } from "./promt";
import { addMessage} from "@/redux/dashboard/dashboard";
import { VerifyValidUser } from "./auth";
import { error } from "console";

const CreateChatSession = async (title : string) : Promise<{error? : string, success? : boolean, data? : string}> =>{
    const {success} = await VerifyValidUser();
    if(success){
        const { data } = await supabaseClient.auth.getUser();
        const { data: sessionData, error: sessionError } = await supabaseClient
            .from('chatSession')
            .insert([{ title: title, user_id: data.user?.id }])
            .select();
        if (sessionError) {
            return {success : false, error : "Failed to create session"};
        }
        return {success : true, error : "None", data : sessionData[0].id}
    }
    return {success : false, error : "No access rights"}
}

const CreateChatMessage = async (content : string, chatSessionId: string, role : string) : Promise<{error? : string, success? : boolean}> =>{

    const {success} = await VerifyValidUser();
    if(success){
        const { data } = await supabaseClient.auth.getUser();
        const { data: messageData, error: messageError } = await supabaseClient
            .from('chatMessage')
            .insert([{ content: content, session_id: chatSessionId, user_id: data.user?.id, role : role}]);
        if (messageError) {
            return {success : false, error : "Failed to create message"};
        }
        return {success : true, error : "None"};
    }
    return {success : false, error : "No access rights"}
}

const GetAllSessions = async () : Promise<{error? : string, success? : boolean, sessionId? : string, data? : any[]}> =>{

    const {success} = await VerifyValidUser();
    if(success){
        let { data: sessionsData, error: sessionsError } = await supabaseClient
            .from('chatSession')
            .select('title, id')
        if (sessionsError) {
            return {success : false, error : "Failed to fetch sessions"};
        }
        return {success : true, error : "None", data : sessionsData || []};
    }
    return {success : false, error : "No access rights"}
}

const GetAllMessages = async (sessionId : string) : Promise<{error? : string, success? : boolean, sessionId? : string, data? : any[]}> => {
    const {success} = await VerifyValidUser();
    if(success){
        let { data: chatsData, error: chatsError } = await supabaseClient
            .from('chatMessage')
            .select('content, id, role')
            .eq('session_id', sessionId)
        if (chatsError) {
            return {success : false, error : "Failed to fetch messages", data : []};
        }
        return {success : true, error : "None", data : chatsData || []};
    }
    return {success : false, error : "No access rights", data : []}
}

const ChatWithASession = async (userResponse : string, session_id : string, messages : any[]) : Promise<{error? : string, success? : boolean, data? : string}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const {success : isUserMessageCreated} = await CreateChatMessage(userResponse, session_id, "user");
        if(!isUserMessageCreated){
            return { success : false, error : "Failed to create message"}
        }
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
        const {success : isUserAICreated} = await CreateChatMessage(result.choices[0].message.content, session_id, "assistant");
        if(!isUserAICreated){
            return { success : false, error : "Failed to create message"}
        }
        return {success : true, error : "None", data : result.choices[0].message.content}
    }
    return {success : false, error : "No access rights"}
}

const DeleteSession = async (sessionId: string) : Promise<{error? : string, success? : boolean}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const { error : messagesError } = await supabaseClient
            .from('chatMessage')
            .delete()
            .eq('session_id', sessionId);
        if (messagesError) {
            return {success : false, error : "Failed to delete messages"};
        }
        const { error : sessionError } = await supabaseClient
            .from('chatSession')
            .delete()
            .eq('id', sessionId);
        if (sessionError) {
            return {success : false, error : "Failed to delete session"};
        }
        return {success : true, error : "None"}
    }
    return {success : false, error : "No access rights"}
}

const GetSessionsCount = async () : Promise<{success? : boolean, error? :string, data? : number}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const { count, error: countError } = await supabaseClient
            .from('chatSession')
            .select('*', { count: 'exact' });   
        if (countError) {
            return {success : false, error : "Failed to get count"}
        }
        return {success : true, error : "None", data : count || -1}
    }
    return {success : false, error : "No access rights"}
}

const GetLastSessionId = async () : Promise<{success? : boolean, error? :string, data? : string}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const { data: sessionsData, error: sessionsError } = await supabaseClient
            .from('chatSession')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(1);
        if (sessionsError || !sessionsData) {
            return {success : false, error : "Failed to get last ID"};
        }
        if(sessionsData.length === 0){
            return {success : false, error : "No sessions"};
        }
        return {success : true, error : "None", data : sessionsData[0].id}
    }
    return {success : false, error : "No access rights"}
}

const DeleteAllSessionsAndMessages = async () : Promise<{success? : boolean, error? : string}> => {
    const {success} = await VerifyValidUser();
    if(success){
        const { data } = await supabaseClient.auth.getUser();
        const { error: messagesError } = await supabaseClient
            .from('chatMessage')
            .delete()
            .eq('user_id', data.user?.id);
        if (messagesError) {
            return {success : false, error : "Error deleting chat messages:"};
        }
        const { error: sessionsError } = await supabaseClient
            .from('chatSession')
            .delete()
            .eq('user_id', data.user?.id);            
        if (sessionsError) {
            return {success : false, error : "Error deleting chat sessions:"};
        }
        return {success : true, error : "None"}
    }
    return {success : false, error : "No access rights"}
}

export { CreateChatSession, CreateChatMessage, GetAllSessions, GetAllMessages, ChatWithASession, DeleteSession, GetSessionsCount, GetLastSessionId, DeleteAllSessionsAndMessages };