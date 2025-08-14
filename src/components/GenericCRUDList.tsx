import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import Pagination from "../components/UI/Pagination";
import Modal from "../components/UI/Modal";
import GenericCard from "../components/GenericCard/GenericCard";

interface CRUDListProps<T> {
  title: string;
  role: string;
  form: React.ComponentType<{
    onSubmit: (data: any, id?: string) => void;
    initialData?: T | null;
    onCancel: () => void;
  }>;
  selectState: (state: RootState) => {
    items: T[];
    loading: boolean;
    error: string | null;
  };
  subscribe: () => any;
  addItem: (payload: Omit<T, "id">) => any;
  updateItem: (payload: T) => any;
  deleteItem: (id: string) => any;
}


function GenericCRUDList<T extends { id: string }>({
  title,
  role,
  form: FormComponent,
  selectState,
  subscribe,
  addItem,
  updateItem,
  deleteItem,
}: CRUDListProps<T>) {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector(selectState);

    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
      dispatch(subscribe());
    }, [dispatch, subscribe]);

    const handleAdd = async (payload: Omit<T, "id">) => {
      await dispatch(addItem(payload));
      setShowForm(false);
      setEditingItem(null);
    };

    const handleUpdate = async (payload: T) => {
      await dispatch(updateItem(payload));
      setShowForm(false);
      setEditingItem(null);
    };

    const handleDelete = (id: string) => {
      setItemToDelete(id);
      setModalOpen(true);
    };

    const confirmDelete = async () => {
      if (itemToDelete) {
        await dispatch(deleteItem(itemToDelete));
        setItemToDelete(null);
        setModalOpen(false);
      }
    };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {title}
        </h1>
        {role === "admin" && (
          <button
            className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded"
            onClick={() => setShowForm((prev) => !prev)}
            disabled={loading}
          >
            {showForm ? "Close Form" : `+ Add ${title.slice(0, -1)}`}
          </button>
        )}
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {showForm ? (
        <FormComponent
          onSubmit={editingItem ? handleUpdate : handleAdd}
          initialData={editingItem}
          onCancel={() => {
            setEditingItem(null);
            setShowForm(false);
          }}
        />
      ) : (
        <Pagination
          items={items}
          renderItem={(item) => (
            <GenericCard
              key={item.id}
              title={(item as any).title}
              description={(item as any).description}
              onEdit={() => {
                setEditingItem(item);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          loading={loading}
        />
      )}

      <Modal
        isOpen={modalOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${title.slice(0, -1)}?`}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        showConfirm
      />
    </div>
  );
}

export default GenericCRUDList;
