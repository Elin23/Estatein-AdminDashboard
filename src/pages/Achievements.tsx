import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  subscribeToAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from "../redux/slices/achievementsSlice";
import AchievementForm from "../components/Achievements/AchievementForm";
import GenericCard from "../components/GenericCard/GenericCard";
import Pagination from "../components/UI/Pagination";

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

function Achievements() {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.auth.role) || "";
  const achievements = useSelector(
    (state: RootState) => state.achievements.list
  );
  const loading = useSelector((state: RootState) => state.achievements.loading);
  const error = useSelector((state: RootState) => state.achievements.error);

  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(subscribeToAchievements());
  }, [dispatch]);

  const handleAdd = async (
    newAchievement: Omit<Achievement, "id">
  ): Promise<void> => {
    await dispatch(addAchievement(newAchievement));
    setShowForm(false);
  };

  const handleUpdate = async (
    data: Omit<Achievement, "id">,
    id?: string
  ): Promise<void> => {
    if (!id) return;
    await dispatch(updateAchievement({ id, data }));
    setEditingAchievement(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAchievement(id));
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Achievements
        </h1>
        {role === "admin" && (
          <button
            className="bg-purple60 hover:bg-purple65 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            + Add Achievement
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showForm ? (
        <AchievementForm
          onSubmit={editingAchievement ? handleUpdate : handleAdd}
          initialData={editingAchievement}
          onCancel={() => {
            setEditingAchievement(null);
            setShowForm(false);
          }}
        />
      ) : (
        <Pagination
          items={achievements}
          renderItem={(achievement) => (
            <GenericCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              onEdit={() => handleEditClick(achievement)}
              onDelete={() => handleDelete(achievement.id)}
            />
          )}
          loading={loading}
        />
      )}
    </div>
  );
}

export default Achievements;
