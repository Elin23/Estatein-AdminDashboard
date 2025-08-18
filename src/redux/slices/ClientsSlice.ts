import type { ValuedClient } from "../../types/ValuedClient";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<ValuedClient>();

const clientThunks = createGenericThunks<ValuedClient>("clients", "clients");

const clientsSlice = createGenericSlice("clients", initialState);

export const {
  setItems: setClients,
  setLoading: setClientsLoading,
  setError: setClientsError,
  setUnsubscribe: setClientsUnsubscribe,
  cleanupSubscription: cleanupClientsSubscription,
} = clientsSlice.actions;

export const {
  subscribeToItems: subscribeToClients,
  addItem: addClient,
  updateItem: updateClient,
  deleteItem: deleteClient
} = clientThunks;

export default clientsSlice.reducer;