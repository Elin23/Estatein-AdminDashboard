import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { ref, onValue, push, set, remove } from "firebase/database";
import type { TeamMember } from "../../types/index";

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: TeamState = {
  members: [],
  loading: false,
  error: null,
};

export const subscribeTeam = createAsyncThunk(
  "team/subscribeTeam",
  async (_, { dispatch, getState }) => {
    const state = getState() as any;
    const currentUnsub = state.team.unsubscribe;

    if (currentUnsub) currentUnsub();

    return new Promise<void>((resolve) => {
      const teamRef = ref(db, "team");

      const unsubscribe = onValue(teamRef, (snapshot) => {
        const data = snapshot.val() || {};
        const list: TeamMember[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as any),
        }));
        dispatch(setMembers(list));
        resolve();
      });
      dispatch(setUnsubscribe(() => unsubscribe));
    });
  }
);

export const addOrUpdateMember = createAsyncThunk(
  "team/addOrUpdateMember",
  async ({
    memberData,
    id,
  }: {
    memberData: Omit<TeamMember, "id">;
    id?: string;
  }) => {
    if (id) {
      await set(ref(db, `team/${id}`), memberData);
    } else {
      const newRef = push(ref(db, "team"));
      await set(newRef, memberData);
    }
  }
);

export const deleteMember = createAsyncThunk(
  "team/deleteMember",
  async (id: string) => {
    await remove(ref(db, `team/${id}`));
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<TeamMember[]>) {
      state.members = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
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
      .addCase(subscribeTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load team";
      });
  },
});

export const {
  setMembers,
  setLoading,
  setError,
  setUnsubscribe,
  cleanupSubscription,
} = teamSlice.actions;

export default teamSlice.reducer;
