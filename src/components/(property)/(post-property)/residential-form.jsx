"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, X, Plus, Loader } from "lucide-react";
import {
  useUploadPropertyImagesMutation,
  useCreatePropertyMutation,
} from "@/service/propertyApi";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const validationSchema = Yup.object({
  title: Yup.string().required("Property title is required"),
  city: Yup.string().required("City is required"),
  project_name: Yup.string().required("Project/Society name is required"),
  expected_price: Yup.number()
    .required("Expected price is required")
    .positive("Price must be positive"),
  booking_amount: Yup.number().positive("Amount must be positive"),
  is_price_negotiable: Yup.boolean(),
  carpet_area: Yup.number()
    .required("Carpet area is required")
    .positive("Area must be positive"),
  super_area: Yup.number().positive("Area must be positive"),
  bedrooms: Yup.number()
    .required("Number of bedrooms is required")
    .positive("Must be positive")
    .integer("Must be a whole number"),
  bathrooms: Yup.number()
    .required("Number of bathrooms is required")
    .positive("Must be positive")
    .integer("Must be a whole number"),
  balconies: Yup.number()
    .required("Number of balconies is required")
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  possession_status: Yup.string().required("Possession status is required"),
  property_post_status: Yup.string().required(
    "Property Post status is required",
  ),
  rera_id: Yup.string(),
  nearby_landmarks: Yup.string(),
  builder_name: Yup.string(),
  builder_logo: Yup.string().url("Must be a valid URL"),
  floor_number: Yup.number()
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  total_floors: Yup.number()
    .positive("Must be positive")
    .integer("Must be a whole number"),
  facing: Yup.string(),
  furnished_status: Yup.string(),
  parking_spaces: Yup.number()
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  property_age: Yup.number()
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  latitude: Yup.number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  longitude: Yup.number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  map_address: Yup.string(),
});

