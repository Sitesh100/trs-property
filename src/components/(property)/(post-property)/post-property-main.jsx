"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Plus, Loader } from "lucide-react";
import {
  useUploadPropertyImagesMutation,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useGetPropertyByIdQuery,
} from "@/service/propertyApi";
import LocationSearch from "@/components/LocationSearch";
import PropertyMap from "@/components/PropertyMap";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import AuthModal from "@/components/auth/auth-modal";

const propertyTypeOptions = [
  { label: "Apartment", value: "flat" },
  { label: "Villa", value: "villa" },
  { label: "Plot", value: "plot" },
  { label: "Showroom", value: "showroom" },
  { label: "Office", value: "office" },
  { label: "Project Land", value: "project_land" },
  { label: "Farm House", value: "farm_house" },
];

const normalizePropertyType = (type) => {
  if (!type) return "";
  if (type === "apartment") return "flat";
  if (type === "builder") return "builder_floor";
  return type;
};

const validationSchema = Yup.object({
  title: Yup.string().required("Property title is required"),
  city: Yup.string().required("City is required"),
  property_type: Yup.string().required("Property type is required"),
  status: Yup.string().oneOf(["Sell", "Rent"]).required("Status is required"),
  project_name: Yup.string().required("Project/Society name is required"),
  expected_price: Yup.number()
    .required("Expected price is required")
    .positive("Price must be positive"),
  booking_amount: Yup.number().nullable().transform((value, originalValue) => (originalValue === "" ? null : value)).positive("Amount must be positive"),
  is_price_negotiable: Yup.boolean(),
  carpet_area: Yup.number()
    .required("Carpet area is required")
    .positive("Area must be positive"),
  super_area: Yup.number().nullable().transform((value, originalValue) => (originalValue === "" ? null : value)).positive("Area must be positive"),
  bedrooms: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .integer("Must be a whole number")
    .min(0, "Cannot be negative"),
  bathrooms: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .integer("Must be a whole number")
    .min(0, "Cannot be negative"),
  balconies: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .integer("Must be a whole number")
    .min(0, "Cannot be negative"),
  possession_status: Yup.string().required("Possession status is required"),
  rera_id: Yup.string(),
  nearby_landmarks: Yup.string(),
  builder_name: Yup.string(),
  builder_logo: Yup.string().url("Must be a valid URL"),
  floor_number: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  total_floors: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .positive("Must be positive")
    .integer("Must be a whole number"),
  facing: Yup.string(),
  furnished_status: Yup.string(),
  parking_spaces: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  property_age: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, "Cannot be negative")
    .integer("Must be a whole number"),
  latitude: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  longitude: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
  map_address: Yup.string(),
});

