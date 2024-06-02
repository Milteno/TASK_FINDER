import { configureStore } from "@reduxjs/toolkit";
// Importuj swoje slice'y tutaj
import exampleReducer from "./features/exampleSlice/exampleSlice";

const store = configureStore({
  reducer: {
    // Dodaj swoje slice'y tutaj
    example: exampleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
