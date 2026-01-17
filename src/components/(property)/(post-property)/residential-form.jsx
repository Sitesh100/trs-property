"use client"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Upload, X, Plus, Loader } from "lucide-react"
import { useAddAndEditBothPropertyMutation, useAddPropertyMutation, useGetSinglePropertyQuery, useUploadPropertyDocumentMutation, useUploadPropertyImageMutation } from "@/service/propertyApi"
import toast from "react-hot-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { basedUrl } from "@/libs/based-url"

const validationSchema = Yup.object({
    title: Yup.string().required("Property title is required"),
    city: Yup.string().required("City is required"),
    project_name: Yup.string().required("Project/Society name is required"),
    expected_price: Yup.number().required("Expected price is required").positive("Price must be positive"),
    booking_amount: Yup.number().positive("Amount must be positive"),
    priceNegotiable: Yup.boolean(),
    carpet_area: Yup.number().required("Carpet area is required").positive("Area must be positive"),
    super_area: Yup.number().positive("Area must be positive"),
    bedrooms: Yup.string().required("Number of bedrooms is required"),
    bathrooms: Yup.string().required("Number of bathrooms is required"),
    balconies: Yup.string().required("Number of balconies is required"),
    possession_status: Yup.string().required("Possession status is required"),
    property_post_status: Yup.string().required("Property Post status is required"),
    availableFromMonth: Yup.string().when("possession_status", {
        is: "Under Construction",
        then: () => Yup.string().required("Month is required"),
        otherwise: () => Yup.string(),
    }),
    availableFromYear: Yup.string().when("possession_status", {
        is: "Under Construction",
        then: () => Yup.string().required("Year is required"),
        otherwise: () => Yup.string(),
    }),
    rera_id: Yup.string(),
    nearby_landmarks: Yup.string(),
    builder_name: Yup.string(),
});

