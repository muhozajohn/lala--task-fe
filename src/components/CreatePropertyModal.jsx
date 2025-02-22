import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { X, Plus, Upload } from "lucide-react";

const CreatePropertyModal = ({ isOpen, onClose, onSubmit }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    pricePerNight: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    location: Yup.string().required("Location is required"),
    maxGuests: Yup.number()
      .required("Max guests is required")
      .positive("Must be positive")
      .integer("Must be a whole number"),
    bathrooms: Yup.number()
      .required("Number of bathrooms is required")
      .positive("Must be positive")
      .integer("Must be a whole number"),
    bedrooms: Yup.number()
      .required("Number of bedrooms is required")
      .positive("Must be positive")
      .integer("Must be a whole number"),
    amenities: Yup.array().min(1, "At least one amenity is required"),
    houseRules: Yup.array().min(1, "At least one house rule is required"),
  });

  const initialValues = {
    title: "",
    description: "",
    pricePerNight: "",
    location: "",
    maxGuests: "",
    bathrooms: "",
    bedrooms: "",
    amenities: ["wifi"],
    houseRules: ["No smoking"],
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add all form fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("pricePerNight", values.pricePerNight);
      formData.append("location", values.location);
      formData.append("maxGuests", values.maxGuests);
      formData.append("bathrooms", values.bathrooms);
      formData.append("bedrooms", values.bedrooms);

      // Add arrays as separate items
      values.amenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });

      values.houseRules.forEach((rule, index) => {
        formData.append(`houseRules[${index}]`, rule);
      });

      // Add images
      imageFiles.forEach((file, index) => {
        formData.append(`images`, file); // The backend expects 'images' as the field name
      });

      // Log form data for debugging
      console.log("Form values:", values);
      console.log("Image files:", imageFiles);

      // Submit the form
      await onSubmit(formData);

      // Reset form on success
      resetForm();
      setImageFiles([]);
      setImagePreview([]);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create New Property</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Field
                      name="title"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter property title"
                    />
                    {errors.title && touched.title && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full px-3 py-2 border rounded-md h-24"
                      placeholder="Describe your property"
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt="preview"
                          className="h-24 w-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Add Image
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Night ($)
                    </label>
                    <Field
                      type="number"
                      name="pricePerNight"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.pricePerNight && touched.pricePerNight && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.pricePerNight}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Field
                      name="location"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter address"
                    />
                    {errors.location && touched.location && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Guests
                    </label>
                    <Field
                      type="number"
                      name="maxGuests"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.maxGuests && touched.maxGuests && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.maxGuests}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <Field
                      type="number"
                      name="bedrooms"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.bedrooms && touched.bedrooms && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.bedrooms}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <Field
                      type="number"
                      name="bathrooms"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.bathrooms && touched.bathrooms && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.bathrooms}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <FieldArray name="amenities">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.amenities.map((amenity, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`amenities.${index}`}
                              className="flex-1 px-3 py-2 border rounded-md"
                              placeholder="Enter amenity"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Amenity</span>
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* House Rules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Rules
                  </label>
                  <FieldArray name="houseRules">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.houseRules.map((rule, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              name={`houseRules.${index}`}
                              className="flex-1 px-3 py-2 border rounded-md"
                              placeholder="Enter rule"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Rule</span>
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {isSubmitting ? "Submitting..." : "Create Property"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreatePropertyModal;
