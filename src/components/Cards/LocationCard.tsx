import type { LocationData } from "../../types/forms";
interface LocationCardProps {
  data: LocationData;
  onEdit: () => void;
  onDelete: () => void;
}
function LocationCard({ data, onEdit, onDelete }: LocationCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-[#703BF7]">{data.branch}</h3>
      <p className="text-gray-600">{data.address}</p>
      <p className="text-sm text-gray-500">{data.city}</p>
      <span className="inline-block mt-2 px-2 py-1 bg-[#703BF7]/20 text-[#703BF7] text-xs rounded">
        {data.category}
      </span>
      <p className="mt-2 text-sm">{data.details}</p>
      <div className="mt-3 border-t pt-2 text-sm">
        <p>📧 {data.email}</p>
        <p>📞 {data.phone}</p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default LocationCard;
