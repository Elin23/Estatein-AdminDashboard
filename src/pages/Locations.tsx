import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { push, ref, set, onValue, remove, update } from "firebase/database";
import LocationForm from "../components/LocationForm";
import LocationCard from "../components/Cards/LocationCard";

interface LocationData {
  branch: string;
  address: string;
  details: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  createdAt: number;
}

const Locations = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [locations, setLocations] = useState<
    { id: string; data: LocationData }[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch data with error handling
  useEffect(() => {
    const locationsRef = ref(db, "locations");
    const unsubscribe = onValue(
      locationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formatted = Object.entries(data).map(([id, value]) => ({
            id,
            data: value as LocationData,
          }));
          setLocations(formatted);
          setFetchError(null);
        } else {
          setLocations([]);
          setFetchError(null);
        }
      },
      (error) => {
        console.error("Fetch error:", error);
        setFetchError("Failed to load locations. Please try again.");
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (
    propertyData: Omit<LocationData, "createdAt">
  ) => {
    setLoading(true);
    setMessage("");

    const fullData: LocationData = {
      ...propertyData,
      createdAt: Date.now(),
    };

    try {
      if (editId) {
        await update(ref(db, `locations/${editId}`), fullData);
        setMessage("✅ Location updated successfully!");
      } else {
        const newRef = push(ref(db, "locations"));
        await set(newRef, fullData);
        setMessage("✅ Location added successfully!");
      }
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      try {
        await remove(ref(db, `locations/${id}`));
        setMessage("✅ Location deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        setMessage("❌ Failed to delete location.");
      }
    }
  };

  const handleEdit = (loc: { id: string; data: LocationData }) => {
    setEditId(loc.id);
    setShowForm(true);
    setMessage(""); // Clear any previous message
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
          Locations
        </h1>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) {
              setEditId(null);
            }
            setMessage(""); // Clear message on toggle
          }}
          className="bg-[#703BF7] text-white px-4 py-2 rounded-lg hover:bg-[#5b2fc4]"
        >
          {showForm ? "Close Form" : "+ Add Location"}
        </button>
      </div>

      {/* Error from fetch */}
      {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

      {/* FORM */}
      {showForm && (
        <>
          <LocationForm
            initialData={
              editId
                ? locations.find((loc) => loc.id === editId)?.data
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditId(null);
              setMessage("");
            }}
            loading={loading}
          />
          {message && <p className="text-sm mt-2 text-center">{message}</p>}
        </>
      )}

      {/* DISPLAY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(({ id, data }) => (
          <LocationCard
            key={id}
            data={data}
            onEdit={() => handleEdit({ id, data })}
            onDelete={() => handleDelete(id)}
          />
        ))}
        {locations.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No locations available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Locations;
