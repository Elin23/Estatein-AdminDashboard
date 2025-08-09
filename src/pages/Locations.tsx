import Pagination from "../components/UI/Pagination";
import LocationForm from "../components/Location/LocationForm";
import LocationCard from "../components/Location/LocationCard";
import Modal from "../components/UI/Modal";
import { useLocations } from "../hooks/useLocations";
import { usePagination } from "../hooks/usePagination";
import { useState } from "react";

const Locations = () => {
  const { locations, loading, error, saveLocation, deleteLocation } =
    useLocations();
  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination(locations);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);

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
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-purple60 text-white px-4 py-2 rounded-lg hover:bg-[#5b2fc4]"
        >
          {showForm ? "Close Form" : "+ Add Location"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
        <LocationForm
          initialData={
            editId ? locations.find((l) => l.id === editId)?.data : undefined
          }
          onSubmit={(data) => saveLocation(data, editId || undefined)}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}

      {!showForm && (
        <>
          <div className="grid grid-cols-3 gap-6">
            {paginatedItems.map(({ id, data }) => (
              <LocationCard
                key={id}
                data={data}
                onEdit={() => handleEdit(id)}
                onDelete={() => {
                  setLocationToDelete(id);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <Modal
        isOpen={modalOpen}
        title="Confirm Delete"
        message="Are you sure?"
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (locationToDelete) deleteLocation(locationToDelete);
          setModalOpen(false);
        }}
        showConfirm
      />
    </div>
  );
};

export default Locations;
