import { useEffect, useState } from "react";
import type { ValueItem } from "../../types/ValueItem";
import FormField from "../InputField/FormField";
import GeneralBtn from "../buttons/GeneralBtn";

interface ValueFormProps {
  onSubmit: (
    data: Pick<ValueItem, "title" | "description">,
    id?: string
  ) => Promise<void>;
  initialData?: ValueItem | null;
  onCancel: () => void;
}

function ValueForm({ onSubmit, initialData = null, onCancel }: ValueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      alert("Please fill title and description");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ title: t, description: d }, initialData?.id);
      if (!initialData) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >
      <FormField
        label="Title"
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Enter value title"
      />

      <FormField
        label="Description"
        name="description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Enter value description"
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
          btnType={initialData ? "update" : "add"}
          actionToDo={handleSubmit} 
        />
      </div>
    </form>
  );
}

export default ValueForm;
