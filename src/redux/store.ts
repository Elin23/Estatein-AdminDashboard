import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import emailReducer from "./slices/emailSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice"; 
import locationsReducer from "./slices/locationSlice"; 
import valuesReducer from "./slices/valuesSlice"; 
import paginationReducer from "./slices/paginationSlice"; 
import propertiesReducer from "./slices/propertiesSlice"; 
import achievementsReducer from "./slices/achievementsSlice"; 
import teamReducer from "./slices/teamSlice"; 
import testimonialsReducer from "./slices/testimonialsSlice"; 
import submissionsReducer from "./slices/submissionsSlice"; 
import stepsReducer from "./slices/stepsSlice"; 
import contactsReducer from "./slices/contactsSlice"; 
import socialLinksReducer from "./slices/socialLinksSlice"; 
import faqReducer from "./slices/faqSlice"; 
import clientsReducer from './slices/ClientsSlice'
import usersReducer from './slices/usersSlice'

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

const rootReducer = combineReducers({
  email: emailReducer,
  theme: themeReducer,
  auth: authReducer,
  locations: locationsReducer,
  values: valuesReducer,
  pagination: paginationReducer,
  properties: propertiesReducer,
  achievements: achievementsReducer,
  team: teamReducer,
  testimonials: testimonialsReducer,
  submissions: submissionsReducer,
  steps: stepsReducer,
  contacts: contactsReducer,
  socialLinks: socialLinksReducer,
  faqs: faqReducer,
  clients: clientsReducer,
  users: usersReducer
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

