import type { TeamMember } from "../../types/index";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<TeamMember>();

const teamThunks = createGenericThunks<TeamMember>("team", "team");

const teamSlice = createGenericSlice("team", initialState);

export const {
  setItems: setMembers,
  setLoading: setTeamLoading,
  setError: setTeamError,
  setUnsubscribe: setTeamUnsubscribe,
  cleanupSubscription: cleanupTeamSubscription,
} = teamSlice.actions;

export const {
  subscribeToItems: subscribeToTeam,
  addItem: addMember,
  updateItem: updateMember,
  deleteItem: deleteMember
} = teamThunks;

export default teamSlice.reducer;