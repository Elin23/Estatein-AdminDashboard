import { createSlice, createAsyncThunk, type Draft } from "@reduxjs/toolkit";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "../../firebaseConfig";

interface GenericState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

interface CreateGenericSliceOptions<T, Data = T> {
  name: string; // مثلاً: "values", "team"
  path: string; // مسار Firebase: "values", "team"
  selectId?: (item: Data) => string;
  transform?: (item: Data, id: string) => T;
}

export const createGenericSlice = <T, Data = T>({
  name,
  path,
  selectId = (item) => (item as any).id,
  transform,
}: CreateGenericSliceOptions<T, Data>) => {

    const subscribe = createAsyncThunk(`${name}/subscribe`, ( _, { dispatch, getState }) => {
    const state = getState() as any;
    const currentUnsub = state[name]?.unsubscribe;

    if (currentUnsub) currentUnsub();

    const dataRef = ref(db, path);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const items: T[] = Object.entries(data)
          .map(([id, value]: [string, any]) => {
            const itemData = value as Data;
            return transform ? transform(itemData, id) : ({ ...itemData, id } as any as T);
          })
          .reverse();

        dispatch(setItems(items));
      },
      (error) => {
        dispatch(setError(error.message || `Failed to load ${name}`));
      }
    );

    dispatch(setUnsubscribe(() => unsubscribe));
  });

  const add = createAsyncThunk(
    `${name}/add`,
    async (itemData: Omit<Data, "id">, { rejectWithValue }) => {
      try {
        const newRef = push(ref(db, path));
        await set(newRef, itemData);
      } catch (err: any) {
        return rejectWithValue(err.message || `Failed to add ${name}`);
      }
    }
  );

  const update = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }: { id: string; data: Omit<Data, "id"> }, { rejectWithValue }) => {
      try {
        await update(ref(db, `${path}/${id}`), data);
      } catch (err: any) {
        return rejectWithValue(err.message || `Failed to update ${name}`);
      }
    }
  );

  const del = createAsyncThunk(
    `${name}/delete`,
    async (id: string, { rejectWithValue }) => {
      try {
        await remove(ref(db, `${path}/${id}`));
      } catch (err: any) {
        return rejectWithValue(err.message || `Failed to delete ${name}`);
      }
    }
  );

  const initialState: GenericState<T> = {
    items: [],
    loading: false,
    error: null,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setItems(state, action: { payload: T[] }) {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      },
      setLoading(state, action: { payload: boolean }) {
        state.loading = action.payload;
      },
      setError(state, action: { payload: string | null }) {
        state.error = action.payload;
        state.loading = false;
      },
      setUnsubscribe(state, action: { payload: (() => void) | undefined }) {
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
      const pending = (state: Draft<GenericState<T>>) => {
        state.loading = true;
        state.error = null;
      };

      const fulfilled = (state: Draft<GenericState<T>>) => {
        state.loading = false;
      };

      const rejected = (state: Draft<GenericState<T>>, action: any) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      };

      builder
        .addCase(subscribe.pending, pending)
        .addCase(subscribe.fulfilled, fulfilled)
        .addCase(subscribe.rejected, rejected)
        .addCase(add.pending, pending)
        .addCase(add.fulfilled, fulfilled)
        .addCase(add.rejected, rejected)
        .addCase(update.pending, pending)
        .addCase(update.fulfilled, fulfilled)
        .addCase(update.rejected, rejected)
        .addCase(del.pending, pending)
        .addCase(del.fulfilled, fulfilled)
        .addCase(del.rejected, rejected);
    },
  });

  return {
    slice,
    subscribe,
    add,
    update,
    delete: del,
    actions: slice.actions,
  };
};