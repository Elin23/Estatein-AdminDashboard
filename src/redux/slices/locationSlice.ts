import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {  PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { push, ref, set, onValue, remove, update } from "firebase/database";

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
}

const initialState: LocationState = {
  items: [],
  loading: false,
  error: null,
};

export const listenToLocations = createAsyncThunk(
  "locations/listenToLocations",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const locationsRef = ref(db, "locations");
      onValue(
        locationsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const parsed = Object.entries(data).map(([id, value]) => ({
              id,
              data: value as LocationData,
            }));
            dispatch(setLocations(parsed));
          } else {
            dispatch(setLocations([]));
          }
        },
        (error) => {
          console.error(error);
          dispatch(setError("Failed to load locations."));
        }
      );
    } catch (err) {
      return rejectWithValue("Failed to listen to locations.");
    }
  }
);

export const saveLocation = createAsyncThunk(
  "locations/saveLocation",
  async (
    {
      locationData,
      id,
    }: { locationData: Omit<LocationData, "createdAt">; id?: string },
    { rejectWithValue }
  ) => {
    try {
      const fullData = { ...locationData, createdAt: Date.now() };
      if (id) {
        await update(ref(db, `locations/${id}`), fullData);
      } else {
        const newRef = push(ref(db, "locations"));
        await set(newRef, fullData);
      }
    } catch (err) {
      return rejectWithValue("Failed to save location.");
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id: string, { rejectWithValue }) => {
    try {
      await remove(ref(db, `locations/${id}`));
    } catch (err) {
      return rejectWithValue("Failed to delete location.");
    }
  }
);

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocations(
      state,
      action: PayloadAction<{ id: string; data: LocationData }[]>
    ) {
      state.items = action.payload;
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveLocation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setLocations, setError } = locationsSlice.actions;
export default locationsSlice.reducer;
