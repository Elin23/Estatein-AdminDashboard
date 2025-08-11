import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import StepForm from '../components/Steps/StepForm';
import GenericCard from '../components/GenericCard/GenericCard';

export interface Step {
  id: string;
  stepNum: string;
  title: string;
  description: string;
}

function Steps() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stepsRef = ref(db, 'steps');
    const unsubscribe = onValue(stepsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Step, 'id'>)
        }));
        setSteps(list);
      } else {
        setSteps([]);
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (newStep: Omit<Step, 'id'>) => {
    const newRef = push(ref(db, 'steps'));
    await set(newRef, newStep);
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<Step, 'id'>, id?: string) => {
    if (!id) return;
    await update(ref(db, `steps/${id}`), data);
    setEditingStep(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await remove(ref(db, `steps/${id}`));
  };

  const handleEditClick = (achievement: Step) => {
    setEditingStep(achievement);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingStep(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-white">Steps</h1>
        <button
          className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          + Add Step
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 huge:max-w-[1390px] huge:mx-auto">
        {loading ? Array.from({ length: 3 }).map((_, idx) => (
          <GenericCard key={idx} loading />
        ))
          : steps.map((step) => (
              <GenericCard
                key={step.id}
                title={step.title}
                description={step.description}
                onEdit={() => handleEditClick(step)}
                onDelete={() => handleDelete(step.id)}
              />
            ))}
      </div>
    </div>
  );
}

export default Steps;
