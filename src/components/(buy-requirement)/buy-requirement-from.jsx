"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Loader } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAddBuyRequirementMutation } from "@/service/buyRequirementApi"

const validationSchema = Yup.object({
    city: Yup.string().required("City is required"),
    min_price: Yup.string().required("Number of min_price is required"),
    max_price: Yup.string().required("Number of max_price is required"),
    possession_status: Yup.string().required("possession status is required"),
    min_carpet_area: Yup.string().required("Number of min_carpet_area is required"),
    max_carpet_area: Yup.string().required("Number of max_carpet_area is required"),
    min_bedrooms: Yup.string().required("Number of min_bedrooms is required"),
});

export default function BuyRequirementForm({ property_type }) {
    const router = useRouter();
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
            min_bedrooms: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await addBuyRequirement({ ...values, property_type }).unwrap();
                toast.success(response?.message);
                router.push("/post-buy-requirement");
            } catch (err) {
                console.error(err);
                toast.error(err?.data?.message || "Something went wrong");
            }
        }
    });


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#1a1333] to-[#0d0a1a] rounded-lg shadow-lg p-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        <div className="md:col-span-12">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[#2a1f45]">Basic Information</h2>
                        </div>

                        <div className="md:col-span-6">
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

                        <div className="md:col-span-6">
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

                        <div className="md:col-span-6">
                            <label htmlFor="min_price" className="block text-sm font-medium text-gray-300 mb-1">
                                Min Price
                            </label>
                            <input
                                type="number"
                                id="min_price"
                                name="min_price"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.min_price && formik.errors.min_price ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("min_price")}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="max_price" className="block text-sm font-medium text-gray-300 mb-1">
                                Max Price
                            </label>
                            <input
                                type="number"
                                id="max_price"
                                name="max_price"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.max_price && formik.errors.max_price ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("max_price")}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="min_carpet_area" className="block text-sm font-medium text-gray-300 mb-1">
                                Min Carpet Area
                            </label>
                            <input
                                type="number"
                                id="min_carpet_area"
                                name="min_carpet_area"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.min_carpet_area && formik.errors.min_carpet_area ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("min_carpet_area")}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="max_carpet_area" className="block text-sm font-medium text-gray-300 mb-1">
                                Max Carpet Area
                            </label>
                            <input
                                type="number"
                                id="max_carpet_area"
                                name="max_carpet_area"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.max_carpet_area && formik.errors.max_carpet_area ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("max_carpet_area")}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="min_bedrooms" className="block text-sm font-medium text-gray-300 mb-1">
                                Min Bedrooms
                            </label>
                            <input
                                type="number"
                                id="min_bedrooms"
                                name="min_bedrooms"
                                className={`w-full px-3 py-2 bg-[#2a1f45] border ${formik.touched.min_bedrooms && formik.errors.min_bedrooms ? "border-red-500" : "border-[#3a2a5a]"
                                    } rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                                placeholder="Enter super area"
                                {...formik.getFieldProps("min_bedrooms")}
                            />
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


                        <div className="md:col-span-12 mt-6">
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
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
        </div>
    )
}
