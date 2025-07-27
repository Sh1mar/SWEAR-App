import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  messages : any[];
  sessions : any[];
  currentSessionId : string;
}

const initialState: DashboardState = {
    messages : [],
    sessions : [],
    currentSessionId : "",
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    setSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    },
    setCurrentSessionId: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
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

export const { setMessages, setSessions, setCurrentSessionId, clearMessages, clearSessions, clearCurrentSessionId } = DashboardSlice.actions;
export default DashboardSlice.reducer;