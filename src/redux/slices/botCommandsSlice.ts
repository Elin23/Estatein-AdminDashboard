import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "../../firebaseConfig";

export type Command = {
  id: string;
  text: string;
  createdAt: number;
};

interface BotCommandsState {
  items: Command[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: BotCommandsState = {
  items: [],
  loading: false,
  error: null,
};

export const subscribeToBotCommands = createAsyncThunk(
  "botCommands/subscribe",
  async (_, { dispatch, getState }) => {
    const state = getState() as any;
    const currentUnsub = state.botCommands.unsubscribe;

    if (currentUnsub) currentUnsub();

    const commandsRef = ref(db, "admin/botCommands");

    const unsubscribe = onValue(
      commandsRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const list: Command[] = Object.entries(data)
          .map(([id, value]: [string, any]) => ({
            id,
            text: value.text ?? "",
            createdAt: value.createdAt ?? 0,
          }))
          .sort((a, b) => a.createdAt - b.createdAt);

        dispatch(setItems(list));
      },
      (error) => {
        dispatch(setError(error.message || "فشل في تحميل الأوامر"));
      }
    );

    dispatch(setUnsubscribe(() => unsubscribe));
  }
);

export const addBotCommand = createAsyncThunk(
  "botCommands/add",
  async (text: string, { rejectWithValue }) => {
    try {
      const newRef = push(ref(db, "admin/botCommands"));
      await set(newRef, { text, createdAt: Date.now() });
    } catch (err: any) {
      return rejectWithValue(err.message || "فشل في إضافة الأمر");
    }
  }
);

export const updateBotCommand = createAsyncThunk(
  "botCommands/update",
  async ({ id, text }: { id: string; text: string }, { rejectWithValue }) => {
    try {
      await update(ref(db, `admin/botCommands/${id}`), { text });
    } catch (err: any) {
      return rejectWithValue(err.message || "فشل في تعديل الأمر");
    }
  }
);

export const deleteBotCommand = createAsyncThunk(
  "botCommands/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await remove(ref(db, `admin/botCommands/${id}`));
    } catch (err: any) {
      return rejectWithValue(err.message || "فشل في حذف الأمر");
    }
  }
);

const botCommandsSlice = createSlice({
  name: "botCommands",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUnsubscribe(state, action) {
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
      .addCase(addBotCommand.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBotCommand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addBotCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBotCommand.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBotCommand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBotCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBotCommand.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBotCommand.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBotCommand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setItems,
  setError,
  setLoading,
  setUnsubscribe,
  cleanupSubscription,
} = botCommandsSlice.actions;

export default botCommandsSlice.reducer;