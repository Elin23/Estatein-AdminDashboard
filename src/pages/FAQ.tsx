import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import GenericCard from "../components/GenericCard/GenericCard";
import { type FaqType } from "../types";
import FaqsFrom from "../components/Faqs/FaqsFrom";
import { onValue, push, ref, remove, set, update } from "firebase/database";
import { db } from "../firebaseConfig";

function FAQ() {

  const role = useSelector((state: RootState) => state.auth.role) || '';

  const [faqs,setFaqs] = useState<Array<FaqType>>([]);

  const [loading, setLoading] = useState(true);

  const [showForm , setShowFrom] = useState<boolean>(false);

  const [editingFaq , setEditingFaq] = useState<FaqType | null > (null)


  const handleAddFaqStart = ()=>{
    setShowFrom(true);
    setEditingFaq(null);
  }
 
  const handleAddFaq = async (newFaq: Omit<FaqType, 'id'>) => {
      const newRef = push(ref(db, 'faqs'));
      await set(newRef, newFaq);
      setShowFrom(false); 
  }

  const handleEditClick = (faq: FaqType)=>{
    setEditingFaq(faq);
    setShowFrom(true);
}

  const handleEditFaq = async (data: Omit<FaqType, 'id'>, id?: string)=>{
    if (!id) return;
    await update(ref(db, `faqs/${id}`), data);
    setEditingFaq(null);
    setShowFrom(false);
  }


  const handleDeleteFaq =async (id:string)=>{
    await remove(ref(db, `faqs/${id}`));
  }

  useEffect(() => {
    const faqsRef = ref(db, 'faqs');
    const unsubscribe = onValue(faqsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<FaqType, 'id'>)
        }));
        setFaqs(list);
      } else {
        setFaqs([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
    }, []);
  return (
    <div className="p-6">
      <div className="page_header flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h1>
        {(role === "admin") && (<button
          className="bg-purple60 hover:bg-purple65  text-white px-4 py-2 rounded"
          onClick={handleAddFaqStart}
        >
          + Add Faq
        </button>)}
      </div>

      {showForm && (
        <FaqsFrom
          onSubmit={editingFaq ? handleEditFaq : handleAddFaq}
          initialData={editingFaq}
          onCancel={() => {
            setEditingFaq(null);
            setShowFrom(false);
          }}
        />
      )}

      <div className="show_faqs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4  huge:max-w-[1390px] huge:mx-auto ">
        {loading ? Array.from({ length: 6 }).map((_, idx) => (
          <GenericCard key={idx} loading />
        ))
          : faqs.map((faq) => (
            <GenericCard
              key={faq.id}
              title={faq.question}
              description={faq.answer}
              onEdit={() => handleEditClick(faq)}
              onDelete={() => handleDeleteFaq(faq.id)}
              loading={loading}
            />
          ))}
      </div>
    </div>
  )
}

export default FAQ