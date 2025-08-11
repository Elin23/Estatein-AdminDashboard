import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import emailReducer from "./slices/emailSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice"; 

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

const rootReducer = combineReducers({
  email: emailReducer,
  theme: themeReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.MODE !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

