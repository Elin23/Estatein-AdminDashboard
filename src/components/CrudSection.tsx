import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./UI/Pagination";
import type { RootState, AppDispatch } from "../redux/store";
import ExportButton from "./UI/ExportReportButton";

type CrudSectionProps<T> = {
  title: string;
  addBtnText: string;
  role: string;
  selectList: (state: RootState) => T[];
  selectLoading: (state: RootState) => boolean;
  selectError?: (state: RootState) => string | null;
  subscribeAction: () => any;
  cleanupAction?: () => any;
  exportReport?: (list: T[]) => void;
  addAction: (item: Omit<T, "id">) => any;
  updateAction: (payload: { id: string; data: Omit<T, "id"> }) => any;
  deleteAction: (id: string) => any;
  FormComponent: React.ComponentType<{
    onSubmit: (data: Omit<T, "id">, id?: string) => Promise<void>;
    initialData?: T | null;
    onCancel: () => void;
  }>;
  renderItem: (item: T, helpers: {
    onEdit: () => void;
    onDelete: () => void;
  }) => React.ReactNode;
};

function CrudSection<T extends { id: string }>({
  title,
  addBtnText,
  role,
  selectList,
  selectLoading,
  selectError,
  subscribeAction,
  cleanupAction,
  exportReport,
  addAction,
  updateAction,
  deleteAction,
  FormComponent,
  renderItem,
}: CrudSectionProps<T>) {
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector(selectList);
  const loading = useSelector(selectLoading);
  const error = selectError ? useSelector(selectError) : null;

  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(subscribeAction());
    return () => {
      if (cleanupAction) dispatch(cleanupAction());
    };
  }, [dispatch, subscribeAction, cleanupAction]);

  const handleAdd = async (item: Omit<T, "id">) => {
    await dispatch(addAction(item));
    setShowForm(false);
    setEditingItem(null);
  };

  const handleUpdate = async (data: Omit<T, "id">, id?: string) => {
    if (!id) return;
    await dispatch(updateAction({ id, data }));
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAction(id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1430px] mx-auto">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {title}
        </h1>
        {role === "admin" && (
          <div className="flex flex-col lg-custom:flex-row lg-custom:items-center gap-3">
            {exportReport && <ExportButton
              data={list}
              onExport={exportReport}
              buttonLabel="Export to Excel"
              disabled={list.length === 0}
            />}

            {role === "admin" && (
              <button
                className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors
              ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-gray-900
              disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setEditingItem(null);
                }}
              >
                {showForm ? "Close" : addBtnText}
              </button>
            )}
          </div>

        )}
      </div>

      {error && <div className="text-red-500">{error}</div>}

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
          items={list}
          renderItem={(item) =>
            renderItem(item, {
              onEdit: () => {
                setEditingItem(item);
                setShowForm(true);
              },
              onDelete: () => handleDelete(item.id),
            })
          }
          loading={loading}
        />
      )}
    </div>
  );
}

export default CrudSection;