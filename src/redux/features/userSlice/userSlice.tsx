import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  username: string | null;
}

const initialState: UserState = {
  token: null,
  username: null,
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
});

export const { loginSuccess, logoutSuccess, restoreSession } =
  userSlice.actions;
export default userSlice.reducer;
