import { setUser } from '@/redux/authSlice';
import { useProfileUpdateMutation } from '@/service/profileApi';
import { Edit, Loader } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { basedUrl } from '@/libs/based-url';

const ProfileFormPersonal = ({ user }) => {
    const [profileUpdate, { isLoading }] = useProfileUpdateMutation();
    const dispatch = useDispatch();
    const [previewImage, setPreviewImage] = useState(user?.image ? basedUrl + user.image : '/assets/images/profile.png');
    const [imageFile, setImageFile] = useState('');

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            mobile_no: user?.mobile_no || '',
            email: user?.email || '',
            city: user?.city || '',
            company_name: user?.company_name || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            mobile_no: Yup.string()
                .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
                .required('Mobile Number is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            city: Yup.string().required('City is required'),
            company_name: Yup.string().required('Company Name is required'),
        }),
        onSubmit: async (values) => {
            try {
                const formData = {
                    ...values,
                    image: imageFile
                }
                const response = await profileUpdate(formData).unwrap();
                if (response?.status) {
                    toast.success(response?.message);
                    dispatch(setUser(response?.data));
                    setImageFile(null);
                }
            } catch (err) {
                toast.error(err?.data?.message || "Something went wrong");
            }
        },
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Profile"
                            className="md:w-24 w-20 md:h-24 h-20 rounded-full object-cover"
                        />
                        <label
                            htmlFor="profile-upload"
                            className="absolute bottom-0 right-0 bg-[#2a1f45] text-white p-1 rounded-full cursor-pointer hover:bg-[#3a2a5a]"
                        >
                            <Edit size={16} />
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user?.first_name + " " + user?.last_name}</h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm block mb-1">First Name*</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.first_name && formik.errors.first_name ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.first_name && formik.errors.first_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.first_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Last Name*</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.last_name && formik.errors.last_name ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.last_name && formik.errors.last_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.last_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Phone Number*</label>
                        <input
                            type="text"
                            name="mobile_no"
                            value={formik.values.mobile_no}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.mobile_no && formik.errors.mobile_no ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.mobile_no && formik.errors.mobile_no && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.mobile_no}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">City*</label>
                        <input
                            type="text"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.city && formik.errors.city ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.city && formik.errors.city && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Company Name*</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formik.values.company_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.company_name && formik.errors.company_name ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.company_name && formik.errors.company_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.company_name}</div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end items-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-32 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="animate-spin">
                                <Loader />
                            </div>
                        ) : (
                            "Update Profile"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ProfileFormPersonal;

