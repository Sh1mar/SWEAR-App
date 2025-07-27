import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail : string;
  userPassword : string;
  showContent : boolean;
}

const initialState: AuthState = {
    userEmail : "",
    userPassword : "",
    showContent : false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      state.userPassword = action.payload;
    },
    setShowContent: (state, action: PayloadAction<boolean>) => {
      state.showContent = action.payload;
    },
    clearUserEmail: (state) => {
      state.userEmail = "";
    },
    clearUserPassword: (state) => {
      state.userPassword = "";
    },
  },
});

export const { setUserEmail, setUserPassword, clearUserEmail, clearUserPassword, setShowContent } = AuthSlice.actions;
export default AuthSlice.reducer;