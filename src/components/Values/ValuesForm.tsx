import { useEffect, useState } from "react";
import type { ValueItem } from "../../types/ValueItem";
import FormField from "../InputField/FormField";

interface ValueFormProps {
  onSubmit: (value: Pick<ValueItem, "title" | "description"> | ValueItem) => void;
  initialData?: ValueItem | null;
  onCancel: () => void;
}

function ValueForm({ onSubmit, initialData = null, onCancel }: ValueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (initialData?.id) {
      onSubmit({
        id: initialData.id,
        title,
        description,
      } as ValueItem);
    } else {
      onSubmit({
        title,
        description,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >
      <FormField
        label="Title"
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <FormField
        label="Description"
        name="description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />


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
          {initialData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default ValueForm;
