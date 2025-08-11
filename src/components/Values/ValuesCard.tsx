import { useSelector } from "react-redux";
import type { ValueItem } from "../../types/ValueItem";
import type { RootState } from "../../redux/store";

interface ValuesCardProps {
  value: ValueItem;
  onEdit: () => void;
  onDelete: () => void;
}

function ValuesCard({ value, onEdit, onDelete }: ValuesCardProps) {
  const role = useSelector((state: RootState) => state.auth.role) || '';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-bold text-black dark:text-white">{value.title}</h3>
      <p className= "text-black dark:text-white ">{value.description}</p>
      {(role === "admin") && (<div className="mt-4 flex justify-end space-x-2">
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
      </div>)}
    </div>
  );
}

export default ValuesCard;
