import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { Location } from "../../types";


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
          const locationsList: Location[] = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Location, "id">),
          }));
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


export const addLocation = createAsyncThunk<
  void,
  Omit<Location, "id">,
  { rejectValue: string }
>("locations/add", async (payload, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "locations"));
    await set(newRef, payload);
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to add location");
  }
});

export const updateLocation = createAsyncThunk<
  void,
  { id: string; data: Omit<Location, "id"> },
  { rejectValue: string }
>("locations/update", async (payload, { rejectWithValue }) => {
  try {
    await update(ref(db, `locations/${payload.id}`), {
      address: payload.data.address.trim(),
      branch: payload.data.branch.trim(),
      category: payload.data.category.trim(),
      city: payload.data.city.trim(),
      createdAt: payload.data.createdAt,
      details: payload.data.details.trim(),
      email: payload.data.email.trim(),
      phone: payload.data.phone.trim()
    });
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update team");
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
      state.loading= true;
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
      .addCase(addLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save location";
      })
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLocation.rejected, (state, action) => {
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
