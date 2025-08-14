import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  subscribeToLocations,
  saveLocation,
  deleteLocation,
} from "../../redux/slices/locationSlice";

import Pagination from "../../components/UI/Pagination";
import LocationForm from "../../components/Location/LocationForm";
import LocationCard from "../../components/Location/LocationCard";
import Modal from "../../components/UI/Modal";
import ExportButton from "../../components/UI/ExportReportButton";
import { exportLocationsToExcel } from "../../lib/exportLocations";

function Locations() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  const dispatch = useDispatch<AppDispatch>();

  const {
    items: locations,
    loading,
    error,
  } = useSelector((state: RootState) => state.locations);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(subscribeToLocations());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  return (
    <div className="p-6 huge:max-w-[1390px] huge:mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
          Our Locations
        </h1>

        <div className="flex gap-3">
          {locations.length > 0 && (
            <ExportButton
              data={locations}
              onExport={exportLocationsToExcel}
              buttonLabel="Export to Excel"
              disabled={locations.length === 0}
            />
          )}

          {role === "admin" && (
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-purple60 text-white px-4 py-2 rounded-lg hover:bg-[#5b2fc4]"
            >
              {showForm ? "Close Form" : "+ Add Location"}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showForm?  (
        <LocationForm
          initialData={
            editId ? locations.find((l) => l.id === editId)?.data : undefined
          }
          onSubmit={async (data) => {
            await dispatch(
              saveLocation({ locationData: data, id: editId || undefined })
            );
            setShowForm(false);
            setEditId(null);
          }}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      ): 

      (
        <Pagination
          items={locations}
          renderItem={({ id, data }) => (
            <LocationCard
              key={id}
              data={data}
              onEdit={() => handleEdit(id)}
              onDelete={() => {
                setLocationToDelete(id);
                setModalOpen(true);
              }}
            />
          )}
          loading={loading}
        />
      )}

      <Modal
        isOpen={modalOpen}
        title="Confirm Delete"
        message="Are you sure?"
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (locationToDelete) dispatch(deleteLocation(locationToDelete));
          setModalOpen(false);
        }}
        showConfirm
      />
    </div>
  );
}

export default Locations;
