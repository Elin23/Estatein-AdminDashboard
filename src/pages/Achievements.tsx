import { useState, useEffect } from 'react';
import AchievementForm from '../components/Achievements/AchievementForm';
import { db } from '../firebaseConfig';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import GenericCard from '../components/GenericCard/GenericCard';

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const achievementsRef = ref(db, 'achievements');
    const unsubscribe = onValue(achievementsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Achievement, 'id'>)
        }));
        setAchievements(list);
      } else {
        setAchievements([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (newAchievement: Omit<Achievement, 'id'>) => {
    const newRef = push(ref(db, 'achievements'));
    await set(newRef, newAchievement);
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<Achievement, 'id'>, id?: string) => {
    if (!id) return;
    await update(ref(db, `achievements/${id}`), data);
    setEditingAchievement(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await remove(ref(db, `achievements/${id}`));
  };

  const handleEditClick = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingAchievement(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <button
          className="bg-purple60 hover:bg-purple65  text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          + Add Achievement
        </button>
      </div>

      {showForm && (
        <AchievementForm
          onSubmit={editingAchievement ? handleUpdate : handleAdd}
          initialData={editingAchievement}
          onCancel={() => {
            setEditingAchievement(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4  huge:max-w-[1390px] huge:mx-auto   ">
        {loading ? Array.from({ length: 3 }).map((_, idx) => (
          <GenericCard key={idx} loading />
        ))
          : achievements.map((achievement) => (
            <GenericCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              onEdit={() => handleEditClick(achievement)}
              onDelete={() => handleDelete(achievement.id)}
              loading={loading}
            />
          ))}
      </div>
    </div>
  );
}

export default Achievements;
