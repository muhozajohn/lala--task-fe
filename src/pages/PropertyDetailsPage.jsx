import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWifi, FaSwimmingPool, FaParking, FaSnowflake } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { MdBedroomParent, MdBathroom } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentProperty,
  selectPropertyLoading,
  getPropertyById,
  selectPropertyError,
} from "../redux/property/propertySlice";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const property = useSelector(selectCurrentProperty);
  const loading = useSelector(selectPropertyLoading);
  const error = useSelector(selectPropertyError);

  const dispatch = useDispatch();

  // Fetch property data if not already loaded
  useEffect(() => {
    if (id) {
      dispatch(getPropertyById(id));
    }
  }, [dispatch, id]);

  // Map amenity strings to their respective icons
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi":
        return <FaWifi className="text-blue-600" />;
      case "pool":
        return <FaSwimmingPool className="text-blue-600" />;
      case "parking":
        return <FaParking className="text-blue-600" />;
      case "airConditioning":
        return <FaSnowflake className="text-blue-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="container mt-16 mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mt-16 mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center cursor-pointer mt-4 p-2 rounded-md bg-slate-100 text-blue-600 hover:text-blue-800"
          >
            <IoMdArrowBack className="mr-2" />
            Return to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Handle no property data
  if (!property || !Object.keys(property).length) {
    return (
      <div className="container mt-16 mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Property Not Found</h2>
          <p className="text-yellow-600">The requested property could not be found.</p>
          <Link
            to="/"
            className="inline-flex items-center cursor-pointer mt-4 p-2 rounded-md bg-slate-100 text-blue-600 hover:text-blue-800"
          >
            <IoMdArrowBack className="mr-2" />
            Browse Available Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-16 mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center cursor-pointer p-4 rounded-md bg-slate-100 text-blue-600 hover:text-blue-800 mb-6"
      >
        <IoMdArrowBack className="mr-2" />
        Back to Properties
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Main image gallery */}
        <div className="relative h-96">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[activeImageIndex]}
              alt={property.title || "Property"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}

          {/* Image navigation arrows - only show if multiple images */}
          {property.images && property.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )
                }
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>
          )}

          {/* Image thumbnails - only show if multiple images */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeImageIndex ? "bg-white" : "bg-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {property.title || "Unnamed Property"}
              </h1>
              <p className="text-gray-600 mt-1">{property.location || "Location not specified"}</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-2xl font-bold text-blue-600">
                ${property.pricePerNight || 0}
              </p>
              <p className="text-gray-500">per night</p>
            </div>
          </div>

          {/* Host info */}
          {property.host && (
            <div className="mt-6 flex items-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {property.host.name ? property.host.name.charAt(0) : "?"}
              </div>
              <div className="ml-4">
                <p className="font-medium">Hosted by {property.host.name || "Anonymous"}</p>
                {property.host.createdAt && (
                  <p className="text-gray-500 text-sm">
                    Member since {formatDate(property.host.createdAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Property stats */}
          <div className="mt-6 flex flex-wrap gap-6 border-t border-b border-gray-200 py-6">
            <div className="flex items-center">
              <MdBedroomParent className="text-blue-600 text-xl mr-2" />
              <span>{property.bedrooms || 0} Bedrooms</span>
            </div>
            <div className="flex items-center">
              <MdBathroom className="text-blue-600 text-xl mr-2" />
              <span>{property.bathrooms || 0} Bathrooms</span>
            </div>
            <div className="flex items-center">
              <BsPeopleFill className="text-blue-600 text-xl mr-2" />
              <span>Up to {property.maxGuests || 0} guests</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description || "No description provided."}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {getAmenityIcon(amenity)}
                    <span className="ml-2 capitalize">
                      {amenity === "airConditioning" ? "Air Conditioning" : amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {property.houseRules && property.houseRules.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {property.houseRules.map((rule, index) => (
                  <li key={index} className="mb-1">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking button */}
          <div className="mt-8">
            <button 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Book this property"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;