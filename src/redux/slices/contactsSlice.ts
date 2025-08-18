import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, update, serverTimestamp } from "firebase/database";
import type { ContactType } from "../../types";

interface ContactsState {
  list: ContactType[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: ContactsState = {
  list: [],
  loading: false,
  error: null,
};

function toDate(v: any): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number" || typeof v === "string") return new Date(v);
  return new Date();
}

export const subscribeToContacts = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("contacts/subscribe", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const state = getState();
    const currentUnsub = state.contacts.unsubscribe;
    if (currentUnsub) currentUnsub(); 

    dispatch(setLoading(true));

    const contactsRef = ref(db, "forms/contact");
    const unsubscribe = onValue(
      contactsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: ContactType[] = Object.entries(data).map(
            ([id, value]) => {
              const val = value as any;
              const name =
                [val?.firstName, val?.lastName].filter(Boolean).join(" ") ||
                val?.name ||
                "";

              return {
                id,
                name,
                email: val?.email ?? "",
                subject: val?.inquiryType || val?.subject || "No Subject",
                message: val?.message || "No Message",
                createdAt: toDate(val?.createdAt),
                status: (val?.status as ContactType["status"]) || "new",
              };
            }
          );
          dispatch(setContacts(list));
        } else {
          dispatch(setContacts([]));
        }
        dispatch(setLoading(false));
      },
      (error) => {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
      }
    );

    dispatch(setUnsubscribe(unsubscribe));
  } catch (error: any) {
    dispatch(setLoading(false));
    return rejectWithValue(error.message);
  }
});

export const updateContactStatus = createAsyncThunk<
  { id: string; status: ContactType["status"] },
  { id: string; status: ContactType["status"] },
  { rejectValue: string }
>("contacts/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const contactRef = ref(db, `forms/contact/${id}`);
    const patch: any = { status };
    if (status === "replied") {
      patch.repliedAt = serverTimestamp();
    }
    await update(contactRef, patch);
    return { id, status };
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Failed to update status");
  }
});

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts(state, action: PayloadAction<ContactType[]>) {
      state.list = action.payload;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setUnsubscribe(state, action: PayloadAction<() => void>) {
      state.unsubscribe = action.payload;
    },
    cleanupSubscription(state) {
      if (state.unsubscribe) {
        state.unsubscribe();  
        state.unsubscribe = undefined;
      }
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateContactStatus.pending, (state, action) => {
        const { id, status } = action.meta.arg;
        state.list = state.list.map((c) =>
            c.id === id ? { ...c, status } : c
        );
      })
      .addCase(updateContactStatus.fulfilled, () => {})
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update status";
      });
  },
});

export const {
  setContacts,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = contactsSlice.actions;

export default contactsSlice.reducer;
