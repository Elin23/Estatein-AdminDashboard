import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import type { Step } from "../../pages/Steps";

interface StepsState {
  list: Step[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: StepsState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeToSteps = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("steps/subscribe", async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentUnsub = getState().steps.unsubscribe;
    if (currentUnsub) currentUnsub();

    dispatch(setLoading(true));

    const stepsRef = ref(db, "steps");
    const unsubscribe = onValue(
      stepsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list: Step[] = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<Step, "id">),
          }));
          dispatch(setSteps(list));
        } else {
          dispatch(setSteps([]));
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
});

export const addStep = createAsyncThunk<
  Step,
  Omit<Step, "id">,
  { rejectValue: string }
>("steps/add", async (newStep, { rejectWithValue }) => {
  try {
    const newRef = push(ref(db, "steps"));
    const stepWithId: Step = { id: newRef.key!, ...newStep };
    await set(newRef, newStep);
    return stepWithId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateStep = createAsyncThunk<
  void,
  { id: string; data: Omit<Step, "id"> },
  { rejectValue: string }
>("steps/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    await update(ref(db, `steps/${id}`), data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteStep = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("steps/delete", async (id, { rejectWithValue }) => {
  try {
    await remove(ref(db, `steps/${id}`));
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<Step[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUnsubscribe: (state, action: PayloadAction<() => void>) => {
      state.unsubscribe = action.payload;
    },
    cleanupSubscription: (state) => {
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
      // addStep
      .addCase(addStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStep.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add step";
      })

      // updateStep
      .addCase(updateStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStep.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.meta.arg;
        state.list = state.list.map((step) =>
          step.id === id ? { ...step, ...data } : step
        );
      })
      .addCase(updateStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update step";
      })
      .addCase(deleteStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStep.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((step) => step.id !== action.payload);
      })
      .addCase(deleteStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete step";
      });
  },
});

export const {
  setSteps,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = stepsSlice.actions;
export default stepsSlice.reducer;
