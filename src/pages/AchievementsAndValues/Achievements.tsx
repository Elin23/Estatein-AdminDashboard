import type { RootState } from "../../redux/store";
import type { Achievement } from "../../types/Achievement"; 
import AchievementForm from "../../components/Achievements/AchievementForm";
import {
  subscribeToAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../redux/slices/achievementsSlice";
import { useSelector } from "react-redux";
import CrudSection from "../../components/CrudSection";
import GenericCard from "../../components/GenericCard/GenericCard";

function Achievements() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<Achievement>
      title="Achievements"
      addBtnText="+ Add Achievement"
      role={role}
      selectList={(state) => state.achievements.list}
      selectLoading={(state) => state.achievements.loading}
      selectError={(state) => state.achievements.error}
      subscribeAction={subscribeToAchievements}
      addAction={addAchievement}
      updateAction={updateAchievement}
      deleteAction={deleteAchievement}
      FormComponent={AchievementForm}
      renderItem={(item, { onEdit, onDelete }) => (
        <GenericCard
          key={item.id}
          title={item.title}
          description={item.description}
          onEdit={onEdit}
          onDelete={onDelete}
        />
    )}
    />
  );
}
export default Achievements;