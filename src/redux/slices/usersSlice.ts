import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, onValue, set, update, remove } from "firebase/database";
import { db } from "../../firebaseConfig";
import type { User } from "../../types";

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
  unsubscribe?: () => void;
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

// Subscribe to users
export const subscribeToUsers = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("users/subscribe", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const state = getState();
    const currentUnsub = state.users.unsubscribe;
    if (currentUnsub) currentUnsub();

    dispatch(setUsersLoading(true));

    const usersRef = ref(db, "users");
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersList: User[] = Object.entries(data).map(
            ([id, value]: [string, any]) => ({
              id,
              ...(value as Omit<User, "id">),
            })
          );
          dispatch(setUsers(usersList));
        } else {
          dispatch(setUsers([]));
        }
        dispatch(setUsersLoading(false));
      },
      (error) => {
        dispatch(setUsersError(error.message));
        dispatch(setUsersLoading(false));
      }
    );

    dispatch(setUnsubscribe(() => unsubscribe));
  } catch (error: any) {
    dispatch(setUsersLoading(false));
    return rejectWithValue(error.message);
  }
});

// Create user (both Firebase Auth and database)
export const createUser = createAsyncThunk<
  { success: boolean; message: string },
  { email: string; password: string; role: string },
  { rejectValue: string }
>("users/create", async ({ email, password, role }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(setUsersLoading(true));
    
    const auth = getAuth();
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Add user to database
    const userData: Omit<User, "id"> = {
      email,
      role: role as User["role"],
      createdAt: Date.now(),
    };
    
    await set(ref(db, `users/${uid}`), userData);
    
    return { success: true, message: "User created successfully!" };
  } catch (error: any) {
    const errorMessage = error.code === 'auth/email-already-in-use' 
      ? 'Email already exists'
      : error.message || "Failed to create user";
    return rejectWithValue(errorMessage);
  } finally {
    dispatch(setUsersLoading(false));
  }
});

// Update user role
export const updateUserRole = createAsyncThunk<
  { success: boolean; message: string },
  { uid: string; role: string },
  { rejectValue: string }
>("users/updateRole", async ({ uid, role }, { rejectWithValue }) => {
  try {
    await update(ref(db, `users/${uid}`), { role: role as User["role"] });
    return { success: true, message: "User updated successfully!" };
  } catch (error: any) {
    const errorMessage = error.message || "Failed to update user";
    return rejectWithValue(errorMessage);
  }
});

// Delete user
export const deleteUserAccount = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>("users/delete", async (uid, { rejectWithValue }) => {
  try {
    await remove(ref(db, `users/${uid}`));
    return { success: true, message: "User deleted successfully!" };
  } catch (error: any) {
    const errorMessage = error.message || "Failed to delete user";
    return rejectWithValue(errorMessage);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.items = action.payload;
      state.error = null;
    },
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUsersError(state, action: PayloadAction<string | null>) {
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
      // Create user
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create user";
      })
      // Update user role
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update user";
      })
      // Delete user
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete user";
      });
  },
});

export const {
  setUsers,
  setUsersLoading,
  setUsersError,
  setUnsubscribe,
  cleanupSubscription,
} = usersSlice.actions;

export default usersSlice.reducer;