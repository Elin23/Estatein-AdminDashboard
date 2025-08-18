import { useEffect, useState } from 'react';
import type { Achievement } from '../../types/Achievement';
import FormField from '../InputField/FormField';
import GeneralBtn from '../buttons/GeneralBtn';

interface AchievementFormProps {
  initialData?: Achievement | null;
  onCancel: () => void;
  onSubmit: (data: Omit<Achievement, "id">, id?: string) => Promise<void>;
}
function AchievementForm({
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

  const handleSubmit = async () => {
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
        placeholder="Enter achievement title"
      />
      <FormField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        placeholder="Enter achievement description"
      />



      <div className="flex justify-end space-x-2 mt-4">
        <GeneralBtn
          btnContent="Cancel"
          btnType='cancel'
          actionToDo={onCancel}
          disabled={loading}
        />
        <GeneralBtn
          btnContent={`${initialData ? 'Update' : 'Add'}`}
          btnType={initialData ? "update" : "add"}
          actionToDo={handleSubmit}
        />
      </div>
    </form>
  );
}
export default AchievementForm;