import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { onValue, ref, update, off } from "firebase/database"; 
import { db } from "../../firebaseConfig";
import type { FormSubmission } from "../../types";

export type ExtendedStatus = FormSubmission["status"] | "reviewed";

type SubmissionWithType = FormSubmission & {
  formType: "contact" | "inquiry" | "property";
  status: ExtendedStatus;
};

interface SubmissionsState {
  items: SubmissionWithType[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: SubmissionsState = {
  items: [],
  loading: false,
  error: null,
  unsubscribe: undefined,
};

export const subscribeToSubmissions = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
    dispatch: any;
    state: { submissions: SubmissionsState };
  }
>(
  "submissions/subscribe",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const currentUnsub = getState().submissions.unsubscribe;
      if (currentUnsub) {
        currentUnsub();
      }

      dispatch(setLoading(true));

      const formsRef = ref(db, "forms");

      const unsubscribe = onValue(
        formsRef,
        (snapshot) => {
          const val = snapshot.val() || {};
          const items: SubmissionWithType[] = Object.entries(val).flatMap(
            ([formType, byId]: any) => {
              if (!byId) return [];
              return Object.entries(byId).map(
                ([id, payload]: [string, any]) => {
                  const ts = payload.createdAt;
                  const dateMs = typeof ts === "number" ? ts : Date.now();

                  const formName =
                    formType === "contact"
                      ? "Contact Form"
                      : formType === "inquiry"
                      ? "Inquiry Form"
                      : "Property Form";

                  const category =
                    payload.propertyType || payload.inquiryType || "General";

                  const status: ExtendedStatus = payload.status || "pending";

                  const data: Record<string, string> = {
                    firstName: payload.firstName ?? "",
                    lastName: payload.lastName ?? "",
                    email: payload.email ?? "",
                    phone: payload.phone ?? "",
                    location: payload.location ?? "",
                    propertyType: payload.propertyType ?? "",
                    bedrooms: payload.bedrooms ?? "",
                    bathrooms: payload.bathrooms ?? "",
                    budget: payload.budget ?? "",
                    message: payload.message ?? "",
                  };

                  return {
                    id,
                    formId: id,
                    formName,
                    category,
                    submittedAt: new Date(dateMs),
                    status,
                    data,
                    formType: formType as SubmissionWithType["formType"],
                  };
                }
              );
            }
          );

          items.sort(
            (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
          );
          dispatch(setSubmissions(items));
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

export const unsubscribeFromSubmissions = createAsyncThunk<
  void,
  void,
  { state: { submissions: SubmissionsState }; dispatch: any }
>("submissions/unsubscribe", async (_, { getState, dispatch }) => {
  const unsubscribe = getState().submissions.unsubscribe;
  if (unsubscribe) {
    unsubscribe();
    dispatch(setUnsubscribe(undefined));
  }
});

export const changeSubmissionStatus = createAsyncThunk<
  void,
  { id: string; status: ExtendedStatus },
  {
    rejectValue: string;
    state: { submissions: SubmissionsState };
    dispatch: any;
  }
>(
  "submissions/changeStatus",
  async ({ id, status }, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const sub = state.submissions.items.find((s) => s.id === id);
    if (!sub) {
      return rejectWithValue("Submission not found");
    }

    // Optimistic update
    dispatch(updateSubmissionStatus({ id, status }));

    try {
      await update(ref(db, `forms/${sub.formType}/${id}`), { status });
    } catch (error: any) {
      // Revert on failure
      dispatch(updateSubmissionStatus({ id, status: sub.status }));
      return rejectWithValue(error.message || "Failed to update status");
    }
  }
);

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    setSubmissions(state, action: PayloadAction<SubmissionWithType[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateSubmissionStatus(
      state,
      action: PayloadAction<{ id: string; status: ExtendedStatus }>
    ) {
      state.items = state.items.map((sub) =>
        sub.id === action.payload.id
          ? { ...sub, status: action.payload.status }
          : sub
      );
    },
    setUnsubscribe(state, action: PayloadAction<(() => void) | undefined>) {
      state.unsubscribe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeSubmissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeSubmissionStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeSubmissionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update submission status";
      });
  },
});

export const {
  setSubmissions,
  setLoading,
  setError,
  updateSubmissionStatus,
  setUnsubscribe,
} = submissionsSlice.actions;

export default submissionsSlice.reducer;

