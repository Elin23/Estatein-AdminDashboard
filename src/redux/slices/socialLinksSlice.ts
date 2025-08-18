// src/redux/slices/socialLinksSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import type { SocialLink } from "../../types";


interface SocialLinksState {
  list: SocialLink[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: SocialLinksState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeToSocialLinks = createAsyncThunk(
  "socialLinks/subscribe",
  async (_, { dispatch, getState }) => {
    const state = getState() as any;
    const currentUnsub = state.socialLinks.unsubscribe;

    if (currentUnsub) currentUnsub();

    return new Promise<void>((resolve) => {
      const linksRef = ref(db, "socialLinks");
      const unsubscribe = onValue(linksRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          dispatch(setSocialLinks([]));
          return;
        }
        const list: SocialLink[] = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        dispatch(setSocialLinks(list));
        resolve();
      });

      dispatch(setUnsubscribe(() => unsubscribe));
    });
  }
);

export const saveSocialLink = createAsyncThunk(
  "socialLinks/save",
  async ({ data, id }: { data: Omit<SocialLink, "id">; id?: string }) => {
    if (id) {
      await set(ref(db, `socialLinks/${id}`), data);
    } else {
      await set(push(ref(db, "socialLinks")), data);
    }
  }
);

export const deleteSocialLink = createAsyncThunk(
  "socialLinks/delete",
  async (id: string) => {
    await remove(ref(db, `socialLinks/${id}`));
  }
);

const socialLinksSlice = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {
    setSocialLinks(state, action: PayloadAction<SocialLink[]>) {
      state.list = action.payload;
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
      .addCase(subscribeToSocialLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeToSocialLinks.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading links";
      });
  },
});

export const { setSocialLinks, setUnsubscribe, cleanupSubscription } =
  socialLinksSlice.actions;
export default socialLinksSlice.reducer;
