import { Building2, IndianRupee, MapPin } from "lucide-react";
import type { Property } from "../../types";
import GeneralBtn from "../buttons/GeneralBtn";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

type Props = {
    property: Property;
    startEditProperty: (property: Property) => void;
    handleDeleteProperty: (id: string) => void;
};

function PropertiesCard({ property, handleDeleteProperty, startEditProperty }: Props) {
    const role = useSelector((state: RootState) => state.auth.role) || "";

    return (
        <div
            key={property.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col"
        >
            <div className="relative">
                {property.images?.length > 0 && (
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                    />
                )}

                <div className="absolute top-2 left-2">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${property.status === "available"
                            ? "bg-green-500"
                            : property.status === "sold"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                    >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex flex-wrap gap-3 justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                            {property.title}
                        </h3>
                    </div>

                    <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-800 dark:text-white mb-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{property.location}</span>
                        </div>
                        <div className="flex items-center text-gray-800 dark:text-white mb-1">
                            <Building2 className="w-4 h-4 mr-2" />
                            <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                        </div>
                        <div className="flex items-center text-gray-800 dark:text-white mb-1">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            {property.price.toLocaleString("en-IN")}
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-gray-800 dark:text-white line-clamp-2">
                            {property.description}
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

                <div className="mt-1 pt-4 flex gap-2 justify-end">
                    {(role === 'admin' || role === 'sales') && (
                        <button
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                            onClick={() => startEditProperty(property)}
                        >
                            Edit
                        </button>
                    )}
                    {(role === 'admin' || role === 'sales') && (
                        <GeneralBtn
                            btnContent="Delete"
                            actionToDo={() => handleDeleteProperty(property.id)}
                            btnType="delete"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PropertiesCard
