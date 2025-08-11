import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "./slices/emailSlice";
import themeReducer from "./slices/themeSlice";
export const store = configureStore({
  reducer: {
    email: emailReducer,
    theme: themeReducer
  },
  devTools: import.meta.env.MODE !== 'production',
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
