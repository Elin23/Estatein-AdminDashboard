import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { ValuedClient } from "../../types/ValuedClient";

interface ClientsState {
  items: ValuedClient[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
};

export const subscribeToClients = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("clients/subscribe", async (_, { rejectWithValue, dispatch, getState }) => {
  const state = getState() as any;
  const currentUnsub = state.values.unsubscribe;

  if (currentUnsub) {
    currentUnsub();
  }

  try {
    dispatch(setLoading(true));
    const valuesRef = ref(db, "clients");

    const unsubscribe = onValue(
      valuesRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};
        const valuesList: ValuedClient[] = Object.entries(data).map(
         ([id, value]) => ({
            id,
            ...(value as Omit<ValuedClient, "id">),
          })
        );

        dispatch(setValues(valuesList.reverse()));
        dispatch(setError(null));
        dispatch(setLoading(false));
      },
      (error) => {
        dispatch(setError(error.message || "Failed to load values."));
        dispatch(setLoading(false));
      }
    );

    dispatch(setUnsubscribe(() => unsubscribe));
  } catch (err: any) {
    dispatch(setLoading(false));
    return rejectWithValue(err.message || "Failed to subscribe to values.");
  }
});

export const addClient = createAsyncThunk<
  void,
  Omit<ValuedClient, "id">,
  { rejectValue: string }
>("clients/add", async (payload, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "clients"));
    await set(newRef, {
      title: payload.title?.trim(),
      category: payload.category?.trim(),
      domain: payload.domain?.trim(),
      review: payload.review?.trim(),
      since: payload.since?.trim(),
      website: payload.website?.trim()
    });
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to add value");
  }
});

export const updateClient = createAsyncThunk<
  void,
  { id: string; data: Omit<ValuedClient, "id"> },
  { rejectValue: string }
>("clients/update", async (payload, { rejectWithValue }) => {
  try {
    await update(ref(db, `clients/${payload.id}`), {
      title: payload.data.title?.trim(),
      category: payload.data.category?.trim(),
      domain: payload.data.domain?.trim(),
      review: payload.data.review?.trim(),
      since: payload.data.since?.trim(),
      website: payload.data.website?.trim()
    });
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update value");
  }
});

export const deleteClient = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("clients/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `clients/${id}`));
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete value");
  }
});

const valuesSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setValues(state, action: PayloadAction<ValuedClient[]>) {
      state.items = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
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
      // addValue
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add value";
      })
      // updateValue
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update value";
      })
      // deleteValue
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete value";
      });
  },
});

export const {
  setValues,
  setError,
  setLoading,
  setUnsubscribe,
  cleanupSubscription,
} = valuesSlice.actions;

export default valuesSlice.reducer;
