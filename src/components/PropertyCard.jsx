import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const images = "https://res.cloudinary.com/dskrteajn/image/upload/v1706744948/ghcovgg7z1clwfwvucuk.jpg"

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(property.images.length - 1);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <Link 
      to={`/properties/${property.id}`}
      className="block overflow-hidden rounded-lg transition-transform duration-300 hover:shadow-lg"
    >
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Image with carousel controls */}
        <div className="relative aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">

          <div className="overflow-hidden h-full md:h-[250px]">

          <img
            src={property.images[currentImageIndex] || images}
            alt={`${property.location} property`}
            className="h-full w-full object-cover transition-opacity duration-300"
            />
            </div>
          
          {/* Navigation arrows - only visible on hover */}
          {isHovering && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:bg-gray-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:bg-gray-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          {/* Favorite button */}
          <button 
            className="absolute right-3 top-3 rounded-full p-1 transition-transform duration-300 hover:scale-110"
            aria-label={property.isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Toggle favorite logic would go here
            }}
          >
            <Heart 
              className={`h-6 w-6 ${property.isFavorite ? 'fill-red-500 text-red-500' : 'fill-transparent text-white stroke-2'}`}
            />
          </button>
          
          {/* Image pagination dots */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
            {property.images.map((_, index) => (
              <span 
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
          
          {/* New tag if applicable */}
          {property.isNew && (
            <span className="absolute right-3 top-3 rounded bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
              New
            </span>
          )}
        </div>
        
        {/* Property details */}
        <div className="mt-3 px-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-900">{property.location}</h3>
            {property.rating && (
              <div className="flex items-center">
                <span className="mr-1">★</span>
                <span>{property.rating}</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{property.description?.slice(0,40)} <span className='text-blue-600'>read more....</span> </p>
          <p className="mt-1 text-sm text-gray-600">{property.dates}</p>
          <p className="mt-2">
            <span className="font-semibold text-xs">${property.pricePerNight}</span>
            <span className="text-gray-600"> / night</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;