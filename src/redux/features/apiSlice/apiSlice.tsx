import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as any).user.token;
      if (token && endpoint !== "getMapNotes") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
    }),
    createNote: builder.mutation({
      query: (note) => ({
        url: "/notes",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Note"],
    }),
    getNotes: builder.query({
      query: () => ({
        url: "/notes",
        method: "GET",
      }),
      providesTags: ["Note"],
    }),
    getMapNotes: builder.query({
      query: () => ({
        url: "/map",
        method: "GET",
      }),
      providesTags: ["Note"],
    }),
    getNoteById: builder.query({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "GET",
      }),
    }),
    updateNote: builder.mutation({
      query: ({ id, ...note }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: note,
      }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: "/update-user",
        method: "PUT",
        body: user,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),
    verifyToken: builder.query({
      query: () => ({
        url: "/verify-token",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useCreateNoteMutation,
  useGetNotesQuery,
  useGetMapNotesQuery,
  useGetNoteByIdQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useVerifyTokenQuery,
} = apiSlice;
