import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useSelector, useDispatch } from "react-redux";
import { createProperty } from "../redux/property/propertySlice";
import {

  getUserProperties,
  selectUserProperties,
  selectLoginError,
  selectLoginStatus,
} from "../redux/auth/authSlice";
import CreatePropertyModal from "../components/CreatePropertyModal";

const HostPropertiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const properties = useSelector(selectUserProperties);
  const loading = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);

  useEffect(() => {
    dispatch(getUserProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading properties: {error}</p>
          <button
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-4 rounded"
            onClick={() => dispatch(getUserProperties())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Properties</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Property
        </button>
      </div>
    
      <CreatePropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            await dispatch(createProperty(formData));
            setIsModalOpen(false);
          } catch (error) {
            console.error("Error creating property:", error);
          }
        }}
      />
      {properties.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No properties available at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HostPropertiesPage;
