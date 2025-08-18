import { Building2, IndianRupee, MapPin } from "lucide-react";
import type { Property } from "../../types";
import GeneralBtn from "../buttons/GeneralBtn";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { memo } from "react";

type Props = {
  property: Property;
  startEditProperty: (property: Property) => void;
  handleDeleteProperty: (id: string) => void;
};

function PropertiesCard({
  property,
  handleDeleteProperty,
  startEditProperty,
}: Props) {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  if (!property) return null;

  const statusRaw = property.status ?? "available";
  const typeRaw = property.type ?? "property";
  const locationRaw = property.location ?? "";

  const statusLabel =
    statusRaw ? statusRaw.slice(0, 1).toUpperCase() + statusRaw.slice(1) : "Unknown";

  const typeLabel =
    typeRaw ? typeRaw.slice(0, 1).toUpperCase() + typeRaw.slice(1) : "";

  const statusColor =
    statusRaw === "available"
      ? "bg-green-500"
      : statusRaw === "sold"
      ? "bg-red-500"
      : "bg-yellow-500";

  const priceNum =
    typeof property.price === "number"
      ? property.price
      : Number(property.price ?? 0);

  const cover = property.images?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative">
        {cover && (
          <img
            src={cover}
            alt={property.title ?? "Property"}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium text-white ${statusColor}`}
          >
            {statusLabel || "Unknown"}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-3 justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
              {property.title ?? "Untitled"}
            </h3>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-800 dark:text-white mb-1">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{locationRaw || "—"}</span>
            </div>

            <div className="flex items-center text-gray-800 dark:text-white mb-1">
              <Building2 className="w-4 h-4 mr-2" />
              <span>{typeLabel || "—"}</span>
            </div>

            <div className="flex items-center text-gray-800 dark:text-white mb-1">
              <IndianRupee className="w-4 h-4 mr-2" />
              {Number.isFinite(priceNum) ? priceNum.toLocaleString("en-IN") : "—"}
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-800 dark:text-white line-clamp-2">
              {property.description ?? ""}
            </p>
          </div>

          {property.features?.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {property.features.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-gray-800 dark:text-white text-xs rounded-full truncate max-w-[100px]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {(role === "admin" || role === "sales") && (
          <div className="mt-1 pt-4 flex gap-2 justify-end">
            <GeneralBtn
              btnContent="Edit"
              actionToDo={() => startEditProperty(property)}
              btnType="update"
            />
            <GeneralBtn
              btnContent="Delete"
              actionToDo={() => handleDeleteProperty(property.id)}
              btnType="delete"
              targetLabel="property"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(PropertiesCard);