export default function ResidentialForm({ property_type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  // New API for uploading images and creating properties
  const [uploadPropertyImages, { isLoading: isUploadingImages }] = useUploadPropertyImagesMutation();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  
  const [images, setImages] = useState([]);
  const [propertyFeatures, setPropertyFeatures] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [newFacility, setNewFacility] = useState("");
  const { token } = useSelector((state) => state.auth);
  
  const isLoading = isUploadingImages || isCreating;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      city: "",
      project_name: "",
      expected_price: "",
      booking_amount: "",
      is_price_negotiable: false,
      carpet_area: "",
      super_area: "",
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      possession_status: "",
      property_post_status: "ACTIVE",
      rera_id: "",
      nearby_landmarks: "",
      builder_name: "",
      builder_logo: "",
      floor_number: "",
      total_floors: "",
      facing: "",
      furnished_status: "",
      parking_spaces: "",
      property_age: "",
      latitude: "",
      longitude: "",
      map_address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) {
        localStorage.setItem("pendingFormSubmit", "true");
        window.dispatchEvent(new Event("open-auth-modal"));
        return;
      }

      try {
        if (images?.length === 0) {
          toast.error("Please upload at least one image.");
          return;
        }

        // Step 1: Upload images first
        const imageFormData = new FormData();
        for (const img of images) {
          if (img.file) {
            imageFormData.append('files', img.file);
          }
        }
        
        const imageResponse = await uploadPropertyImages(imageFormData).unwrap();
        const imageIds = imageResponse?.image_ids || [];
        
        if (imageIds.length === 0) {
          toast.error("Failed to upload images. Please try again.");
          return;
        }

        // Step 2: Create property with image_ids
        const propertyPayload = {
          title: values.title,
          property_type: property_type,
          city: values.city,
          project_name: values.project_name,
          possession_status: values.possession_status,
          property_post_status: values.property_post_status,
          expected_price: parseFloat(values.expected_price),
          booking_amount: values.booking_amount ? parseFloat(values.booking_amount) : 0,
          is_price_negotiable: values.is_price_negotiable,
          carpet_area: parseFloat(values.carpet_area),
          super_area: values.super_area ? parseFloat(values.super_area) : null,
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          balconies: parseInt(values.balconies),
          rera_id: values.rera_id || "",
          builder_name: values.builder_name || "",
          builder_logo: values.builder_logo || null,
          nearby_landmarks: values.nearby_landmarks || "",
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
          map_address: values.map_address || "",
          property_features: propertyFeatures,
          facilities: facilities,
          property_age: values.property_age ? parseInt(values.property_age) : null,
          floor_number: values.floor_number ? parseInt(values.floor_number) : null,
          total_floors: values.total_floors ? parseInt(values.total_floors) : null,
          facing: values.facing || null,
          furnished_status: values.furnished_status || null,
          parking_spaces: values.parking_spaces ? parseInt(values.parking_spaces) : null,
          image_ids: imageIds,
        };

        const response = await createProperty(propertyPayload).unwrap();
        toast.success(response?.message || "Property created successfully!");
        router.push("/my-property");
      } catch (err) {
        console.error(err);
        toast.error(err?.data?.message || "Something went wrong");
      }
    },
  });

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uploadedImages = newFiles?.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...uploadedImages]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addPropertyFeature = () => {
    if (newFeature.trim()) {
      setPropertyFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removePropertyFeature = (index) => {
    setPropertyFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFacilities((prev) => [...prev, newFacility.trim()]);
      setNewFacility("");
    }
  };

  const removeFacility = (index) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#1a1333] to-[#0d0a1a] rounded-lg shadow-lg p-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">
                Basic Information
              </h2>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Property Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.title && formik.errors.title
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter a catchy title for your property"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.title}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter city name"
                  {...formik.getFieldProps("city")}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.city}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="propertyType"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Property Type*
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  disabled
                  value={property_type}
                />
              </div>

              <div>
                <label
                  htmlFor="project_name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Project/Society Name*
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.project_name && formik.errors.project_name
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter project or society name"
                  {...formik.getFieldProps("project_name")}
                />
                {formik.touched.project_name && formik.errors.project_name && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.project_name}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="possession_status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Possession Status*
              </label>
              <select
                id="possession_status"
                name="possession_status"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.possession_status &&
                  formik.errors.possession_status
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                {...formik.getFieldProps("possession_status")}
              >
                <option value="">Select Status</option>
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
              </select>
              {formik.touched.possession_status &&
                formik.errors.possession_status && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.possession_status}
                  </div>
                )}
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="property_post_status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Property Post Status
              </label>
              <select
                id="property_post_status"
                name="property_post_status"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.property_post_status &&
                  formik.errors.property_post_status
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                {...formik.getFieldProps("property_post_status")}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SOLD">Sold</option>
              </select>
              {formik.touched.property_post_status &&
                formik.errors.property_post_status && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.property_post_status}
                  </div>
                )}
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Price Details
              </h2>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="expected_price"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Price (₹)*
              </label>
              <input
                type="number"
                id="expected_price"
                name="expected_price"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.expected_price && formik.errors.expected_price
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter expected price"
                {...formik.getFieldProps("expected_price")}
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="booking_amount"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Booking/Token Amount (₹)
              </label>
              <input
                type="number"
                id="booking_amount"
                name="booking_amount"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.booking_amount && formik.errors.booking_amount
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter booking amount"
                {...formik.getFieldProps("booking_amount")}
              />
            </div>

            <div className="md:col-span-4 flex items-end">
              <div className="flex items-center w-full h-10">
                <label
                  htmlFor="is_price_negotiable"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="is_price_negotiable"
                    name="is_price_negotiable"
                    className="sr-only"
                    {...formik.getFieldProps("is_price_negotiable")}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-[#2a1f45] flex items-center justify-center transition-all duration-200 bg-white">
                    {formik.values.is_price_negotiable && (
                      <svg
                        className="w-3 h-3 text-[#2a1f45]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 block text-sm text-gray-300">
                    Price Negotiable
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Area Details
              </h2>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="carpet_area"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Carpet Area (sq ft)*
              </label>
              <input
                type="number"
                id="carpet_area"
                name="carpet_area"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.carpet_area && formik.errors.carpet_area
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter carpet area"
                {...formik.getFieldProps("carpet_area")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="super_area"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Super Area (sq ft)
              </label>
              <input
                type="number"
                id="super_area"
                name="super_area"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.super_area && formik.errors.super_area
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter super area"
                {...formik.getFieldProps("super_area")}
              />
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Room Details
              </h2>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Bedrooms*
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="0"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.bedrooms && formik.errors.bedrooms
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter number of bedrooms"
                {...formik.getFieldProps("bedrooms")}
              />
              {formik.touched.bedrooms && formik.errors.bedrooms && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.bedrooms}
                </div>
              )}
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Bathrooms*
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                min="0"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.bathrooms && formik.errors.bathrooms
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter number of bathrooms"
                {...formik.getFieldProps("bathrooms")}
              />
              {formik.touched.bathrooms && formik.errors.bathrooms && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.bathrooms}
                </div>
              )}
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="balconies"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Balconies*
              </label>
              <input
                type="number"
                id="balconies"
                name="balconies"
                min="0"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.balconies && formik.errors.balconies
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter number of balconies"
                {...formik.getFieldProps("balconies")}
              />
              {formik.touched.balconies && formik.errors.balconies && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.balconies}
                </div>
              )}
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Additional Details
              </h2>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="rera_id"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                RERA ID
              </label>
              <input
                type="text"
                id="rera_id"
                name="rera_id"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter RERA ID"
                {...formik.getFieldProps("rera_id")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="builder_name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Builder Name
              </label>
              <input
                type="text"
                id="builder_name"
                name="builder_name"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter builder name"
                {...formik.getFieldProps("builder_name")}
              />
            </div>

            <div className="md:col-span-12">
              <label
                htmlFor="builder_logo"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Builder Logo URL
              </label>
              <input
                type="text"
                id="builder_logo"
                name="builder_logo"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter builder logo URL"
                {...formik.getFieldProps("builder_logo")}
              />
              {formik.touched.builder_logo && formik.errors.builder_logo && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.builder_logo}
                </div>
              )}
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Floor Details
              </h2>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="floor_number"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Floor Number
              </label>
              <input
                type="number"
                id="floor_number"
                name="floor_number"
                min="0"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter floor number"
                {...formik.getFieldProps("floor_number")}
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="total_floors"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Total Floors
              </label>
              <input
                type="number"
                id="total_floors"
                name="total_floors"
                min="1"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter total floors"
                {...formik.getFieldProps("total_floors")}
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="property_age"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Property Age (Years)
              </label>
              <input
                type="number"
                id="property_age"
                name="property_age"
                min="0"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter property age"
                {...formik.getFieldProps("property_age")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="facing"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Facing Direction
              </label>
              <select
                id="facing"
                name="facing"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                {...formik.getFieldProps("facing")}
              >
                <option value="">Select Facing</option>
                <option value="NORTH">North</option>
                <option value="SOUTH">South</option>
                <option value="EAST">East</option>
                <option value="WEST">West</option>
              </select>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="furnished_status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Furnished Status
              </label>
              <select
                id="furnished_status"
                name="furnished_status"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                {...formik.getFieldProps("furnished_status")}
              >
                <option value="">Select Status</option>
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FURNISHED">Furnished</option>
              </select>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="parking_spaces"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Parking Spaces
              </label>
              <input
                type="number"
                id="parking_spaces"
                name="parking_spaces"
                min="0"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter number of parking spaces"
                {...formik.getFieldProps("parking_spaces")}
              />
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Location Details
              </h2>
            </div>

            <div className="md:col-span-12">
              <label
                htmlFor="map_address"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Map Address
              </label>
              <input
                type="text"
                id="map_address"
                name="map_address"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter full address"
                {...formik.getFieldProps("map_address")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Latitude
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter latitude"
                {...formik.getFieldProps("latitude")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Longitude
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter longitude"
                {...formik.getFieldProps("longitude")}
              />
            </div>

            <div className="md:col-span-12">
              <label
                htmlFor="nearby_landmarks"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Nearby Landmarks
              </label>
              <textarea
                id="nearby_landmarks"
                name="nearby_landmarks"
                rows={3}
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter nearby landmarks"
                {...formik.getFieldProps("nearby_landmarks")}
              ></textarea>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Property Features
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Add property features like Modular Kitchen, Wooden Flooring, etc.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPropertyFeature())}
                  className="flex-1 px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter a feature"
                />
                <button
                  type="button"
                  onClick={addPropertyFeature}
                  className="px-4 py-2 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white rounded transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {propertyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#2a1f45] px-3 py-1 rounded-full text-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removePropertyFeature(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Facilities
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Add facilities like Swimming Pool, Gym, 24x7 Security, etc.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                  className="flex-1 px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter a facility"
                />
                <button
                  type="button"
                  onClick={addFacility}
                  className="px-4 py-2 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white rounded transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#2a1f45] px-3 py-1 rounded-full text-sm"
                  >
                    <span>{facility}</span>
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Property Images
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Upload images of your property (exterior, living room, bedrooms,
                bathrooms, kitchen, others)
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {images?.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-[#2a1f45] rounded-lg overflow-hidden border border-[#3a2a5a]"
                  >
                    <img
                      src={img.url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#2a1f45] rounded-lg border border-dashed border-[#3a2a5a] cursor-pointer hover:bg-[#3a2a5a]">
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-12 mt-6">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <Loader />
                  </div>
                ) : (
                  "Submit Property"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
