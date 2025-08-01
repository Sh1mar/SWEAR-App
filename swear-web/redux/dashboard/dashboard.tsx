import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  userResponse: string;
  messages : any[];
  sessions : any[];
  currentSessionId : string;
}

const initialState: DashboardState = {
    userResponse : "",
    messages : [],
    sessions : [],
    currentSessionId : "",
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUserResponse: (state, action: PayloadAction<string>) => {
      state.userResponse = action.payload;
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    setSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    },
    setCurrentSessionId: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
    addSession: (state, action: PayloadAction<any>) => {
      state.sessions.push(action.payload);
    },
    clearUserResponse: (state) => {
      state.userResponse = "";
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearSessions: (state) => {
      state.sessions = [];
    },
    clearCurrentSessionId: (state) => {
      state.currentSessionId = "";
    },
  },
});

export const { setUserResponse, setMessages, setSessions, setCurrentSessionId, addMessage, addSession, clearCurrentSessionId, clearUserResponse, clearMessages, clearSessions } = DashboardSlice.actions;
export default DashboardSlice.reducer;