export default function PostPropertyMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const [uploadPropertyImages, { isLoading: isUploadingImages }] = useUploadPropertyImagesMutation();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();

  const { data: existingProperty } = useGetPropertyByIdQuery(id, { skip: !id });

  const [images, setImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [propertyFeatures, setPropertyFeatures] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [newFacility, setNewFacility] = useState("");

  const isLoading = isUploadingImages || isCreating || isUpdating;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      city: "",
      property_type: "",
      status: "Sell",
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
      if (!isAuthenticated) {
        toast.error("Please login to post a property");
        setPendingSubmit(true);
        setShowAuthModal(true);
        return;
      }

      try {
        if (uploadedImageUrls?.length === 0) {
          toast.error("Please upload at least one image.");
          return;
        }

        const showBhkFields = values.property_type === "flat" || values.property_type === "villa";

        const propertyPayload = {
          title: values.title,
          property_type: values.property_type,
          status: values.status,
          city: values.city,
          project_name: values.project_name,
          possession_status: values.possession_status,
          expected_price: parseFloat(values.expected_price),
          booking_amount: values.booking_amount ? parseFloat(values.booking_amount) : 0,
          is_price_negotiable: values.is_price_negotiable,
          carpet_area: parseFloat(values.carpet_area),
          super_area: values.super_area ? parseFloat(values.super_area) : null,
          bedrooms: showBhkFields && values.bedrooms !== "" ? parseInt(values.bedrooms, 10) : null,
          bathrooms: showBhkFields && values.bathrooms !== "" ? parseInt(values.bathrooms, 10) : null,
          balconies: showBhkFields && values.balconies !== "" ? parseInt(values.balconies, 10) : null,
          rera_id: values.rera_id || "",
          builder_name: values.builder_name || "",
          builder_logo: values.builder_logo || null,
          nearby_landmarks: values.nearby_landmarks || "",
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
          map_address: values.map_address || "",
          property_features: propertyFeatures,
          facilities: facilities,
          property_age: values.property_age ? parseInt(values.property_age, 10) : null,
          floor_number: values.floor_number ? parseInt(values.floor_number, 10) : null,
          total_floors: values.total_floors ? parseInt(values.total_floors, 10) : null,
          facing: values.facing || null,
          furnished_status: values.furnished_status || null,
          parking_spaces: values.parking_spaces ? parseInt(values.parking_spaces, 10) : null,
          image: uploadedImageUrls.join(","),
        };

        if (isEditMode) {
          const response = await updateProperty({ property_id: id, ...propertyPayload }).unwrap();
          toast.success(response?.message || "Property updated successfully!");
        } else {
          const response = await createProperty(propertyPayload).unwrap();
          toast.success(response?.message || "Property created successfully!");
        }
        router.push("/my-property");
      } catch (err) {
        if (err?.status === 401 || err?.originalStatus === 401) {
          toast.error("Session expired. Please login again.");
          setPendingSubmit(true);
          setShowAuthModal(true);
        } else {
          toast.error(err?.data?.detail || err?.data?.message || "Something went wrong");
        }
      }
    },
  });

  useEffect(() => {
    const handleResumeSubmit = () => {
      if (pendingSubmit && isAuthenticated) {
        setPendingSubmit(false);
        formik.handleSubmit();
      }
    };

    window.addEventListener("resume-form-submit", handleResumeSubmit);
    return () => window.removeEventListener("resume-form-submit", handleResumeSubmit);
  }, [pendingSubmit, isAuthenticated]);

  useEffect(() => {
    const showBhkFields = formik.values.property_type === "flat" || formik.values.property_type === "villa";
    if (!showBhkFields) {
      formik.setFieldValue("bedrooms", "", false);
      formik.setFieldValue("bathrooms", "", false);
      formik.setFieldValue("balconies", "", false);
    }
  }, [formik.values.property_type]);

  useEffect(() => {
    if (isEditMode && existingProperty) {
      formik.setValues({
        title: existingProperty.title || "",
        city: existingProperty.city || "",
        property_type: normalizePropertyType(existingProperty.property_type) || "",
        status: existingProperty.status || existingProperty.property_for || "Sell",
        project_name: existingProperty.project_name || "",
        expected_price: existingProperty.expected_price || existingProperty.price || "",
        booking_amount: existingProperty.booking_amount || "",
        is_price_negotiable: existingProperty.is_price_negotiable || false,
        carpet_area: existingProperty.carpet_area || "",
        super_area: existingProperty.super_area || "",
        bedrooms: existingProperty.bedrooms || "",
        bathrooms: existingProperty.bathrooms || "",
        balconies: existingProperty.balconies || "",
        possession_status: existingProperty.possession_status || "",
        rera_id: existingProperty.rera_id || "",
        nearby_landmarks: existingProperty.nearby_landmarks || "",
        builder_name: existingProperty.builder_name || "",
        builder_logo: existingProperty.builder_logo || "",
        floor_number: existingProperty.floor_number || "",
        total_floors: existingProperty.total_floors || "",
        facing: existingProperty.facing || "",
        furnished_status: existingProperty.furnished_status || "",
        parking_spaces: existingProperty.parking_spaces || "",
        property_age: existingProperty.property_age || "",
        latitude: existingProperty.latitude || "",
        longitude: existingProperty.longitude || "",
        map_address: existingProperty.map_address || "",
      });
      if (existingProperty.property_features?.length > 0) setPropertyFeatures(existingProperty.property_features);
      if (existingProperty.facilities?.length > 0) setFacilities(existingProperty.facilities);

      const existingImageUrls = [];
      if (existingProperty.image) {
        existingImageUrls.push(
          ...existingProperty.image
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean),
        );
      }

      if (Array.isArray(existingProperty.image_ids) && existingProperty.image_ids.length > 0) {
        existingImageUrls.push(
          ...existingProperty.image_ids
            .map((url) => (url ?? "").toString().trim())
            .filter(Boolean),
        );
      }

      const uniqueExistingUrls = [...new Set(existingImageUrls)];
      setUploadedImageUrls(uniqueExistingUrls);
      setImages(
        uniqueExistingUrls.map((url) => ({
          uploadedUrl: url,
          url,
        })),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingProperty, isEditMode]);

  const handleImageUpload = async (e) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    try {
      const uploadedImages = [];
      const uploadedUrls = [];

      for (const image of newFiles) {
        const imageFormData = new FormData();
        imageFormData.append("image", image);

        const imageResponse = await uploadPropertyImages(imageFormData).unwrap();
        const uploadedUrl = imageResponse?.image_url || imageResponse?.data?.image_url;

        if (!uploadedUrl) continue;

        uploadedImages.push({
          uploadedUrl,
          url: URL.createObjectURL(image),
        });
        uploadedUrls.push(uploadedUrl);
      }

      if (!uploadedUrls.length) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      setImages((prev) => [...prev, ...uploadedImages]);
      setUploadedImageUrls((prev) => [...prev, ...uploadedUrls]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed?.uploadedUrl) {
        setUploadedImageUrls((urls) => urls.filter((url) => url !== removed.uploadedUrl));
      }
      return prev.filter((_, i) => i !== index);
    });
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

  const handleLocationSelect = ({ address, latitude, longitude }) => {
    formik.setFieldValue("map_address", address || "");
    formik.setFieldValue("latitude", latitude ?? "");
    formik.setFieldValue("longitude", longitude ?? "");
  };

  const handleLocationInputChange = (addressText) => {
    formik.setFieldValue("map_address", addressText || "");
    if (!addressText || addressText !== formik.values.map_address) {
      formik.setFieldValue("latitude", "");
      formik.setFieldValue("longitude", "");
    }
  };

  const hasCoordinates =
    formik.values.latitude !== "" &&
    formik.values.latitude !== null &&
    formik.values.longitude !== "" &&
    formik.values.longitude !== null;

  const showBhkFields = formik.values.property_type === "flat" || formik.values.property_type === "villa";
  const showFloorDetails = formik.values.property_type !== "plot" && formik.values.property_type !== "project_land";

  return (
    <div className="bg-gray-900">
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <div className="max-w-4xl mx-auto bg-[#10141B] border border-[#4A5363] rounded-lg shadow-lg p-6">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475]">Basic Information</h2>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#F5EFE7] mb-1">Property Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.title && formik.errors.title ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                  placeholder="Enter a catchy title for your property"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.title}</div>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#F5EFE7] mb-1">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.city && formik.errors.city ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                  placeholder="Enter city name"
                  {...formik.getFieldProps("city")}
                />
                {formik.touched.city && formik.errors.city && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.city}</div>}
              </div>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-[#F5EFE7] mb-1">Property Type*</label>
                <select
                  id="property_type"
                  name="property_type"
                  className={`w-full md:px-3 md:py-2 bg-[#171C24] border ${formik.touched.property_type && formik.errors.property_type ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                  {...formik.getFieldProps("property_type")}
                >
                  <option value="">Select property type</option>
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {formik.touched.property_type && formik.errors.property_type && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.property_type}</div>}
              </div>

              <div>
                <label htmlFor="project_name" className="block text-sm font-medium text-[#F5EFE7] mb-1">Project/Society Name*</label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.project_name && formik.errors.project_name ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                  placeholder="Enter project or society name"
                  {...formik.getFieldProps("project_name")}
                />
                {formik.touched.project_name && formik.errors.project_name && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.project_name}</div>}
              </div>
            </div>

            <div className="md:col-span-6">
              <label htmlFor="status" className="block text-sm font-medium text-[#F5EFE7] mb-1">Status (Sell/Rent)*</label>
              <select
                id="status"
                name="status"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.status && formik.errors.status ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                {...formik.getFieldProps("status")}
              >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
              </select>
              {formik.touched.status && formik.errors.status && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.status}</div>}
            </div>

            <div className="md:col-span-6">
              <label htmlFor="possession_status" className="block text-sm font-medium text-[#F5EFE7] mb-1">Possession Status*</label>
              <select
                id="possession_status"
                name="possession_status"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.possession_status && formik.errors.possession_status ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                {...formik.getFieldProps("possession_status")}
              >
                <option value="">Select Status</option>
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
              </select>
              {formik.touched.possession_status && formik.errors.possession_status && <div className="text-[#C6A256] text-xs mt-1">{formik.errors.possession_status}</div>}
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Price Details</h2>
            </div>

            <div className="md:col-span-4">
              <label htmlFor="expected_price" className="block text-sm font-medium text-[#F5EFE7] mb-1">Expected Price (₹)*</label>
              <input
                type="number"
                id="expected_price"
                name="expected_price"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.expected_price && formik.errors.expected_price ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                placeholder="Enter expected price"
                {...formik.getFieldProps("expected_price")}
              />
            </div>

            <div className="md:col-span-4">
              <label htmlFor="booking_amount" className="block text-sm font-medium text-[#F5EFE7] mb-1">Booking/Token Amount (₹)</label>
              <input
                type="number"
                id="booking_amount"
                name="booking_amount"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.booking_amount && formik.errors.booking_amount ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                placeholder="Enter booking amount"
                {...formik.getFieldProps("booking_amount")}
              />
            </div>

            <div className="md:col-span-4 flex items-end">
              <div className="flex items-center w-full h-10">
                <label htmlFor="is_price_negotiable" className="flex items-center cursor-pointer">
                  <input type="checkbox" id="is_price_negotiable" name="is_price_negotiable" className="sr-only" {...formik.getFieldProps("is_price_negotiable")} />
                  <div className="w-5 h-5 rounded-md border-2 border-[#5B6475] flex items-center justify-center transition-all duration-200 bg-[#F5EFE7]">
                    {formik.values.is_price_negotiable && (
                      <svg className="w-3 h-3 text-[#C6A256]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 block text-sm text-[#F5EFE7]">Price Negotiable</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Area Details</h2>
            </div>

            <div className="md:col-span-6">
              <label htmlFor="carpet_area" className="block text-sm font-medium text-[#F5EFE7] mb-1">Carpet Area (sq ft)*</label>
              <input
                type="number"
                id="carpet_area"
                name="carpet_area"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.carpet_area && formik.errors.carpet_area ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                placeholder="Enter carpet area"
                {...formik.getFieldProps("carpet_area")}
              />
            </div>

            <div className="md:col-span-6">
              <label htmlFor="super_area" className="block text-sm font-medium text-[#F5EFE7] mb-1">Super Area (sq ft)</label>
              <input
                type="number"
                id="super_area"
                name="super_area"
                className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.super_area && formik.errors.super_area ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                placeholder="Enter super area"
                {...formik.getFieldProps("super_area")}
              />
            </div>

            {showBhkFields && (
              <>
                <div className="md:col-span-12">
                  <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Room Details</h2>
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-[#F5EFE7] mb-1">Bedrooms (Optional)</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    min="0"
                    className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.bedrooms && formik.errors.bedrooms ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                    placeholder="Enter number of bedrooms"
                    {...formik.getFieldProps("bedrooms")}
                  />
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-[#F5EFE7] mb-1">Bathrooms (Optional)</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    min="0"
                    className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.bathrooms && formik.errors.bathrooms ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                    placeholder="Enter number of bathrooms"
                    {...formik.getFieldProps("bathrooms")}
                  />
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="balconies" className="block text-sm font-medium text-[#F5EFE7] mb-1">Balconies (Optional)</label>
                  <input
                    type="number"
                    id="balconies"
                    name="balconies"
                    min="0"
                    className={`w-full px-3 py-2 bg-[#171C24] border ${formik.touched.balconies && formik.errors.balconies ? "border-[#C6A256]" : "border-[#5B6475]"} rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                    placeholder="Enter number of balconies"
                    {...formik.getFieldProps("balconies")}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Additional Details</h2>
            </div>

            <div className="md:col-span-6">
              <label htmlFor="rera_id" className="block text-sm font-medium text-[#F5EFE7] mb-1">RERA ID</label>
              <input type="text" id="rera_id" name="rera_id" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter RERA ID" {...formik.getFieldProps("rera_id")} />
            </div>

            <div className="md:col-span-6">
              <label htmlFor="builder_name" className="block text-sm font-medium text-[#F5EFE7] mb-1">Builder Name</label>
              <input type="text" id="builder_name" name="builder_name" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter builder name" {...formik.getFieldProps("builder_name")} />
            </div>

            <div className="md:col-span-12">
              <label htmlFor="builder_logo" className="block text-sm font-medium text-[#F5EFE7] mb-1">Builder Logo URL</label>
              <input type="text" id="builder_logo" name="builder_logo" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter builder logo URL" {...formik.getFieldProps("builder_logo")} />
            </div>

            {showFloorDetails && (
              <>
                <div className="md:col-span-12">
                  <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Floor Details</h2>
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="floor_number" className="block text-sm font-medium text-[#F5EFE7] mb-1">Floor Number</label>
                  <input type="number" id="floor_number" name="floor_number" min="0" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter floor number" {...formik.getFieldProps("floor_number")} />
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="total_floors" className="block text-sm font-medium text-[#F5EFE7] mb-1">Total Floors</label>
                  <input type="number" id="total_floors" name="total_floors" min="1" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter total floors" {...formik.getFieldProps("total_floors")} />
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="property_age" className="block text-sm font-medium text-[#F5EFE7] mb-1">Property Age (Years)</label>
                  <input type="number" id="property_age" name="property_age" min="0" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter property age" {...formik.getFieldProps("property_age")} />
                </div>

                <div className="md:col-span-6">
                  <label htmlFor="facing" className="block text-sm font-medium text-[#F5EFE7] mb-1">Facing Direction</label>
                  <select id="facing" name="facing" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" {...formik.getFieldProps("facing")}>
                    <option value="">Select Facing</option>
                    <option value="NORTH">North</option>
                    <option value="SOUTH">South</option>
                    <option value="EAST">East</option>
                    <option value="WEST">West</option>
                  </select>
                </div>

                <div className="md:col-span-6">
                  <label htmlFor="furnished_status" className="block text-sm font-medium text-[#F5EFE7] mb-1">Furnished Status</label>
                  <select id="furnished_status" name="furnished_status" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" {...formik.getFieldProps("furnished_status")}>
                    <option value="">Select Status</option>
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="SEMI_FURNISHED">Semi-Furnished</option>
                    <option value="FURNISHED">Furnished</option>
                  </select>
                </div>

                <div className="md:col-span-6">
                  <label htmlFor="parking_spaces" className="block text-sm font-medium text-[#F5EFE7] mb-1">Parking Spaces</label>
                  <input type="number" id="parking_spaces" name="parking_spaces" min="0" className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter number of parking spaces" {...formik.getFieldProps("parking_spaces")} />
                </div>
              </>
            )}

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Location Details</h2>
            </div>

            <div className="md:col-span-12">
              <label htmlFor="map_address" className="block text-sm font-medium text-[#F5EFE7] mb-1">Map Address</label>
              <LocationSearch
                value={formik.values.map_address}
                onSelect={handleLocationSelect}
                onQueryChange={handleLocationInputChange}
                placeholder="Type and select a location"
                inputClassName="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]"
              />
            </div>

            <div className="md:col-span-6">
              <input type="hidden" id="latitude" name="latitude" {...formik.getFieldProps("latitude")} />
              <div className="text-sm text-[#F5EFE7]">Latitude: {formik.values.latitude || "Not selected"}</div>
            </div>

            <div className="md:col-span-6">
              <input type="hidden" id="longitude" name="longitude" {...formik.getFieldProps("longitude")} />
              <div className="text-sm text-[#F5EFE7]">Longitude: {formik.values.longitude || "Not selected"}</div>
            </div>

            {hasCoordinates && (
              <div className="md:col-span-12">
                <p className="block text-sm font-medium text-[#F5EFE7] mb-2">Map Preview</p>
                <PropertyMap lat={formik.values.latitude} lng={formik.values.longitude} address={formik.values.map_address} />
              </div>
            )}

            <div className="md:col-span-12">
              <label htmlFor="nearby_landmarks" className="block text-sm font-medium text-[#F5EFE7] mb-1">Nearby Landmarks</label>
              <textarea id="nearby_landmarks" name="nearby_landmarks" rows={3} className="w-full px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]" placeholder="Enter nearby landmarks" {...formik.getFieldProps("nearby_landmarks")}></textarea>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Property Features</h2>
              <p className="text-[#F5EFE7] text-sm mb-4">Add property features like Modular Kitchen, Wooden Flooring, etc.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPropertyFeature())}
                  className="flex-1 px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]"
                  placeholder="Enter a feature"
                />
                <button type="button" onClick={addPropertyFeature} className="px-4 py-2 bg-[#171C24] hover:bg-[#171C24] text-[#F5EFE7] rounded transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-[#171C24] border border-[#5B6475] px-3 py-1 rounded-full text-sm text-[#F5EFE7]">
                    <span className="text-[#F5EFE7]">{feature}</span>
                    <button type="button" onClick={() => removePropertyFeature(index)} className="text-[#C6A256] hover:text-[#C6A256]"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Facilities</h2>
              <p className="text-[#F5EFE7] text-sm mb-4">Add facilities like Swimming Pool, Gym, 24x7 Security, etc.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                  className="flex-1 px-3 py-2 bg-[#171C24] border border-[#5B6475] rounded text-[#F5EFE7] placeholder:text-[#AAB4C5] focus:outline-none focus:ring-2 focus:ring-[#C6A256]"
                  placeholder="Enter a facility"
                />
                <button type="button" onClick={addFacility} className="px-4 py-2 bg-[#171C24] hover:bg-[#171C24] text-[#F5EFE7] rounded transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2 bg-[#171C24] border border-[#5B6475] px-3 py-1 rounded-full text-sm text-[#F5EFE7]">
                    <span className="text-[#F5EFE7]">{facility}</span>
                    <button type="button" onClick={() => removeFacility(index)} className="text-[#C6A256] hover:text-[#C6A256]"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold text-[#F5EFE7] mb-4 pb-2 border-b border-[#5B6475] mt-6">Property Images</h2>
              <p className="text-[#F5EFE7] text-sm mb-4">Upload images of your property (exterior, living room, bedrooms, bathrooms, kitchen, others)</p>
              <div className="flex flex-wrap gap-4 mb-4">
                {images?.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 bg-[#171C24] rounded-lg overflow-hidden border border-[#5B6475]">
                    <img src={img.url} alt={`Property image ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-[#171C24]/70 rounded-full p-1 cursor-pointer">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#171C24] rounded-lg border border-dashed border-[#5B6475] cursor-pointer hover:bg-[#171C24]">
                  <Plus className="h-6 w-6 mb-1 text-white" />
                  <span className="text-xs text-white">Add Image</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="md:col-span-12 mt-6">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#171C24] hover:bg-[#171C24] text-[#F5EFE7] font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin"><Loader /></div>
                ) : (
                  isEditMode ? "Update Property" : "Submit Property"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialTab="sendOtp" />
    </div>
  );
}
