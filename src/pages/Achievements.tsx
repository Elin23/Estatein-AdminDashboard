import { useState } from 'react';
import AchievementForm from '../components/Achievements/AchievementForm';
import AchievementCard from '../components/Achievements/AchievementCard';


export interface Achievement {
  id: number;
  title: string;
  description: string;
}

function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (newAchievement: Achievement) => {
    setAchievements([...achievements, newAchievement]);
    setShowForm(false);
  };

  const handleUpdate = (updatedAchievement: Achievement) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === updatedAchievement.id ? updatedAchievement : ach))
    );
    setEditingAchievement(null);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <button
          className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onEdit={() => handleEditClick(achievement)}
            onDelete={() => handleDelete(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Achievements;
