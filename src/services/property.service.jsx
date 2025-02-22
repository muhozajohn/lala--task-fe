import http from "../axiosInstance";

class PropertyService {
  // Create a new property with images
  createProperty(data) {
    // Using FormData for file uploads
    const formData = new FormData();
    
    // Add all property data to formData
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        // Handle multiple image files
        data.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return http.post("/properties", formData);
  }

  // Get all properties
  getAllProperties() {
    return http.get("/properties");
  }

  // Get properties by location
  getPropertiesByLocation(location) {
    return http.get(`/properties/location`, { params: { location } });
  }

  // Get properties by price range
  getPropertiesByPriceRange(minPrice, maxPrice) {
    return http.get(`/properties/price-range`, { 
      params: { minPrice, maxPrice } 
    });
  }

  // Get a single property by ID
  getPropertyById(id) {
    return http.get(`/properties/${id}`);
  }

  // Update property (full update)
  updateProperty(id, data) {
    // Using FormData for file uploads
    const formData = new FormData();
    
    // Add all property data to formData
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        // Handle multiple image files
        data.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return http.put(`/properties/${id}`, formData);
  }

  // Update property (partial update)
  updatePropertyPartial(id, data) {
    // Using FormData for file uploads
    const formData = new FormData();
    
    // Add all property data to formData
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        // Handle multiple image files
        data.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return http.patch(`/properties/${id}`, formData);
  }

  // Delete property
  deleteProperty(id) {
    return http.delete(`/properties/${id}`);
  }

  // Check property availability
  checkPropertyAvailability(id, startDate, endDate) {
    return http.get(`/properties/${id}/availability`, {
      params: { startDate, endDate }
    });
  }
}

const propertyService = new PropertyService();
export default propertyService;