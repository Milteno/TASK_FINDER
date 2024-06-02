import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: { username: string } | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: { username: string }; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = userSlice.actions;

export default userSlice.reducer;
