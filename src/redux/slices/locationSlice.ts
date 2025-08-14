import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";

export interface LocationData {
  branch: string;
  address: string;
  details: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  createdAt: number;
}

export interface Location {
  id: string;
  data: LocationData;
}

interface LocationState {
  items: Location[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: LocationState = {
  items: [],
  loading: false,
  error: null,
};

export const subscribeToLocations = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("locations/subscribe", async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const state = getState();
    const currentUnsub = state.locations.unsubscribe;
    if (currentUnsub) currentUnsub();

    dispatch(setLoading(true));

    const locationsRef = ref(db, "locations");
    const unsubscribe = onValue(
      locationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const locationsList: Location[] = Object.entries(data).map(
            ([id, value]) => ({
              id,
              data: value as LocationData,
            })
          );
          dispatch(setLocations(locationsList)); 
        } else {
          dispatch(setLocations([]));
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
    return rejectWithValue(
      error.message || "Failed to subscribe to locations."
    );
  }
});

export const saveLocation = createAsyncThunk<
  void,
  { locationData: Omit<LocationData, "createdAt">; id?: string },
  { rejectValue: string }
>("locations/save", async ({ locationData, id }, { rejectWithValue }) => {
  try {
    const fullData = { ...locationData, createdAt: Date.now() };
    if (id) {
      await update(ref(db, `locations/${id}`), fullData);
    } else {
      const newRef = push(ref(db, "locations"));
      await set(newRef, fullData);
    }
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to save location.");
  }
});

export const deleteLocation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("locations/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `locations/${id}`));
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete location.");
  }
});

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocations(state, action: PayloadAction<Location[]>) {
      state.items = action.payload;
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
      .addCase(saveLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save location";
      })
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (location) => location.id !== action.payload
        );
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete location";
      });
  },
});

export const {
  setLocations,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = locationsSlice.actions;
export default locationsSlice.reducer;
