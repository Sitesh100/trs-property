import { useSendOtpMutation } from "@/service/authApi";
import { useFormik } from "formik";
import { Loader, X } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";

function SendOtpForm({ onClose, setSendOtpInfo, setActiveTab }) {
    const [sendOtp, { isLoading }] = useSendOtpMutation();

    const formik = useFormik({
        initialValues: {
            phone: "",
            role: "",
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
                .required("Mobile Number is required"),
            role: Yup.string().oneOf(["customer", "agent", "builder"], "Select a valid role").required("Role is required"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await sendOtp(values).unwrap();
                toast.success(response?.message);
                setSendOtpInfo({
                    phone: values?.phone,
                    role: values?.role
                });
                setActiveTab("verifyOtp");
            } catch (err) {
                console.log(err);
                toast.error(err?.data?.message || 'Something went wrong');
            }
        },
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Welcome to RX100 Send Otp</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        id="phone"
                        maxLength={10}
                        className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white focus:outline-none"
                        placeholder="Enter 10-digit phone number"
                        {...formik.getFieldProps("phone")}
                    />
                    {formik.errors.phone && (
                        <div className="text-red-500 text-sm">{formik.errors.phone}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                        Role
                    </label>
                    <select
                        id="role"
                        className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
                        {...formik.getFieldProps("role")}
                    >
                        <option value="">Select Role</option>
                        <option value="customer">Customer</option>
                        <option value="agent">Agent</option>
                        <option value="builder">Builder</option>
                    </select>
                    {formik.errors.role && (
                        <div className="text-red-500 text-sm">{formik.errors.role}</div>
                    )}
                </div>


                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                >
                    {isLoading ? (
                        <div className="animate-spin">
                            <Loader />
                        </div>
                    ) : (
                        "Send Otp"
                    )}
                </button>
            </form >
        </div >
    );
}

export default SendOtpForm;
