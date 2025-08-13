import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import {
  DataSnapshot,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import type { Property, PropertyFormData } from "../../types";

interface PropertiesState {
  list: Property[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: PropertiesState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeToProperties = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>(
  "properties/subscribe",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const currentUnsub = state.properties.unsubscribe;
      if (currentUnsub) currentUnsub();

      dispatch(setLoading(true));
      const propertiesRef = ref(db, "properties");
      let firstLoad = true;

      const unsubscribe = onValue(
        propertiesRef,
        (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const propertiesList: Property[] = Object.entries(data).map(
              ([key, value]: [string, any]) => ({
                ...value,
                id: key,
              })
            );
            dispatch(setProperties(propertiesList.reverse()));
          } else {
            dispatch(setProperties([]));
          }
          if (firstLoad) {
            dispatch(setLoading(false));
            firstLoad = false;
          }
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
  }
);

export const addProperty = createAsyncThunk<
  Property,
  Omit<Property, "id" | "createdAt">,
  { rejectValue: string }
>("properties/add", async (propertyData, { rejectWithValue }) => {
  try {
    const newPropertyRef = push(ref(db, "properties"));
    const newProperty: Property = {
      ...propertyData,
      id: newPropertyRef.key!,
      createdAt: new Date().toISOString(),
    };
    await set(newPropertyRef, newProperty);
    return newProperty;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteProperty = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("properties/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `properties/${id}`));
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const editProperty = createAsyncThunk<
  { id: string; propertyData: PropertyFormData },
  { id: string; propertyData: PropertyFormData },
  { rejectValue: string }
>("properties/edit", async ({ id, propertyData }, { rejectWithValue }) => {
  try {
    const propertyRef = ref(db, `properties/${id}`);
    await update(propertyRef, propertyData);
    return { id, propertyData };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setProperties(state, action: PayloadAction<Property[]>) {
      state.list = action.payload;
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
      .addCase(addProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProperty.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add property";
      })
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete property";
      })
      .addCase(editProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.propertyData }
            : p
        );
      })
      .addCase(editProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to edit property";
      });
  },
});

export const {
  setProperties,
  setError,
  setLoading,
  setUnsubscribe,
  cleanupSubscription,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;
