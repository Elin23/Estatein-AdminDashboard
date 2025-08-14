import {
  subscribeToFaqs,
  addFaq,
  editFaq,
  deleteFaq,
  cleanupSubscription,
} from "../redux/slices/faqSlice";
import FaqsFrom from "../components/Faqs/FaqsFrom";
import type { RootState } from "../redux/store";
import type { FaqType } from "../types/FaqType";
import { useSelector } from "react-redux";
import CrudSection from "../components/CrudSection";

function FAQ() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<FaqType>
      title="Frequently Asked Questions"
      addBtnText="+ Add FAQ"
      role={role}
      selectList={(state) => state.faqs.list}
      selectLoading={(state) => state.faqs.loading}
      subscribeAction={subscribeToFaqs}
      cleanupAction={cleanupSubscription}
      addAction={addFaq}
      updateAction={editFaq}
      deleteAction={deleteFaq}
      FormComponent={FaqsFrom}
      renderTitle={(item) => item.question}
      renderDescription={(item) => item.answer}
    />
  );
}
export default FAQ;