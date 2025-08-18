import type { FaqType } from "../../types/FaqType";
import { createGenericSlice, createGenericThunks, createInitialState } from "./createGenericSlice";

const initialState = createInitialState<FaqType>();

const faqThunks = createGenericThunks<FaqType>("faqs", "faqs");

const faqsSlice = createGenericSlice("faqs", initialState);

export const {
  setItems: setFaqs,
  setLoading: setFaqsLoading,
  setError: setFaqsError,
  setUnsubscribe: setFaqsUnsubscribe,
  cleanupSubscription: cleanupFaqsSubscription,
} = faqsSlice.actions;

export const {
  subscribeToItems: subscribeToFaqs,
  addItem: addFaq,
  updateItem: updateFaq,
  deleteItem: deleteFaq
} = faqThunks;

export default faqsSlice.reducer;