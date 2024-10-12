import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task", "Application"],
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
    createTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    getTasks: builder.query({
      query: () => ({
        url: "/tasks",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),
    getMapTasks: builder.query({
      query: () => ({
        url: "/map",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
      }),
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
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
    getApplicationsByTaskId: builder.query({
      query: (TaskId) => ({
        url: `/tasks/${TaskId}/applications`,
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
    useLazyGetApplicationsByTaskIdQuery: builder.query({
      query: (TaskId) => `/applications/${TaskId}`,
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
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useGetMapTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useVerifyTokenQuery,
  useGetApplicationsByTaskIdQuery,
  useLazyGetApplicationsByTaskIdQuery,
} = apiSlice;
