import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  listenToLocations,
  saveLocation,
  deleteLocation,
} from "../redux/slices/locationSlice";

import Pagination from "../components/UI/Pagination";
import LocationForm from "../components/Location/LocationForm";
import LocationCard from "../components/Location/LocationCard";
import Modal from "../components/UI/Modal";
import ActionButtons from "../components/UI/ActionButtons";

function Locations() {
  const role = useSelector((state: RootState) => state.auth.role) || '';

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

  // Listen to DB changes once when component mounts
  useEffect(() => {
    dispatch(listenToLocations());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
          Our Locations
        </h1>
        {(role === 'admin' || role === 'sales') && (
          <ActionButtons
            addBtnText={showForm ? 'Cancel' : 'Add Location'}
            onAddClick={() => setShowForm((prev) => !prev)}
          />
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
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
      )}

      {!showForm && (
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
};

export default Locations;
