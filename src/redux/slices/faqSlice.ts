import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { FaqType } from "../../types/FaqType";

interface FAQState {
  list: FaqType[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: FAQState = {
  list: [],
  loading: false,
  error: null,
};

// 🔹 Subscribe to FAQs in real-time
export const subscribeToFaqs = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("faqs/subscribe", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const state = getState();
    const currentUnsub = state.faqs.unsubscribe;
    if (currentUnsub) currentUnsub();

    dispatch(setLoading(true));

    const faqsRef = ref(db, "faqs");
    const unsubscribe = onValue(
      faqsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list: FaqType[] = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<FaqType, "id">),
          }));
          dispatch(setFaqs(list));
        } else {
          dispatch(setFaqs([]));
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

// 🔹 Add FAQ
export const addFaq = createAsyncThunk<
  void,
  Omit<FaqType, "id">,
  { rejectValue: string }
>("faqs/add", async (newFaq, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "faqs"));
    await set(newRef, newFaq);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// 🔹 Edit FAQ
export const editFaq = createAsyncThunk<
  void,
  { id: string; data: Omit<FaqType, "id"> },
  { rejectValue: string }
>("faqs/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    await update(ref(db, `faqs/${id}`), data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// 🔹 Delete FAQ
export const deleteFaq = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("faqs/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `faqs/${id}`));
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const faqSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    setFaqs(state, action: PayloadAction<FaqType[]>) {
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
});

export const {
  setFaqs,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = faqSlice.actions;

export default faqSlice.reducer;
