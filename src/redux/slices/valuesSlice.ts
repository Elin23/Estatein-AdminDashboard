import type { ValueItem } from "../../types/ValueItem";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<ValueItem>();

const valueThunks = createGenericThunks<ValueItem>("values", "values");

const valuesSlice = createGenericSlice("values", initialState);

export const {
  setItems: setValues,
  setLoading: setValuesLoading,
  setError: setValuesError,
  setUnsubscribe: setValuesUnsubscribe,
  cleanupSubscription: cleanupValuesSubscription,
} = valuesSlice.actions;

export const {
  subscribeToItems: subscribeToValues,
  addItem: addValue,
  updateItem: updateValue,
  deleteItem: deleteValue
} = valueThunks;

export default valuesSlice.reducer;