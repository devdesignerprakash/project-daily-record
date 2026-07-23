import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// A fresh store per call — required in Next.js App Router so store state
// isn't accidentally shared across requests/users on the server.
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });
