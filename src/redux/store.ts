import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "./slices/emailSlice";
import paginationReducer from "./slices/paginationSlice";
import locationReducer from "./slices/locationSlice";
import valuesReducer from "./slices/valuesSlice";

export const store = configureStore({
  reducer: {
    email: emailReducer,
    pagination: paginationReducer,
    locations: locationReducer,
    values: valuesReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

