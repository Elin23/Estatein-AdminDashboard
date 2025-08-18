import { createSlice, createAsyncThunk, type PayloadAction, type Draft } from "@reduxjs/toolkit";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "../../firebaseConfig";

export interface GenericState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

export const createInitialState = <T>(): GenericState<T> => ({
  items: [],
  loading: false,
  error: null,
});

export const createGenericThunks = <T extends { id: string }>(sliceName: string, collectionName: string) => {
  const subscribeToItems = createAsyncThunk<
    void,
    void,
    { rejectValue: string; state: any }
  >(
    `${sliceName}/subscribe`,
    async (_, { rejectWithValue, dispatch, getState }) => {
      try {
        const state = getState();
        const currentUnsub = (state as any)[sliceName]?.unsubscribe;
        if (currentUnsub) {
          currentUnsub();
        }

        dispatch(setLoading(sliceName, true));

        const itemsRef = ref(db, collectionName);
        const unsubscribe = onValue(
          itemsRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const itemsList = Object.entries(data).map(
                ([id, value]) => ({
                  id,
                  ...(value as Omit<T, "id">),
                })
              ) as T[];
              dispatch(setItems(sliceName, itemsList));
            } else {
              dispatch(setItems(sliceName, []));
            }
            dispatch(setLoading(sliceName, false));
          },
          (error) => {
            dispatch(setError(sliceName, error.message));
            dispatch(setLoading(sliceName, false));
          }
        );

        dispatch(setUnsubscribe(sliceName, () => unsubscribe));
      } catch (error: any) {
        dispatch(setLoading(sliceName, false));
        return rejectWithValue(error.message);
      }
    }
  );

  const addItem = createAsyncThunk<
  { id: string },
  Omit<T, "id">,
  { rejectValue: string }
>(`${sliceName}/add`, async (newItem, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, collectionName));
    await set(newRef, newItem);
    return { id: newRef.key! };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

  const updateItem = createAsyncThunk<
    { id: string; data: Partial<Omit<T, "id">> },
    { id: string; data: Partial<Omit<T, "id">> },
    { rejectValue: string }
  >(`${sliceName}/update`, async ({ id, data }, { rejectWithValue }) => {
    try {
      await update(ref(db, `${collectionName}/${id}`), data);
      return { id, data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

  const deleteItem = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
  >(`${sliceName}/delete`, async (id, { rejectWithValue }) => {
    try {
      await remove(ref(db, `${collectionName}/${id}`));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

  return {
    subscribeToItems,
    addItem,
    updateItem,
    deleteItem
  };
};

export const createGenericSlice = <T extends { id: string }>(
  sliceName: string,
  initialState: GenericState<T>
) => {
  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setItems(state, action: PayloadAction<T[]>) {
        state.items = action.payload as Draft<T>[];
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
      const thunks = createGenericThunks<T>(sliceName, sliceName);
      
      builder
        // Add Item
        .addCase(thunks.addItem.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.addItem.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(thunks.addItem.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? `Failed to add ${sliceName.slice(0, -1)}`;
        })
        // Update Item
        .addCase(thunks.updateItem.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.updateItem.fulfilled, (state, action) => {
          state.loading = false;
          const { id, data } = action.payload;
          const index = state.items.findIndex(item => item.id === id);
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...data } as typeof state.items[number];
          }
        })
        .addCase(thunks.updateItem.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? `Failed to update ${sliceName.slice(0, -1)}`;
        })
        // Delete Item
        .addCase(thunks.deleteItem.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunks.deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter((item) => item.id !== action.payload);
        })
        .addCase(thunks.deleteItem.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload ?? `Failed to delete ${sliceName.slice(0, -1)}`;
        });
    },
  });
};

export const setItems = <T>(sliceName: string, items: T[]) => ({
  type: `${sliceName}/setItems`,
  payload: items,
});

export const setLoading = (sliceName: string, loading: boolean) => ({
  type: `${sliceName}/setLoading`,
  payload: loading,
});

export const setError = (sliceName: string, error: string | null) => ({
  type: `${sliceName}/setError`,
  payload: error,
});

export const setUnsubscribe = (sliceName: string, unsubscribe: () => void) => ({
  type: `${sliceName}/setUnsubscribe`,
  payload: unsubscribe,
});