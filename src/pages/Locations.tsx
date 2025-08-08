import React, { useState } from 'react';
import LocationForm from '../components/LocationForm';
import { Location } from '../types';
import { MapPin, Trash2 } from 'lucide-react';

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddLocation = (locationData: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...locationData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setLocations([newLocation, ...locations]);
    setShowForm(false);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Locations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Location'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <LocationForm onSubmit={handleAddLocation} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.state}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Added on {location.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && !showForm && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No locations yet</h3>
          <p className="mt-1 text-gray-500">Get started by adding a new location.</p>
        </div>
      )}
    </div>
  );
};

export default Locations;