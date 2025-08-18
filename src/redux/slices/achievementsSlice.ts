import type { Achievement } from "../../types/Achievement";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<Achievement>();

const achievementThunks = createGenericThunks<Achievement>("achievements", "achievements");

const achievementsSlice = createGenericSlice("achievements", initialState);

export const {
  setItems: setAchievements,
  setLoading: setAchievementsLoading,
  setError: setAchievementsError,
  setUnsubscribe: setAchievementsUnsubscribe,
  cleanupSubscription: cleanupAchievementsSubscription,
} = achievementsSlice.actions;

export const {
  subscribeToItems: subscribeToAchievements,
  addItem: addAchievement,
  updateItem: updateAchievement,
  deleteItem: deleteAchievement
} = achievementThunks;

export default achievementsSlice.reducer;