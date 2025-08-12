import { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import ValueForm from "../components/Values/ValuesForm";
import type { ValueItem } from "../types/ValueItem";

import {
  listenToValues,
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
    // For modal confirmation on delete
  const [modalOpen, setModalOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role) || '';

  useEffect(() => {
    dispatch(listenToValues());
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

  const handleDelete = async (id: string) => {
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

  // const handleAddClick = () => {
  //   setEditingValue(null);
  //   setShowForm(true);
  // };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Values</h1>
        {(role === "admin") && (<button
          className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={() => setShowForm((prev) => !prev)}
          // onClick={handleAddClick}
          disabled={loading || values.length >= 4}
        >
          {showForm ? "Close Form" : "+ Add Value"}
        </button>)}
      </div>

        {error && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {error}
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

