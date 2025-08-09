// hooks/useLocations.ts
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { push, ref, set, onValue, remove, update } from "firebase/database";

export interface LocationData {
  branch: string;
  address: string;
  details: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  createdAt: number;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<
    { id: string; data: LocationData }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch
  useEffect(() => {
    const locationsRef = ref(db, "locations");
    const unsubscribe = onValue(
      locationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setLocations(
            Object.entries(data).map(([id, value]) => ({
              id,
              data: value as LocationData,
            }))
          );
          setError(null);
        } else {
          setLocations([]);
          setError(null);
        }
      },
      (err) => {
        setError("Failed to load locations.");
        console.error(err);
      }
    );
    return () => unsubscribe();
  }, []);

  // add/update
  const saveLocation = async (
    locationData: Omit<LocationData, "createdAt">,
    id?: string
  ) => {
    setLoading(true);
    try {
      const fullData = { ...locationData, createdAt: Date.now() };
      if (id) {
        await update(ref(db, `locations/${id}`), fullData);
      } else {
        const newRef = push(ref(db, "locations"));
        await set(newRef, fullData);
      }
    } finally {
      setLoading(false);
    }
  };

  // delete
  const deleteLocation = async (id: string) => {
    await remove(ref(db, `locations/${id}`));
  };

  return { locations, loading, error, saveLocation, deleteLocation };
};
