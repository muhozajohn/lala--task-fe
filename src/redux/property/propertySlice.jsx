import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "../../services/property.service";

const initialState = {
  properties: [],
  currentProperty: null,
  filteredProperties: [],
  userProperties: [],
  loading: false,
  error: null,
  availability: null,
};

export const createProperty = createAsyncThunk(
  "properties/create",
  async (propertyData, { rejectWithValue }) => {
    try {
      // Log the propertyData before sending
      console.log('Sending property data:', propertyData);
      
      const response = await propertyService.createProperty(propertyData);
      
      // Log the response
      console.log('Server response:', response);
      
      return response?.data?.data;
    } catch (error) {
      console.error('Error in createProperty thunk:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to create property");
    }
  }
);

// Get all properties
export const getAllProperties = createAsyncThunk(
  "properties/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.getAllProperties();
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get properties");
    }
  }
);

// Get property by ID
export const getPropertyById = createAsyncThunk(
  "properties/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertyById(id);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get property details");
    }
  }
);

// Get properties by location
export const getPropertiesByLocation = createAsyncThunk(
  "properties/getByLocation",
  async (location, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertiesByLocation(location);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get properties by location");
    }
  }
);

// Get properties by price range
export const getPropertiesByPriceRange = createAsyncThunk(
  "properties/getByPriceRange",
  async ({ minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertiesByPriceRange(minPrice, maxPrice);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to get properties by price range");
    }
  }
);

// Update property
export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateProperty(id, data);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update property");
    }
  }
);

// Partially update property
export const updatePropertyPartial = createAsyncThunk(
  "properties/updatePartial",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updatePropertyPartial(id, data);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to update property");
    }
  }
);

// Delete property
export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete property");
    }
  }
);

// Check property availability
export const checkPropertyAvailability = createAsyncThunk(
  "properties/checkAvailability",
  async ({ id, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await propertyService.checkPropertyAvailability(id, startDate, endDate);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue("Failed to check property availability");
    }
  }
);

export const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearPropertyErrors: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    clearFilteredProperties: (state) => {
      state.filteredProperties = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all properties
      .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get property by ID
      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.currentProperty = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get properties by location
      .addCase(getPropertiesByLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertiesByLocation.fulfilled, (state, action) => {
        state.filteredProperties = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPropertiesByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get properties by price range
      .addCase(getPropertiesByPriceRange.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertiesByPriceRange.fulfilled, (state, action) => {
        state.filteredProperties = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPropertiesByPriceRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.properties = state.properties.map(property => 
          property.id === action.payload.id ? action.payload : property
        );
        if (state.currentProperty && state.currentProperty.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Partial update property (handles the same way as full update)
      .addCase(updatePropertyPartial.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePropertyPartial.fulfilled, (state, action) => {
        state.properties = state.properties.map(property => 
          property.id === action.payload.id ? action.payload : property
        );
        if (state.currentProperty && state.currentProperty.id === action.payload.id) {
          state.currentProperty = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePropertyPartial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(property => property.id !== action.payload);
        if (state.currentProperty && state.currentProperty.id === action.payload) {
          state.currentProperty = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check availability
      .addCase(checkPropertyAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPropertyAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkPropertyAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export selectors
export const selectProperties = (state) => state.properties.properties;
export const selectCurrentProperty = (state) => state.properties.currentProperty;
export const selectFilteredProperties = (state) => state.properties.filteredProperties;
export const selectPropertyLoading = (state) => state.properties.loading;
export const selectPropertyError = (state) => state.properties.error;
export const selectPropertyAvailability = (state) => state.properties.availability;

// Export actions
export const { clearPropertyErrors, clearCurrentProperty, clearFilteredProperties } = propertySlice.actions;

export default propertySlice.reducer;