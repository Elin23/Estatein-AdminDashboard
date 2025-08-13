import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import ValueForm from "../components/Values/ValuesForm";
import type { ValueItem } from "../types/ValueItem";
import {
  subscribeToValues,
  addValue,
  updateValue,
  deleteValue,
} from "../redux/slices/valuesSlice";
import Pagination from "../components/UI/Pagination";
import Modal from "../components/UI/Modal";
import GenericCard from "../components/GenericCard/GenericCard";

function Values() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: values,
    loading,
    error,
  } = useSelector((state: RootState) => state.values);

  const [editingValue, setEditingValue] = useState<ValueItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role) || "";

  useEffect(() => {
    dispatch(subscribeToValues());
  }, [dispatch]);

  const handleAdd = async (payload: Omit<ValueItem, "id">) => {
    await dispatch(addValue(payload));
    setShowForm(false);
    setEditingValue(null);
  };

  const handleUpdate = async (payload: ValueItem) => {
    await dispatch(updateValue(payload));
    setShowForm(false);
    setEditingValue(null);
  };

  const handleDelete = (id: string) => {
    setValueToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (valueToDelete) {
      await dispatch(deleteValue(valueToDelete));
      setValueToDelete(null);
      setModalOpen(false);
    }
  };

  const handleEditClick = (value: ValueItem) => {
    setEditingValue(value);
    setShowForm(true);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Values
        </h1>
        {role === "admin" && (
          <button
            className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={() => setShowForm((prev) => !prev)}
            disabled={loading || values.length >= 4}
          >
            {showForm ? "Close Form" : "+ Add Value"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {error}
        </div>
      )}
 
      {showForm ? (
        <ValueForm
          onSubmit={editingValue ? handleUpdate : handleAdd}
          initialData={editingValue ?? undefined}
          onCancel={() => {
            setEditingValue(null);
            setShowForm(false);
          }}
        />
      ) :  
       (
        <Pagination
          items={values}
          renderItem={(value: ValueItem) => (
            <GenericCard
              key={value.id}
              title={value?.title}
              description={value?.description}
              onEdit={() => handleEditClick(value)}
              onDelete={() => handleDelete(value.id)}
              />
            )}
            loading={loading}
        />
      )}
      

      <Modal
        isOpen={modalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this value?"
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        showConfirm
      />
    </div>
  );
}

export default Values;
