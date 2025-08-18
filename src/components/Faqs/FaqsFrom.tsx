import { useEffect, useState } from "react";
import type { FaqType } from "../../types/FaqType";
import GeneralBtn from "../buttons/GeneralBtn";
import FormField from "../InputField/FormField";

interface FaqsFromProps {
  initialData?: FaqType | null;
  onCancel: () => void;
  onSubmit: (data: Omit<FaqType, 'id'>, id?: string) => Promise<void>;
}

export default function FaqsFrom({ initialData = null, onCancel, onSubmit }: FaqsFromProps) {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [initialData]);

  const formSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      return alert('Please fill title and description');
    }
    setLoading(true);
    try {
      await onSubmit(
        { question: question.trim(), answer: answer.trim() },
        initialData?.id
      );
      if (!initialData) {
        setQuestion('');
        setAnswer('');
      }
    } catch {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={formSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >

      <FormField
        label="Question"
        name="question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        placeholder="Enter question"
      />

      <FormField
        label="Answer"
        name="answer"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
        placeholder="Enter answer"
      />



      <div className="flex justify-end space-x-2 mt-4">
        <GeneralBtn
          btnContent="Cancel"
          btnType="cancel"
          actionToDo={onCancel}
          disabled={loading}
        />
                <GeneralBtn
          btnContent={initialData ? "Update" : "Add"}
          btnType={initialData ? 'update' : 'add'}
          actionToDo={formSubmit}
        />
      </div>
    </form>
  );
}
