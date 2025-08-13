import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { ValueItem } from "../../types/ValueItem";

interface ValuesState {
  items: ValueItem[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: ValuesState = {
  items: [],
  loading: false,
  error: null,
};

export const subscribeToValues = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("values/subscribe", async (_, { rejectWithValue, dispatch, getState }) => {
  const state = getState() as any;
  const currentUnsub = state.values.unsubscribe;

  if (currentUnsub) {
    currentUnsub();
  }

  try {
    dispatch(setLoading(true));
    const valuesRef = ref(db, "values");

    const unsubscribe = onValue(
      valuesRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};
        const valuesList: ValueItem[] = Object.entries(data).map(
          ([id, value]: [string, any]) => ({
            id,
            title: value.title ?? "",
            description: value.description ?? "",
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

export const addValue = createAsyncThunk<
  void,
  Omit<ValueItem, "id">,
  { rejectValue: string }
>("values/add", async (payload, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "values"));
    await set(newRef, {
      title: payload.title.trim(),
      description: payload.description.trim(),
    });
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to add value");
  }
});

export const updateValue = createAsyncThunk<
  void,
  ValueItem,
  { rejectValue: string }
>("values/update", async (payload, { rejectWithValue }) => {
  try {
    await update(ref(db, `values/${payload.id}`), {
      title: payload.title.trim(),
      description: payload.description.trim(),
    });
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update value");
  }
});

export const deleteValue = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("values/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `values/${id}`));
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete value");
  }
});

const valuesSlice = createSlice({
  name: "values",
  initialState,
  reducers: {
    setValues(state, action: PayloadAction<ValueItem[]>) {
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
      .addCase(addValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addValue.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add value";
      })
      // updateValue
      .addCase(updateValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateValue.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update value";
      })
      // deleteValue
      .addCase(deleteValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteValue.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteValue.rejected, (state, action) => {
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
