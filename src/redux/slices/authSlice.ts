import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  role: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ email: string; role: string }>
    ) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
      console.log(action.payload.role);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.email = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
