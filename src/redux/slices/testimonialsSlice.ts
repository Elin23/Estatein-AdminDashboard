import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebaseConfig";

export interface Testimonial {
  id: string;
  clientImage: string;
  location: string;
  name: string;
  rate: number;
  review: string;
  show: boolean;
  subject: string;
}

interface TestimonialsState {
  list: Testimonial[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: TestimonialsState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeToTestimonials = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>(
  "testimonials/subscribe",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as any;
    const currentUnsub = state.testimonials.unsubscribe;

    if (currentUnsub) {
      currentUnsub();
    }

    try {
      dispatch(setLoading(true));
      const testimonialsRef = ref(db, "testimonials");

      const unsubscribe = onValue(
        testimonialsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const testimonialsList: Testimonial[] = Object.entries(data).map(
              ([id, value]) => ({
                id,
                ...(value as Omit<Testimonial, "id">),
              })
            );
            dispatch(setTestimonials(testimonialsList));
          } else {
            dispatch(setTestimonials([]));
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

export const toggleTestimonialShow = createAsyncThunk<
  { id: string; newValue: boolean },
  { id: string; newValue: boolean },
  { rejectValue: string }
>("testimonials/toggleShow", async ({ id, newValue }, { rejectWithValue }) => {
  try {
    await update(ref(db, `testimonials/${id}`), { show: newValue });
    return { id, newValue };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const bulkUpdateTestimonialsShow = createAsyncThunk<
  { ids: string[]; newValue: boolean },
  { ids: string[]; newValue: boolean },
  { rejectValue: string }
>("testimonials/bulkUpdate", async ({ ids, newValue }, { rejectWithValue }) => {
  try {
    const updates: Record<string, any> = {};
    ids.forEach((id) => {
      updates[`testimonials/${id}/show`] = newValue;
    });
    await update(ref(db), updates);
    return { ids, newValue };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const testimonialsSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    setTestimonials(state, action: PayloadAction<Testimonial[]>) {
      state.list = action.payload;
      state.error = null;
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
      .addCase(subscribeToTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToTestimonials.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load testimonials";
      })

      .addCase(toggleTestimonialShow.fulfilled, (state, action) => {
        const { id, newValue } = action.payload;
        state.list = state.list.map((t) =>
          t.id === id ? { ...t, show: newValue } : t
        );
      })

      .addCase(bulkUpdateTestimonialsShow.fulfilled, (state, action) => {
        const { ids, newValue } = action.payload;
        state.list = state.list.map((t) =>
          ids.includes(t.id) ? { ...t, show: newValue } : t
        );
      });
  },
});

export const {
  setTestimonials,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = testimonialsSlice.actions;

export default testimonialsSlice.reducer;
