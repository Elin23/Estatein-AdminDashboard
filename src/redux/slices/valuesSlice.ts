import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { ValueItem } from "../../types/ValueItem";



interface ValuesState {
  items: ValueItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ValuesState = {
  items: [],
  loading: false,
  error: null,
};

export const listenToValues = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("values/listenToValues", async (_, { rejectWithValue, dispatch }) => {
  try {
    const valuesRef = ref(db, "values");
    onValue(
      valuesRef,
      (snapshot) => {
        const data = snapshot.val() ?? {};
        const parsed: ValueItem[] = Object.entries(data).map(
          ([id, value]: [string, any]) => ({
            id,
            title: value.title ?? "",
            description: value.description ?? "",
          })
        );
        dispatch(setValues(parsed));
        dispatch(setError(null));
      },
      (error) => {
        dispatch(setError(error.message));
      }
    );
  } catch (err) {
    return rejectWithValue("Failed to listen to values");
  }
});

// Thunk to add a new value
export const addValue = createAsyncThunk<
  void,
  Omit<ValueItem, "id">,
  { rejectValue: string }
>("values/addValue", async (payload, { rejectWithValue }) => {
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
>("values/updateValue", async (payload, { rejectWithValue }) => {
  try {
    const itemRef = ref(db, `values/${payload.id}`);
    await update(itemRef, {
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
>("values/deleteValue", async (id, { rejectWithValue }) => {
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
      state.error = null;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(addValue.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add value";
      })
      .addCase(updateValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateValue.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update value";
      })
      .addCase(deleteValue.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteValue.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete value";
      });
  },
});

export const { setValues, setError, setLoading } = valuesSlice.actions;
export default valuesSlice.reducer;
