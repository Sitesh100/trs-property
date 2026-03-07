"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, X, Plus, Loader } from "lucide-react";
import {
  useUploadPropertyImagesMutation,
  useCreatePropertyMutation,
} from "@/service/propertyApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AuthModal from "@/components/auth/auth-modal";

const validationSchema = Yup.object({
  propertyTitle: Yup.string().required("Property title is required"),
  city: Yup.string().required("City is required"),
  locality: Yup.string().required("Locality is required"),
  expectedPrice: Yup.number()
    .required("Expected price is required")
    .positive("Price must be positive"),
  bookingAmount: Yup.number().positive("Amount must be positive"),
  priceNegotiable: Yup.boolean(),
  carpetArea: Yup.number()
    .required("Carpet area is required")
    .positive("Area must be positive"),
  superArea: Yup.number().positive("Area must be positive"),
  furnishedStatus: Yup.string().required("Furnished status is required"),
  cabins: Yup.number().min(0, "Cannot be negative"),
  workstations: Yup.number().min(0, "Cannot be negative"),
  conferenceRooms: Yup.number().min(0, "Cannot be negative"),
  receptionArea: Yup.boolean(),
  pantryType: Yup.string(),
  possessionStatus: Yup.string().required("Possession status is required"),
  availableFromMonth: Yup.string().when("possessionStatus", {
    is: "Under Construction",
    then: () => Yup.string().required("Month is required"),
    otherwise: () => Yup.string(),
  }),
  availableFromYear: Yup.string().when("possessionStatus", {
    is: "Under Construction",
    then: () => Yup.string().required("Year is required"),
    otherwise: () => Yup.string(),
  }),
  currentlyLeased: Yup.boolean(),
  assuredReturns: Yup.boolean(),
  reraId: Yup.string(),
});

