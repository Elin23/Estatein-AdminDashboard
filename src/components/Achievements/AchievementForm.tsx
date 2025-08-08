
import { useEffect, useState } from 'react';
import { Achievement } from '../../pages/Achievements';


interface AchievementFormProps {
  onSubmit: (achievement: Achievement) => void;
  initialData?: Achievement | null;
  onCancel: () => void;
}

function AchievementForm({ onSubmit, initialData = null, onCancel }: AchievementFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Achievement = {
      id: initialData?.id || Date.now(),
      title,
      description,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-white">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-white rounded text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-white">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-white rounded text-white"
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
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple60 text-white rounded hover:bg-purple70"
        >
          {initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}

export default AchievementForm;
