import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, MapPin, IndianRupee, Trash2 } from "lucide-react";
import PropertyForm from "../components/PropertyForm";
import ExportButton from "../components/UI/ExportReportButton";
import Pagination from "../components/UI/Pagination";
import { exportProperties } from "../lib/exportProperties";
import type { Property, PropertyFormData } from "../types";
import type { RootState, AppDispatch } from "../redux/store";
import {
  subscribeToProperties,
  addProperty,
  deleteProperty,
  editProperty,
} from "../redux/slices/propertiesSlice";

const Properties = () => {
  const dispatch = useDispatch<AppDispatch>();

  const role = useSelector((state: RootState) => state.auth.role) || "";
  const { list: properties, loading } = useSelector(
    (state: RootState) => state.properties
  );

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [propBeingEdited, setPropertyBeingEdited] = useState<Property | null>(
    null
  );

  const locations = ["Hubli", "Dharwad", "Belgaum", "Mysore", "Bangalore"];

  const handleAddProperty = async (
    propertyData: Omit<Property, "id" | "createdAt">
  ) => {
    await dispatch(addProperty(propertyData));
    setShowForm(false);
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      await dispatch(deleteProperty(id));
    }
  };

  const startEditProperty = (property: Property) => {
    setShowForm(true);
    setPropertyBeingEdited(property);
    setEditing(true);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const saveEditedProperty = async (
    id: string,
    propertyData: PropertyFormData
  ) => {
    await dispatch(editProperty({ id, propertyData }));
    setEditing(false);
    setShowForm(false);
  };

  useEffect(() => {
    dispatch(subscribeToProperties());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 huge:max-w-[1390px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <div className="flex gap-3">
          <ExportButton
            data={properties}
            fileName={`properties_report_${new Date()
              .toISOString()
              .slice(0, 10)}.xlsx`}
            getSheetName={() => "Properties"}
            mapData={exportProperties}
            buttonLabel="Export to Excel"
            disabled={properties.length === 0}
          />
          {(role === "admin" || role === "sales") && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add New Property"}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <PropertyForm
            onSubmit={handleAddProperty}
            locations={locations}
            isloading={loading}
            editing={editing}
            setEditing={setEditing}
            propertyBeingEdited={propBeingEdited}
            onEdit={saveEditedProperty}
          />
        </div>
      )}

      {loading ? (
        <div className="w-full h-full text-4xl text-center flex justify-center bg-blue-700 p-10 text-white">
          loading...
        </div>
      ) : (
        <Pagination
          items={properties}
          loading={loading}
          renderItem={(property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden huge:max-w-[452px]"
            >
              {property.images?.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 text_container">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {property.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      property.status === "available"
                        ? "bg-green-100 text-green-800"
                        : property.status === "sold"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {property.status.charAt(0).toUpperCase() +
                      property.status.slice(1)}
                  </span>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {property.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    {property.type.charAt(0).toUpperCase() +
                      property.type.slice(1)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    {property.price.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {property.description}
                  </p>
                </div>

                {property.features?.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center w-full justify-between">
                  <div className="mt-4 flex justify-end">
                    {(role === "admin" || role === "sales") && (
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    {(role === "admin" || role === "sales") && (
                      <button
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                        onClick={() => startEditProperty(property)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {properties.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No properties yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding a new property.
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
