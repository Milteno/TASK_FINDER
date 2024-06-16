import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";

interface UserState {
  token: string | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
}

const initialState: UserState = {
  token: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  city: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        city: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.city = action.payload.city;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("firstName", action.payload.firstName);
      localStorage.setItem("lastName", action.payload.lastName);
      localStorage.setItem("city", action.payload.city);
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.username = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.city = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("city");
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const city = localStorage.getItem("city");
      if (token && username && email && firstName && lastName && city) {
        state.token = token;
        state.username = username;
        state.email = email;
        state.firstName = firstName;
        state.lastName = lastName;
        state.city = city;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.verifyToken.matchFulfilled,
      (state, action) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.city = action.payload.city;
      }
    );
  },
});

export const { loginSuccess, logoutSuccess, restoreSession } =
  userSlice.actions;

export default userSlice.reducer;
