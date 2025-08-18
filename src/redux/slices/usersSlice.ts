import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";

export type User = {
  uid: string;
  email: string;
  role: string;
};

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const subscribeToUsers = createAsyncThunk(
  "users/subscribe",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      const unsubscribe = onValue(
        usersRef,
        (snapshot) => {
          const data = snapshot.val() || {};
          const userList: User[] = Object.entries(data).map(([uid, val]: [string, any]) => ({
            uid,
            email: val.email,
            role: val.role,
          }));
          dispatch(setUsers(userList));
        },
        (error) => {
          dispatch(setError(error.message || "فشل في تحميل المستخدمين"));
        }
      );

      dispatch(setUnsubscribe(() => unsubscribe));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (
    { email, password, role, uid }: { email: string; password?: string; role: string; uid?: string },
    { rejectWithValue }
  ) => {
    try {
      const auth = getAuth();
      const db = getDatabase();

      let uidToUse = uid;

      if (!uid) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password!);
        uidToUse = userCredential.user.uid;
      }

      await set(ref(db, `users/${uidToUse}`), {
        email,
        role,
      });

      return { uid: uidToUse, email, role };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (uid: string, { rejectWithValue }) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `users/${uid}`));
      return uid;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
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
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.uid !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUsers, setError, setLoading, setUnsubscribe, cleanupSubscription } = usersSlice.actions;

export default usersSlice.reducer;