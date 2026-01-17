import { useSignUpMutation } from "@/service/authApi";
import { useFormik } from "formik";
import { Loader, X } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";

function SignupForm({ setActiveTab, onClose }) {
  const [signUp, { isLoading }] = useSignUpMutation();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_no: "",
      company_name: "",
      city: "",
      role: "customer",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      mobile_no: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile Number is required"),
      company_name: Yup.string().required("Company Name is required"),
      city: Yup.string().required("City is required"),
      role: Yup.string().oneOf(["customer", "agent"], "Select a valid role").required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await signUp({ ...values }).unwrap();
        if (response?.status) {
          toast.success(response?.message || "Customer created successfully");
          setActiveTab("sendOtp");
        }
      } catch (err) {
        toast.error(err?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Welcome to RX100 Signup</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your first name"
              {...formik.getFieldProps("first_name")}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <div className="text-red-500 text-sm">{formik.errors.first_name}</div>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your last name"
              {...formik.getFieldProps("last_name")}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="text-red-500 text-sm">{formik.errors.last_name}</div>
            )}
          </div>

          <div className="col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>


          <div className="col-span-2">
            <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-300 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile_no"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your mobile number"
              {...formik.getFieldProps("mobile_no")}
            />
            {formik.touched.mobile_no && formik.errors.mobile_no && (
              <div className="text-red-500 text-sm">{formik.errors.mobile_no}</div>
            )}
          </div>

          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your company name"
              {...formik.getFieldProps("company_name")}
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <div className="text-red-500 text-sm">{formik.errors.company_name}</div>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              placeholder="Enter your city"
              {...formik.getFieldProps("city")}
            />
            {formik.touched.city && formik.errors.city && (
              <div className="text-red-500 text-sm">{formik.errors.city}</div>
            )}
          </div>

          <div className="col-span-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 bg-[#2a1f45] border border-[#3a2a5a] rounded text-white"
              {...formik.getFieldProps("role")}
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="builder">Builder</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-12 flex items-center justify-center cursor-pointer`}
        >
          {isLoading ? (
            <div className="animate-spin">
              <Loader />
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
