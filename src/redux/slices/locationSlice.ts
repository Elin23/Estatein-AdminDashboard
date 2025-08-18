import type { Location } from "../../types";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<Location>();

const locationThunks = createGenericThunks<Location>("locations", "locations");

const locationsSlice = createGenericSlice("locations", initialState);

export const {
  setItems: setLocations,
  setLoading: setLocationsLoading,
  setError: setLocationsError,
  setUnsubscribe: setLocationsUnsubscribe,
  cleanupSubscription: cleanupLocationsSubscription,
} = locationsSlice.actions;

export const {
  subscribeToItems: subscribeToLocations,
  addItem: addLocation,
  updateItem: updateLocation,
  deleteItem: deleteLocation
} = locationThunks;

export default locationsSlice.reducer;