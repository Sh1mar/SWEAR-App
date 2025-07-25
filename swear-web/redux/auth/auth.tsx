import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail : string;
  userPassword : string;
}

const initialState: AuthState = {
    userEmail : "",
    userPassword : "",
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
    clearUserEmail: (state) => {
      state.userEmail = "";
    },
    clearUserPassword: (state) => {
      state.userPassword = "";
    },
  },
});

export const { setUserEmail, setUserPassword, clearUserEmail, clearUserPassword } = AuthSlice.actions;
export default AuthSlice.reducer;