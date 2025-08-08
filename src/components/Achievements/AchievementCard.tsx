import { Achievement } from "../../pages/Achievements";
interface AchievementCardProps {
  achievement: Achievement;
  onEdit: () => void;
  onDelete: () => void;
}

function AchievementCard({ achievement, onEdit, onDelete }: AchievementCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
      <p className=" dark:text-gray-300 text-white">{achievement.description}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-purple70 text-white rounded hover:bg-purple60"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AchievementCard;
