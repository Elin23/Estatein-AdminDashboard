import { useEffect, useState, useCallback } from "react";
import ValueForm from "../components/Values/ValuesForm";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "../firebaseConfig";
import type { ValueItem } from "../types/ValueItem";
import GenericCard from "../components/GenericCard/GenericCard";

function Values() {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [editingValue, setEditingValue] = useState<ValueItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const listRef = ref(db, "values");
    const unsubscribe = onValue(
      listRef,
      (snapshot) => {
        const obj = snapshot.val() ?? {};
        const list: ValueItem[] = Object.entries(obj).map(([id, value]: [string, any]) => ({
          id,
          title: value?.title ?? "",
          description: value?.description ?? "",
        }));
        setValues(list);
        setErr(null);
        setLoading(false);
      },
      (error) => {
        setErr(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAdd = useCallback(async (payload: ValueItem) => {
    try {
      const newRef = push(ref(db, "values"));
      await set(newRef, { title: payload.title.trim(), description: payload.description.trim() });
      setShowForm(false);
      setEditingValue(null);
    } catch (e: any) {
      setErr(e.message ?? "Failed to add value");
    } finally {
    }
  }, []);

  const handleUpdate = useCallback(async (updatedValue: ValueItem) => {
    try {
      const itemRef = ref(db, `values/${updatedValue.id}`);
      await update(itemRef, {
        title: updatedValue.title.trim(),
        description: updatedValue.description.trim(),
      });
      setShowForm(false);
      setEditingValue(null);
    } catch (e: any) {
      setErr(e.message ?? "Failed to update value");
    } finally {
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const ok = confirm("Are you sure you want to delete this value?");
    if (!ok) return;
    try {
      await remove(ref(db, `values/${id}`));
    } catch (e: any) {
      setErr(e.message ?? "Failed to delete value");
    }
  }, []);

  const handleEditClick = (value: ValueItem) => {
    setEditingValue(value);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingValue(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-white">Values</h1>
        <button
          className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={handleAddClick}
          disabled={loading || values.length >= 4}
        >
          + Add Value
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {err}
        </div>
      )}

      {showForm && (
        <ValueForm
          onSubmit={editingValue ? handleUpdate : handleAdd}
          initialData={editingValue ?? undefined}
          onCancel={() => {
            setEditingValue(null);
            setShowForm(false);
          }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4  huge:max-w-[1390px] huge:mx-auto">
        {loading ? Array.from({ length: 3 }).map((_, idx) => (
          <GenericCard key={idx} loading />
        ))
          : values.map((value) => (
            <GenericCard
              key={value.id}
              title={value?.title}
              description={value?.description}
              onEdit={() => handleEditClick(value)}
              onDelete={() => handleDelete(value.id)}
              loading={loading}
            />
          ))}
      </div>
    </div>

  );
}

export default Values;

