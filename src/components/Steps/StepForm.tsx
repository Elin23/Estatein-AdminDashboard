import { useEffect, useState } from 'react';
import type { Step } from '../../pages/Steps';

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
    >

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-white">
          Step Num
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-white rounded text-white bg-transparent"
          value={stepNum}
          onChange={(e) => setStepNum(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-white">
          Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-white rounded text-white bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-white">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-white rounded text-white bg-transparent"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple60 text-white rounded hover:bg-purple70 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
