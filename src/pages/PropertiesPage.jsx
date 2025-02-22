import React, { useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProperties,
  getAllProperties,
  selectPropertyLoading,
  selectPropertyError,
} from "../redux/property/propertySlice";

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const properties = useSelector(selectProperties);
  const loading = useSelector(selectPropertyLoading);
  const error = useSelector(selectPropertyError);

  useEffect(() => {
    dispatch(getAllProperties());
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
            onClick={() => dispatch(getAllProperties())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">Featured Properties</h2>

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

export default PropertiesPage;