export default function CommercialForm({ property_type = "commercial" }) {
  const router = useRouter();
  
  // Check if user is authenticated
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!token;
  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  
  const [images, setImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploadPropertyImages, { isLoading: isUploadingImages }] = useUploadPropertyImagesMutation();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const isLoading = isUploadingImages || isCreating;

  // Listen for successful login/signup to resume form submission
  useEffect(() => {
    const handleResumeSubmit = () => {
      if (pendingSubmit && isAuthenticated) {
        setPendingSubmit(false);
        formik.handleSubmit();
      }
    };

    window.addEventListener('resume-form-submit', handleResumeSubmit);
    return () => window.removeEventListener('resume-form-submit', handleResumeSubmit);
  }, [pendingSubmit, isAuthenticated]);

  const formik = useFormik({
    initialValues: {
      propertyTitle: "",
      city: "",
      locality: "",
      expectedPrice: "",
      bookingAmount: "",
      priceNegotiable: false,
      carpetArea: "",
      superArea: "",
      furnishedStatus: "",
      cabins: "",
      workstations: "",
      conferenceRooms: "",
      receptionArea: false,
      pantryType: "",
      possessionStatus: "",
      availableFromMonth: "",
      availableFromYear: "",
      currentlyLeased: false,
      assuredReturns: false,
      reraId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error("Please login to post a property");
        setPendingSubmit(true);
        setShowAuthModal(true);
        return;
      }

      try {
        if (uploadedImageUrls.length === 0) {
          toast.error("Please upload at least one image.");
          return;
        }

        const propertyPayload = {
          title: values.propertyTitle,
          property_type,
          map_location: values.locality,
          city: values.city,
          price: values.expectedPrice ? parseFloat(values.expectedPrice) : 0,
          expected_price: values.expectedPrice ? parseFloat(values.expectedPrice) : 0,
          booking_amount: values.bookingAmount ? parseFloat(values.bookingAmount) : 0,
          is_price_negotiable: values.priceNegotiable,
          carpet_area: values.carpetArea ? parseFloat(values.carpetArea) : null,
          super_area: values.superArea ? parseFloat(values.superArea) : null,
          size: values.superArea ? parseFloat(values.superArea) : parseFloat(values.carpetArea),
          possession_status: values.possessionStatus || null,
          furnished_status: values.furnishedStatus || null,
          rera_id: values.reraId || "",
          status: "Sell",
          image: uploadedImageUrls.join(","),
        };

        const response = await createProperty(propertyPayload).unwrap();
        toast.success(response?.message || "Property created successfully!");
        router.push("/my-property");
      } catch (error) {
        console.error(error);
        
        // Handle 401 Unauthorized - token expired or invalid
        if (error?.status === 401 || error?.originalStatus === 401) {
          toast.error("Session expired. Please login again.");
          setPendingSubmit(true);
          setShowAuthModal(true);
        } else {
          toast.error(error?.data?.detail || error?.data?.message || "Something went wrong");
        }
      }
    },
  });

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

        if (!uploadedUrl) {
          continue;
        }

        uploadedImages.push({
          uploadedUrl,
          url: URL.createObjectURL(image),
          name: image.name,
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
      console.error(error);
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  const handleDocumentUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments((prev) => [...prev, ...newFiles]);
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

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
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
                  htmlFor="propertyTitle"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Property Title*
                </label>
                <input
                  type="text"
                  id="propertyTitle"
                  name="propertyTitle"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.propertyTitle && formik.errors.propertyTitle
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter office space title"
                  {...formik.getFieldProps("propertyTitle")}
                />
                {formik.touched.propertyTitle &&
                  formik.errors.propertyTitle && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.propertyTitle}
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

              <div>
                <label
                  htmlFor="locality"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Locality*
                </label>
                <input
                  type="text"
                  id="locality"
                  name="locality"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.locality && formik.errors.locality
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  placeholder="Enter business district/locality"
                  {...formik.getFieldProps("locality")}
                />
                {formik.touched.locality && formik.errors.locality && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.locality}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="possessionStatus"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Possession Status*
                </label>
                <select
                  id="possessionStatus"
                  name="possessionStatus"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.possessionStatus &&
                    formik.errors.possessionStatus
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  {...formik.getFieldProps("possessionStatus")}
                >
                  <option value="">Select Status</option>
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
                {formik.touched.possessionStatus &&
                  formik.errors.possessionStatus && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.possessionStatus}
                    </div>
                  )}
              </div>

              {formik.values.possessionStatus === "Under Construction" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="availableFromMonth"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Available Month*
                    </label>
                    <select
                      id="availableFromMonth"
                      name="availableFromMonth"
                      className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                        formik.touched.availableFromMonth &&
                        formik.errors.availableFromMonth
                          ? "border-red-500"
                          : "border-[#3a2a5a]"
                      } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      {...formik.getFieldProps("availableFromMonth")}
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      {/* ... other months ... */}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="availableFromYear"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Available Year*
                    </label>
                    <select
                      id="availableFromYear"
                      name="availableFromYear"
                      className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                        formik.touched.availableFromYear &&
                        formik.errors.availableFromYear
                          ? "border-red-500"
                          : "border-[#3a2a5a]"
                      } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      {...formik.getFieldProps("availableFromYear")}
                    >
                      <option value="">Select Year</option>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() + i,
                      ).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="furnishedStatus"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Furnished Status*
                </label>
                <select
                  id="furnishedStatus"
                  name="furnishedStatus"
                  className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                    formik.touched.furnishedStatus &&
                    formik.errors.furnishedStatus
                      ? "border-red-500"
                      : "border-[#3a2a5a]"
                  } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                  {...formik.getFieldProps("furnishedStatus")}
                >
                  <option value="">Select Status</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Price Details
              </h2>
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="expectedPrice"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Expected Price (₹)*
              </label>
              <input
                type="number"
                id="expectedPrice"
                name="expectedPrice"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.expectedPrice && formik.errors.expectedPrice
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter expected price"
                {...formik.getFieldProps("expectedPrice")}
              />
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor="bookingAmount"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Booking/Token Amount (₹)
              </label>
              <input
                type="number"
                id="bookingAmount"
                name="bookingAmount"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.bookingAmount && formik.errors.bookingAmount
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter booking amount"
                {...formik.getFieldProps("bookingAmount")}
              />
            </div>

            <div className="md:col-span-4 flex flex-col justify-end">
              <label
                htmlFor="priceNegotiable"
                className="flex items-center h-10 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="priceNegotiable"
                  name="priceNegotiable"
                  className="sr-only"
                  {...formik.getFieldProps("priceNegotiable")}
                />
                <div className="w-5 h-5 rounded-md border-2 border-[#2a1f45] flex items-center justify-center transition-all duration-200 bg-white">
                  {formik.values.priceNegotiable && (
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

            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center cursor-pointer">
                <label htmlFor="currentlyLeased" className="flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyLeased"
                    name="currentlyLeased"
                    className="sr-only"
                    {...formik.getFieldProps("currentlyLeased")}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-[#2a1f45] flex items-center justify-center transition-all duration-200 bg-white">
                    {formik.values.currentlyLeased && (
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
                  <span className="ml-2 text-sm text-gray-300">
                    Currently Leased Out
                  </span>
                </label>
              </div>
              <div className="flex items-center cursor-pointer mt-2">
                <label htmlFor="assuredReturns" className="flex items-center">
                  <input
                    type="checkbox"
                    id="assuredReturns"
                    name="assuredReturns"
                    className="sr-only"
                    {...formik.getFieldProps("assuredReturns")}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-[#2a1f45] flex items-center justify-center transition-all duration-200 bg-white">
                    {formik.values.assuredReturns && (
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
                  <span className="ml-2 text-sm text-gray-300">
                    Assured Returns
                  </span>
                </label>
              </div>
              <div className="flex items-center cursor-pointer mt-2">
                <label htmlFor="receptionArea" className="flex items-center">
                  <input
                    type="checkbox"
                    id="receptionArea"
                    name="receptionArea"
                    className="sr-only"
                    {...formik.getFieldProps("receptionArea")}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-[#2a1f45] flex items-center justify-center transition-all duration-200 bg-white">
                    {formik.values.receptionArea && (
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
                  <span className="ml-2 text-sm text-gray-300">
                    Reception Area
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
                htmlFor="carpetArea"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Carpet Area (sq ft)*
              </label>
              <input
                type="number"
                id="carpetArea"
                name="carpetArea"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.carpetArea && formik.errors.carpetArea
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter carpet area"
                {...formik.getFieldProps("carpetArea")}
              />
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor="superArea"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Super Area (sq ft)
              </label>
              <input
                type="number"
                id="superArea"
                name="superArea"
                className={`w-full px-3 py-2 bg-[#2a1f45] border ${
                  formik.touched.superArea && formik.errors.superArea
                    ? "border-red-500"
                    : "border-[#3a2a5a]"
                } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                placeholder="Enter super area"
                {...formik.getFieldProps("superArea")}
              />
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Office Features
              </h2>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="cabins"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Number of Cabins
                </label>
                <input
                  type="number"
                  id="cabins"
                  name="cabins"
                  className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter number of cabins"
                  {...formik.getFieldProps("cabins")}
                />
              </div>

              <div>
                <label
                  htmlFor="workstations"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Number of Workstations
                </label>
                <input
                  type="number"
                  id="workstations"
                  name="workstations"
                  className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter number of workstations"
                  {...formik.getFieldProps("workstations")}
                />
              </div>
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="conferenceRooms"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Number of Conference Rooms
                </label>
                <input
                  type="number"
                  id="conferenceRooms"
                  name="conferenceRooms"
                  className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter number of conference rooms"
                  {...formik.getFieldProps("conferenceRooms")}
                />
              </div>

              <div>
                <label
                  htmlFor="pantryType"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Pantry/Cafeteria
                </label>
                <select
                  id="pantryType"
                  name="pantryType"
                  className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  {...formik.getFieldProps("pantryType")}
                >
                  <option value="">Select Option</option>
                  <option value="Dry">Dry</option>
                  <option value="Wet">Wet</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Additional Details
              </h2>
            </div>

            <div className="md:col-span-12">
              <label
                htmlFor="reraId"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                RERA ID
              </label>
              <input
                type="text"
                id="reraId"
                name="reraId"
                className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter RERA ID"
                {...formik.getFieldProps("reraId")}
              />
            </div>

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">
                Property Images
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Upload images of your office space (interior, exterior,
                workstations, cabins, etc.)
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-[#2a1f45] rounded-lg overflow-hidden border border-[#3a2a5a]"
                  >
                    <img
                      src={file?.url || "/placeholder.svg"}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
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

            <div className="md:col-span-12">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">
                Property Documents
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Upload floor plan, master plan, location map
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-[#2a1f45] rounded-lg overflow-hidden border border-[#3a2a5a] flex flex-col items-center justify-center p-2"
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center truncate w-full">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#2a1f45] rounded-lg border border-dashed border-[#3a2a5a] cursor-pointer hover:bg-[#3a2a5a]">
                  <Plus className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add Document</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleDocumentUpload}
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
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="sendOtp"
      />
    </div>
  );
}
