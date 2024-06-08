import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";

interface UserState {
  token: string | null;
  username: string | null;
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
  username: localStorage.getItem("username"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; username: string }>
    ) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      if (token && username) {
        state.token = token;
        state.username = username;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.loginUser.matchFulfilled,
      (state, action) => {
        state.token = action.payload.token;
        state.username = action.payload.user.username;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.user.username);
      }
    );
  },
});

export const { loginSuccess, logoutSuccess, restoreSession } =
  userSlice.actions;

export default userSlice.reducer;
