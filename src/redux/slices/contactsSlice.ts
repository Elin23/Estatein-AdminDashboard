import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
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
              return {
                id,
                name: val.firstName + " " + val.lastName,
                email: val.email,
                subject: val.inquiryType || "No Subject",
                message: val.message || "No Message",
                createdAt: val.createdAt ? new Date(val.createdAt) : new Date(),
                status: val.status || "new",
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

    dispatch(setUnsubscribe(() => unsubscribe));
  } catch (error: any) {
    dispatch(setLoading(false));
    return rejectWithValue(error.message);
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
    updateContactStatus(
      state,
      action: PayloadAction<{ id: string; status: ContactType["status"] }>
    ) {
      const { id, status } = action.payload;
      state.list = state.list.map((c) => (c.id === id ? { ...c, status } : c));
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
});

export const {
  setContacts,
  setLoading,
  setError,
  updateContactStatus,
  setUnsubscribe,
  cleanupSubscription,
} = contactsSlice.actions;
export default contactsSlice.reducer;
