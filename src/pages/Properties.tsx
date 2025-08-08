import React, { useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import { Property } from '../types';
import { Building2, MapPin, IndianRupee, Trash2 } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Mock locations data
  const locations = ['Hubli', 'Dharwad', 'Belgaum', 'Mysore', 'Bangalore'];

  const handleAddProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProperties([newProperty, ...properties]);
    setShowForm(false);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Property'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <PropertyForm onSubmit={handleAddProperty} locations={locations} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {property.images.length > 0 && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' :
                  property.status === 'sold' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                </div>
                <div className="flex items-center text-gray-600">
                  <IndianRupee className="w-4 h-4 mr-2" />
                  {property.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
              </div>

              {property.features.length > 0 && (
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

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
          <p className="mt-1 text-gray-500">Get started by adding a new property.</p>
        </div>
      )}
    </div>
  );
};

export default Properties;