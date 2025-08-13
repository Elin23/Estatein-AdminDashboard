import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  subscribeToSteps,
  addStep,
  updateStep,
  deleteStep,
} from "../redux/slices/stepsSlice";
import StepForm from "../components/Steps/StepForm";
import GenericCard from "../components/GenericCard/GenericCard";
import Pagination from "../components/UI/Pagination";

export interface Step {
  id: string;
  stepNum: string;
  title: string;
  description: string;
}

function Steps() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: steps,
    loading,
    error,
  } = useSelector((state: RootState) => state.steps);
  const role = useSelector((state: RootState) => state.auth.role) || "";
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(subscribeToSteps());

  }, [dispatch]);

  const handleAdd = async (newStep: Omit<Step, "id">) => {
    await dispatch(addStep(newStep)).unwrap();
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<Step, "id">, id?: string) => {
    if (!id || !editingStep) return;
    await dispatch(updateStep({ id, data })).unwrap();
    setEditingStep(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteStep(id)).unwrap();
  };

  const handleEditClick = (step: Step) => {
    setEditingStep(step);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingStep(null);
    setShowForm(true);
  };
  console.log(loading)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Steps
        </h1>
        {role === "admin" && (
          <button
            className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            + Add Step
          </button>
        )}
      </div>

      {showForm && (
        <StepForm
          onSubmit={editingStep ? handleUpdate : handleAdd}
          initialData={editingStep}
          onCancel={() => {
            setEditingStep(null);
            setShowForm(false);
          }}
        />
      )}

      <Pagination
        items={steps}
        renderItem={(item) => (
          <GenericCard
            key={item.id}
            title={item.title}
            description={item.description}
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        loading={loading}
      />

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}

export default Steps;