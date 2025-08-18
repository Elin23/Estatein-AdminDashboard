import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { Achievement } from "../../types/Achievement";


interface AchievementsState {
  list: Achievement[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: AchievementsState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeToAchievements = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>(
  "achievements/subscribe",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const currentUnsub = state.achievements.unsubscribe;
      if (currentUnsub)
         currentUnsub();

      dispatch(setLoading(true));

      const achievementsRef = ref(db, "achievements");
      const unsubscribe = onValue(
        achievementsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const achievementsList: Achievement[] = Object.entries(data).map(
              ([id, value]) => ({
                id,
                ...(value as Omit<Achievement, "id">),
              })
            );
            dispatch(setAchievements(achievementsList));
          } else {
            dispatch(setAchievements([]));
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
  }
);

export const addAchievement = createAsyncThunk<
  Achievement,
  Omit<Achievement, "id">,
  { rejectValue: string }
>("achievements/add", async (newAchievement, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "achievements"));
    const achievementWithId: Achievement = {
      id: newRef.key!,
      ...newAchievement,
    };
    await set(newRef, newAchievement);
    return achievementWithId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateAchievement = createAsyncThunk<
  { id: string; data: Omit<Achievement, "id"> },
  { id: string; data: Omit<Achievement, "id"> },
  { rejectValue: string }
>("achievements/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    await update(ref(db, `achievements/${id}`), data);
    return { id, data };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});


export const deleteAchievement = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("achievements/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `achievements/${id}`));
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    setAchievements(state, action: PayloadAction<Achievement[]>) {
      state.list = action.payload;
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
      .addCase(addAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAchievement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add achievement";
      })
      .addCase(updateAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAchievement.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        state.list = state.list.map((ach) =>
          ach.id === id ? { ...ach, ...data } : ach
        );
      })
      .addCase(updateAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update achievement";
      })
      .addCase(deleteAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((ach) => ach.id !== action.payload);
      })
      .addCase(deleteAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete achievement";
      });
  },
});

export const {
  setAchievements,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = achievementsSlice.actions;
export default achievementsSlice.reducer;