export default function ResidentialForm({ property_type }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [addAndEditBothProperty, { isLoading }] = useAddAndEditBothPropertyMutation();
    const [uploadPropertyImage, { isLoading: isLoadingUploadImage }] = useUploadPropertyImageMutation();
    const [uploadPropertyDocument, { isLoading: isLoadingUploadDocument }] = useUploadPropertyDocumentMutation();
    const { data } = useGetSinglePropertyQuery(id, { skip: !id });
    const property = data?.data?.[0] || {};
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (property?.id) {
            const formattedImages = (property?.images || [])?.map(img => ({
                url: basedUrl + img,
                fromApi: true,
            }));
            const formattedDocuments = (property?.documents || [])?.map(doc => ({
                url: basedUrl + doc,
                name: doc.split("/").pop(),
                fromApi: true,
            }));
            setImages(formattedImages);
            setDocuments(formattedDocuments);
        }
    }, [property]);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: property?.title || "",
            city: property?.city || "",
            project_name: property?.project_name || "",
            expected_price: property?.expected_price || "",
            booking_amount: property?.booking_amount || "",
            priceNegotiable: property?.is_price_negotiable || false,
            carpet_area: property?.carpet_area || "",
            super_area: property?.super_area || "",
            bedrooms: property?.bedrooms || "",
            bathrooms: property?.bathrooms || "",
            balconies: String(property?.balconies) || "",
            possession_status: property?.possession_status || "",
            property_post_status: property?.property_post_status || "",
            availableFromMonth: "",
            availableFromYear: "",
            rera_id: property?.rera_id || "",
            nearby_landmarks: property?.nearby_landmarks || "",
            builder_name: property?.builder_name || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (images?.length > 0 && documents?.length > 0) {
                    const response = await addAndEditBothProperty({ ...values, property_type, id }).unwrap();
                    const propertyId = response?.data?.id;
                    if (images?.length > 0) {
                        for (const img of images) {
                            if (img?.file) {
                                const imageForm = new FormData();
                                imageForm.append("property", propertyId);
                                imageForm.append("image", img?.file);
                                await uploadPropertyImage({ imageForm });
                            }
                        }
                    }
                    if (documents?.length > 0) {
                        for (const doc of documents) {
                            if (doc?.file) {
                                const docForm = new FormData();
                                docForm.append("property", propertyId);
                                docForm.append("document", doc?.file);
                                await uploadPropertyDocument({ docForm });
                            }
                        }
                    }
                    toast.success(response?.message);
                    router.push("/post-property");
                } else {
                    toast.error("Please upload at least one image and one document.");
                }
            } catch (err) {
                console.error(err);
                toast.error(err?.data?.message || "Something went wrong");
            }
        }
    });

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const uploadedImages = newFiles?.map(file => ({
                file,
                url: URL.createObjectURL(file),
                fromApi: false,
            }));
            setImages(prev => [...prev, ...uploadedImages]);
        }
    };

    const handleDocumentUpload = (e) => {
        if (e.target.files) {
            const newDocs = Array.from(e.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file),
                name: file.name,
                fromApi: false,
            }));
            setDocuments(prev => [...prev, ...newDocs]);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#1a1333] to-[#0d0a1a] rounded-lg shadow-lg p-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">Basic Information</h2>
                        </div>

                        <div className="md:col-span-6 space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                                    Property Title*
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.title && formik.errors.title
                                        ? "border-red-500"
                                        : "border-[#3a2a5a]"
                                        } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                    placeholder="Enter a catchy title for your property"
                                    {...formik.getFieldProps("title")}
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                                    City*
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.city && formik.errors.city ? "border-red-500" : "border-[#3a2a5a]"
                                        } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                    placeholder="Enter city name"
                                    {...formik.getFieldProps("city")}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-6 space-y-4">
                            <div>
                                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-300 mb-1">
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
                                <label htmlFor="project_name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Project/Society Name*
                                </label>
                                <input
                                    type="text"
                                    id="project_name"
                                    name="project_name"
                                    className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.project_name && formik.errors.project_name ? "border-red-500" : "border-[#3a2a5a]"
                                        } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                    placeholder="Enter project or society name"
                                    {...formik.getFieldProps("project_name")}
                                />
                                {formik.touched.project_name && formik.errors.project_name && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.project_name}</div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="possession_status" className="block text-sm font-medium text-gray-300 mb-1">
                                Possession Status*
                            </label>
                            <select
                                id="possession_status"
                                name="possession_status"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.possession_status && formik.errors.possession_status
                                    ? "border-red-500"
                                    : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                {...formik.getFieldProps("possession_status")}
                            >
                                <option value="">Select Status</option>
                                <option value="ready_to_move">Ready to Move</option>
                                <option value="under_construction">Under Construction</option>
                            </select>
                            {formik.touched.possession_status && formik.errors.possession_status && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.possession_status}</div>
                            )}
                        </div>


                        <div className="md:col-span-6">
                            <label htmlFor="property_post_status" className="block text-sm font-medium text-gray-300 mb-1">
                                Property Post Status
                            </label>
                            <select
                                id="property_post_status"
                                name="property_post_status"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.property_post_status && formik.errors.property_post_status
                                    ? "border-red-500"
                                    : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                {...formik.getFieldProps("property_post_status")}
                            >
                                <option value="">Select Status</option>
                                <option value="buy">Buy</option>
                                <option value="rent">Rent</option>
                                <option value="project">Project</option>
                            </select>
                            {formik.touched.property_post_status && formik.errors.property_post_status && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.property_post_status}</div>
                            )}
                        </div>

                        {formik.values.possession_status === "Under Construction" && (
                            <>
                                <div className="md:col-span-3">
                                    <label htmlFor="availableFromMonth" className="block text-sm font-medium text-gray-300 mb-1">
                                        Available From - Month*
                                    </label>
                                    <select
                                        id="availableFromMonth"
                                        name="availableFromMonth"
                                        className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.availableFromMonth && formik.errors.availableFromMonth
                                            ? "border-red-500"
                                            : "border-[#3a2a5a]"
                                            } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                        {...formik.getFieldProps("availableFromMonth")}
                                    >
                                        <option value="">Select Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label htmlFor="availableFromYear" className="block text-sm font-medium text-gray-300 mb-1">
                                        Available From - Year*
                                    </label>
                                    <select
                                        id="availableFromYear"
                                        name="availableFromYear"
                                        className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.availableFromYear && formik.errors.availableFromYear
                                            ? "border-red-500"
                                            : "border-[#3a2a5a]"
                                            } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                        {...formik.getFieldProps("availableFromYear")}
                                    >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                            <option key={year} value={year.toString()}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">Price Details</h2>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="expected_price" className="block text-sm font-medium text-gray-300 mb-1">
                                Expected Price (₹)*
                            </label>
                            <input
                                type="number"
                                id="expected_price"
                                name="expected_price"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.expected_price && formik.errors.expected_price
                                    ? "border-red-500"
                                    : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter expected price"
                                {...formik.getFieldProps("expected_price")}
                            />
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="booking_amount" className="block text-sm font-medium text-gray-300 mb-1">
                                Booking/Token Amount (₹)
                            </label>
                            <input
                                type="number"
                                id="booking_amount"
                                name="booking_amount"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.booking_amount && formik.errors.booking_amount
                                    ? "border-red-500"
                                    : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter booking amount"
                                {...formik.getFieldProps("booking_amount")}
                            />
                        </div>

                        <div className="md:col-span-4 flex items-end">
                            <div className="flex items-center w-full h-10">
                                <label htmlFor="priceNegotiable" className="flex items-center cursor-pointer">
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
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="ml-2 block text-sm text-gray-300">Price Negotiable</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">Area Details</h2>
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="carpet_area" className="block text-sm font-medium text-gray-300 mb-1">
                                Carpet Area (sq ft)*
                            </label>
                            <input
                                type="number"
                                id="carpet_area"
                                name="carpet_area"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.carpet_area && formik.errors.carpet_area ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter carpet area"
                                {...formik.getFieldProps("carpet_area")}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="super_area" className="block text-sm font-medium text-gray-300 mb-1">
                                Super Area (sq ft)
                            </label>
                            <input
                                type="number"
                                id="super_area"
                                name="super_area"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.super_area && formik.errors.super_area ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("super_area")}
                            />
                        </div>

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">Room Details</h2>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300 mb-1">
                                Bedrooms*
                            </label>
                            <select
                                id="bedrooms"
                                name="bedrooms"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.bedrooms && formik.errors.bedrooms ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                {...formik.getFieldProps("bedrooms")}
                            >
                                <option value="">Select Bedrooms</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300 mb-1">
                                Bathrooms*
                            </label>
                            <select
                                id="bathrooms"
                                name="bathrooms"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.bathrooms && formik.errors.bathrooms ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                {...formik.getFieldProps("bathrooms")}
                            >
                                <option value="">Select Bathrooms</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="balconies" className="block text-sm font-medium text-gray-300 mb-1">
                                Balconies*
                            </label>
                            <select
                                id="balconies"
                                name="balconies"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.balconies && formik.errors.balconies ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                {...formik.getFieldProps("balconies")}
                            >
                                <option value="">Select Balconies</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">Additional Details</h2>
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="rera_id" className="block text-sm font-medium text-gray-300 mb-1">
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
                            <label htmlFor="builder_name" className="block text-sm font-medium text-gray-300 mb-1">
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
                            <label htmlFor="nearby_landmarks" className="block text-sm font-medium text-gray-300 mb-1">
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
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45] mt-6">Property Images</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Upload images of your property (exterior, living room, bedrooms, bathrooms, kitchen, others)
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

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">Property Documents</h2>
                            <p className="text-gray-400 text-sm mb-4">Upload floor plan, master plan, location map</p>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {documents?.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="relative w-24 h-24 bg-[#2a1f45] rounded-lg overflow-hidden border border-[#3a2a5a] flex flex-col items-center justify-center p-2"
                                    >
                                        <Upload className="h-6 w-6 mb-1 text-white" />
                                        <span className="text-xs text-center truncate w-full text-white">{doc.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="absolute top-1 right-1 bg-black/70 rounded-full p-1 cursor-pointer"
                                        >
                                            <X className="h-3 w-3 text-white" />
                                        </button>
                                    </div>
                                ))}

                                <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#2a1f45] rounded-lg border border-dashed border-[#3a2a5a] cursor-pointer hover:bg-[#3a2a5a]">
                                    <Plus className="h-6 w-6 mb-1 text-white" />
                                    <span className="text-xs text-white">Add Document</span>
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
                                disabled={isLoading || isLoadingUploadImage || isLoadingUploadDocument}
                                type="submit"
                                className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                            >
                                {isLoading || isLoadingUploadImage || isLoadingUploadDocument ? (
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
    )
}
