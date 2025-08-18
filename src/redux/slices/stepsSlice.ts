import type { Step } from "../../types/Steps";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<Step>();

const stepThunks = createGenericThunks<Step>("steps", "steps");

const stepsSlice = createGenericSlice("steps", initialState);

export const {
  setItems: setSteps,
  setLoading: setStepsLoading,
  setError: setStepsError,
  setUnsubscribe: setStepsUnsubscribe,
  cleanupSubscription: cleanupStepsSubscription,
} = stepsSlice.actions;

export const {
  subscribeToItems: subscribeToSteps,
  addItem: addStep,
  updateItem: updateStep,
  deleteItem: deleteStep
} = stepThunks;

export default stepsSlice.reducer;