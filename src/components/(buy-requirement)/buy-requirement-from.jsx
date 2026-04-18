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
    city: Yup.string().required("City is required"),
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

export default function BuyRequirementForm({ property_type }) {
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const isAuthenticated = !!token;
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);
    const [addBuyRequirement, { isLoading }] = useAddBuyRequirementMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            city: "",
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
                await addBuyRequirement({ ...values, property_type }).unwrap();
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


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#212121] to-[#212121] rounded-lg shadow-lg p-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#212121]">Basic Information</h2>
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="city" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                City*
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.city && formik.errors.city ? "border-[#C6A256]" : "border-[#212121]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                placeholder="Enter city name"
                                {...formik.getFieldProps("city")}
                            />
                            {formik.touched.city && formik.errors.city && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.city}</div>
                            )}
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="propertyType" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Property Type*
                            </label>
                            <input
                                type="text"
                                className={`w-full px-3 py-2 bg-[#504e4e] border border-[#212121] rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                disabled
                                value={property_type}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="min_price" className="block text-sm font-medium text-[#F5EFE7] mb-1">
                                Min Price*
                            </label>
                            <input
                                type="number"
                                id="min_price"
                                name="min_price"
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.min_price && formik.errors.min_price ? "border-[#C6A256]" : "border-[#212121]"
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
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.max_price && formik.errors.max_price ? "border-[#C6A256]" : "border-[#212121]"
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
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.min_carpet_area && formik.errors.min_carpet_area ? "border-[#C6A256]" : "border-[#212121]"
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
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.max_carpet_area && formik.errors.max_carpet_area ? "border-[#C6A256]" : "border-[#212121]"
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
                                className={`w-full px-3 py-2 bg-[#504e4e] border ${formik.touched.possession_status && formik.errors.possession_status
                                    ? "border-[#C6A256]"
                                    : "border-[#212121]"
                                    } rounded text-[#F5EFE7] focus:outline-none focus:ring-2 focus:ring-[#C6A256]`}
                                {...formik.getFieldProps("possession_status")}
                            >
                                <option value="">Select Status</option>
                                <option value="ready-to-move">Ready to Move</option>
                                <option value="under_construction">Under Construction</option>
                            </select>
                            {formik.touched.possession_status && formik.errors.possession_status && (
                                <div className="text-[#C6A256] text-xs mt-1">{formik.errors.possession_status}</div>
                            )}
                        </div>


                        <div className="md:col-span-12 mt-6">
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-[#5f5d5d] hover:bg-[#8f8e8e] text-[#F5EFE7] font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="animate-spin">
                                        <Loader />
                                    </div>
                                ) : (
                                    "Submit Buy Requirement"
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
    )
}
