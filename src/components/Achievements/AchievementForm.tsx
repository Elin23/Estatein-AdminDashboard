import { useEffect, useState } from 'react';
import type { Achievement } from '../../pages/Achievements';
import FormField from '../InputField/FormField';

interface AchievementFormProps {
  initialData?: Achievement | null;
  onCancel: () => void;
  onSubmit: (data: Omit<Achievement, 'id'>, id?: string) => Promise<void>;
}

export default function AchievementForm({
  initialData = null,
  onCancel,
  onSubmit
}: AchievementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return alert('Please fill title and description');
    }
    setLoading(true);
    try {
      await onSubmit(
        { title: title.trim(), description: description.trim() },
        initialData?.id
      );
      if (!initialData) {
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
      <FormField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <FormField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
      />

  

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
