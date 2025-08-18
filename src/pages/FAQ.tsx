import {
  subscribeToFaqs,
  addFaq,
  deleteFaq,
  updateFaq,
  cleanupFaqsSubscription,
} from "../redux/slices/faqSlice";
import FaqsFrom from "../components/Faqs/FaqsFrom";
import type { RootState } from "../redux/store";
import type { FaqType } from "../types/FaqType";
import { useSelector } from "react-redux";
import CrudSection from "../components/CrudSection";
import GenericCard from "../components/GenericCard/GenericCard";

function FAQ() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<FaqType>
      title="Frequently Asked Questions"
      addBtnText="+ Add FAQ"
      role={role}
      selectList={(state) => state.faqs.items}
      selectLoading={(state) => state.faqs.loading}
      subscribeAction={subscribeToFaqs}
      cleanupAction={cleanupFaqsSubscription}
      addAction={addFaq}
      updateAction={updateFaq}
      deleteAction={deleteFaq}
      FormComponent={FaqsFrom}
      renderItem={(item, { onEdit, onDelete }) => (
        <GenericCard
          key={item.id}
          title={item.question}
          description={item.answer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}
export default FAQ;