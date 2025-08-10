import { createAsyncThunk, createSlice, type PayloadAction,  } from "@reduxjs/toolkit";
import { sendViaEmailJS, type EmailParams } from "../../lib/emailjsClient";
import type { RootState } from "../store";

export type SendPayload = {
  to: string;
  subject: string;
  message: string;
  meta?: {
    customer_name?: string;
    form_name?: string;
    category?: string;
  };
};

type EmailState = {
  sending: boolean;
  error: string | null;
  success: boolean;
  lastRequest?: SendPayload;
  lastResponse?: { status?: number; text?: string };
};

const initialState: EmailState = {
  sending: false,
  error: null,
  success: false,
};

export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (payload: SendPayload, { rejectWithValue }) => {
    try {
      const params: EmailParams = {
        to_email: payload.to,
        subject: payload.subject,
        message: payload.message,
        customer_name: payload?.meta?.customer_name,
        form_name: payload?.meta?.form_name,
        category: payload?.meta?.category,
      };
      const res = await sendViaEmailJS(params);
      return { status: res.status, text: res.text };
    } catch (err: any) {
      const msg = err?.text || err?.message || "Failed to send email";
      return rejectWithValue(msg);
    }
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.sending = false;
      state.error = null;
      state.success = false;
      state.lastResponse = undefined;
      state.lastRequest = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state, action) => {
        state.sending = true;
        state.error = null;
        state.success = false;
        state.lastRequest = action.meta.arg;
      })
      .addCase(sendEmail.fulfilled, (state, action: PayloadAction<{status?: number; text?: string}>) => {
        state.sending = false;
        state.success = true;
        state.error = null;
        state.lastResponse = action.payload;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.sending = false;
        state.success = false;
        state.error = String(action.payload ?? action.error.message ?? "Failed to send email");
      });
  },
});

export const { resetEmailState } = emailSlice.actions;

// Selectors
export const selectEmailSending = (s: RootState) => s.email.sending;
export const selectEmailError   = (s: RootState) => s.email.error;
export const selectEmailSuccess = (s: RootState) => s.email.success;

export default emailSlice.reducer;
