import { useEffect, useRef, useState } from 'react';
import type { Step } from '../../pages/Steps';
import GeneralBtn from '../buttons/GeneralBtn';
import CancleBtn from '../buttons/CancleBtn';

interface StepFormProps {
  initialData?: Step | null;
  onCancel: () => void;
  onSubmit: (data: Omit<Step, 'id'>, id?: string) => Promise<void>;
}

export default function StepForm({
  initialData = null,
  onCancel,
  onSubmit
}: StepFormProps) {
  const [stepNum, setStepNum] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const fromRef = useRef<HTMLFormElement>(null)
 
  useEffect(() => {
    if (initialData) {
      setStepNum(initialData.stepNum);
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setStepNum('');
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepNum.trim() || !title.trim() || !description.trim()) {
      return alert('Please fill all fields');
    }
    setLoading(true);
    try {
      await onSubmit(
        { stepNum: stepNum.trim(), title: title.trim(), description: description.trim() },
        initialData?.id
      );
      if (!initialData) {
        setStepNum('');
        setTitle('');
        setDescription('');
      }
    } catch {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
      ref={fromRef}
    >

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Step Num
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-black dark:border-white rounded  text-black dark:text-white bg-transparent"
          value={stepNum}
          onChange={(e) => setStepNum(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-black dark:border-white rounded  text-black dark:text-white bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-black dark:border-white rounded  text-black dark:text-white bg-transparent"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <CancleBtn onCLick={onCancel} />
        <GeneralBtn
        btnContent={initialData ? 'Update' : 'Add'}
        disabled={loading}
        actionToDo={()=>fromRef.current?.requestSubmit}
        btnType={initialData ? 'update' : 'add'}
        />

      </div>
    </form>
  );
}
