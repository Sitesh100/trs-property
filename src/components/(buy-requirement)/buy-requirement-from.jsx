"use client"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Loader } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAddBuyRequirementMutation } from "@/service/buyRequirementApi"
import { useSelector } from "react-redux"
import AuthModal from "@/components/auth/auth-modal"

const validationSchema = Yup.object({
    requirement_type: Yup.string()
        .oneOf(["BUY", "RENT"], "Select Buy or Rent")
        .required("Buy/Rent is required"),
    city: Yup.string().required("City is required"),
    property_type: Yup.string().required("Property type is required"),
    bhk: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .integer("BHK must be a whole number")
        .min(1, "BHK must be at least 1")
        .when("property_type", {
            is: (value) => value === "flat" || value === "villa",
            then: (schema) => schema,
            otherwise: (schema) => schema.nullable(),
        }),
    min_price: Yup.number()
        .typeError("Min price must be a number")
        .positive("Min price must be positive")
        .required("Min price is required"),
    max_price: Yup.number()
        .typeError("Max price must be a number")
        .positive("Max price must be positive")
        .min(Yup.ref('min_price'), 'Max price must be greater than min price')
        .required("Max price is required"),
    possession_status: Yup.string().required("Possession status is required"),
    min_carpet_area: Yup.number()
        .typeError("Min carpet area must be a number")
        .positive("Min carpet area must be positive")
        .required("Min carpet area is required"),
    max_carpet_area: Yup.number()
        .typeError("Max carpet area must be a number")
        .positive("Max carpet area must be positive")
        .min(Yup.ref('min_carpet_area'), 'Max carpet area must be greater than min carpet area')
        .required("Max carpet area is required"),
});

const propertyTypeOptions = [
    { label: "Flat/Apartment", value: "flat" },
    { label: "Villa", value: "villa" },
    { label: "Plot", value: "plot" },
    { label: "Office Space", value: "office_space" },
    { label: "Shop", value: "shop" },
    { label: "Showroom", value: "showroom" },
    { label: "Warehouse", value: "warehouse" },
]

