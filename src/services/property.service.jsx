import http from "../axiosInstance";

class PropertyService {
  // Create a new property with images
  createProperty(data) {
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    return http.post("/properties", data);
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
    
    return http.put(`/properties/${id}`, data);
  }

  // Update property (partial update)
  updatePropertyPartial(id, data) {   
    return http.patch(`/properties/${id}`, data);
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