export default function BuyRequirementForm() {
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const isAuthenticated = !!token;
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [addBuyRequirement, { isLoading }] = useAddBuyRequirementMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            requirement_type: "BUY",
            city: "Indore",
            property_type: "",
            bhk: "",
            min_price: "",
            max_price: "",
            possession_status: "",
            min_carpet_area: "",
            max_carpet_area: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!isAuthenticated) {
                toast.error("Please login to submit buy requirement");
                setPendingSubmit(true);
                setShowAuthModal(true);
                return;
            }

            try {
                const payload = {
                    requirement_type: values.requirement_type,
                    city: values.city,
                    property_type: values.property_type,
                    bhk: values.bhk ? Number(values.bhk) : null,
                    min_price: Number(values.min_price),
                    max_price: Number(values.max_price),
                    min_carpet_area: Number(values.min_carpet_area),
                    max_carpet_area: Number(values.max_carpet_area),
                    possession_status: values.possession_status,
                };

                await addBuyRequirement(payload).unwrap();
                toast.success("Buy requirement submitted successfully!");
                formik.resetForm();
                router.push("/my-buy-requirement");
            } catch (err) {
                console.error("Buy requirement error:", err);
                if (err?.status === 401 || err?.originalStatus === 401) {
                    toast.error("Session expired. Please login again.");
                    setPendingSubmit(true);
                    setShowAuthModal(true);
                } else {
                    toast.error(err?.data?.detail || err?.data?.message || "Failed to submit buy requirement");
                }
            }
        }
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

    const showBhkField = formik.values.property_type === "flat" || formik.values.property_type === "villa";


    return (
        <div className="bg-black">
        <div className="container mx-auto px-4 py-8 bg-black">
            <div className="max-w-4xl mx-auto bg-[#212121] rounded-lg shadow-lg p-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#3A3A3D]">Basic Information</h2>
                        </div>

                        <div className="md:col-span-12">
                            <p className="block text-sm font-medium text-[#F5EFE7] mb-2">Requirement For*</p>
                            <div className="flex flex-wrap gap-6">
                                <label className="inline-flex items-center gap-2 text-[#F5EFE7]">
                                    <input
                                        type="radio"
                                        name="requirement_type"
                                        value="BUY"
                                        checked={formik.values.requirement_type === "BUY"}
                                        onChange={formik.handleChange}
                                        className="accent-[#C6A256]"
                                    />
                                    Buy
                                </label>
                                <label className="inline-flex items-center gap-2 text-[#F5EFE7]">
                                    <input
                                        type="radio"
                                        name="requirement_type"
                                        value="RENT"
                                        checked={formik.values.requirement_type === "RENT"}
                                        onChange={formik.handleChange}
                                        className="accent-[#C6A256]"
                                    />
                                    Rent
                                </label>
                            </div>
                            {formik.touched.requirement_type && formik.errors.requirement_type && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.requirement_type}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="city" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.city && formik.errors.city ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter city name"
                                {...formik.getFieldProps("city")}
                            />
                            {formik.touched.city && formik.errors.city && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.city}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="property_type" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Property Type*
                            </label>
                            <select
                                id="property_type"
                                name="property_type"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.property_type && formik.errors.property_type ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                {...formik.getFieldProps("property_type")}
                            >
                                <option value="">Select property type</option>
                                {propertyTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.property_type && formik.errors.property_type && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.property_type}</div>
                            )}
                        </div>

                        {showBhkField && (
                            <div className="md:col-span-6">
                                <label htmlFor="bhk" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                    BHK (Optional)
                                </label>
                                <input
                                    type="number"
                                    id="bhk"
                                    name="bhk"
                                    min="1"
                                    className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.bhk && formik.errors.bhk ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                        } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                    placeholder="Enter BHK"
                                    {...formik.getFieldProps("bhk")}
                                />
                                {formik.touched.bhk && formik.errors.bhk && (
                                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.bhk}</div>
                                )}
                            </div>
                        )}

                        <div className="md:col-span-6">
                            <label htmlFor="min_price" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Min Price*
                            </label>
                            <input
                                type="number"
                                id="min_price"
                                name="min_price"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.min_price && formik.errors.min_price ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter minimum price"
                                {...formik.getFieldProps("min_price")}
                            />
                            {formik.touched.min_price && formik.errors.min_price && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.min_price}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="max_price" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Max Price*
                            </label>
                            <input
                                type="number"
                                id="max_price"
                                name="max_price"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.max_price && formik.errors.max_price ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter maximum price"
                                {...formik.getFieldProps("max_price")}
                            />
                            {formik.touched.max_price && formik.errors.max_price && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.max_price}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="min_carpet_area" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Min Carpet Area* (sq ft)
                            </label>
                            <input
                                type="number"
                                id="min_carpet_area"
                                name="min_carpet_area"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.min_carpet_area && formik.errors.min_carpet_area ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter minimum carpet area"
                                {...formik.getFieldProps("min_carpet_area")}
                            />
                            {formik.touched.min_carpet_area && formik.errors.min_carpet_area && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.min_carpet_area}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="max_carpet_area" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Max Carpet Area* (sq ft)
                            </label>
                            <input
                                type="number"
                                id="max_carpet_area"
                                name="max_carpet_area"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.max_carpet_area && formik.errors.max_carpet_area ? "border-[#C6A256]" : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter maximum carpet area"
                                {...formik.getFieldProps("max_carpet_area")}
                            />
                            {formik.touched.max_carpet_area && formik.errors.max_carpet_area && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.max_carpet_area}</div>
                            )}
                        </div>

                        <div className="md:col-span-12">
                            <label htmlFor="possession_status" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Possession Status*
                            </label>
                            <select
                                id="possession_status"
                                name="possession_status"
                                className={`w-full px-3 py-2 bg-[#1A1A1C] border ${formik.touched.possession_status && formik.errors.possession_status
                                    ? "border-[#C6A256]"
                                    : "border-[#3A3A3D]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                {...formik.getFieldProps("possession_status")}
                            >
                                <option value="">Select Status</option>
                                <option value="READY_TO_MOVE">Ready to Move</option>
                                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                            </select>
                            {formik.touched.possession_status && formik.errors.possession_status && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.possession_status}</div>
                            )}
                        </div>


                        <div className="md:col-span-12 mt-6">
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-[#1A1A1C] hover:bg-[#27272a] text-[#F5EFE7] font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Submit"
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
        </div>
    )
}
