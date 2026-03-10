import { setUser } from '@/redux/authSlice';
import { useGetCustomerProfileQuery, useUpdateCustomerProfileMutation } from '@/service/profileApi';
import { useUploadProfileImageMutation } from '@/service/authApi';
import { Edit, Loader } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const ProfileFormPersonal = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    
    // Fetch customer profile
    const { data: profileData, isLoading: isLoadingProfile, refetch } = useGetCustomerProfileQuery(undefined, {
        skip: !token, // Skip query if no token
    });
    
    const [updateProfile, { isLoading: isUpdating }] = useUpdateCustomerProfileMutation();
    const [uploadProfileImage, { isLoading: isUploadingImage }] = useUploadProfileImageMutation();
    
    const [previewImage, setPreviewImage] = useState('/assets/images/profile.png');
    const [imageFile, setImageFile] = useState('');

    // Update form when profile data is loaded
    useEffect(() => {
        if (profileData) {
            formik.setValues({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
                city: profileData.city || '',
                company_name: profileData.company_name || '',
            });
            
            // Update profile image preview if available
            if (profileData.profile_image_url) {
                setPreviewImage(profileData.profile_image_url);
            }
            
            // Update user in Redux store
            dispatch(setUser(profileData));
        }
    }, [profileData]);

    const formik = useFormik({
        initialValues: {
            full_name: '',
            phone: '',
            city: '',
            company_name: '',
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Full Name is required'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
                .required('Phone Number is required'),
            city: Yup.string().required('City is required'),
            company_name: Yup.string().optional(),
        }),
        onSubmit: async (values) => {
            try {
                const response = await updateProfile(values).unwrap();
                toast.success("Profile updated successfully!");
                
                // Update user in Redux store
                dispatch(setUser(response));
                
                // Refetch profile data
                refetch();
            } catch (err) {
                console.error("Profile update error:", err);
                toast.error(err?.data?.detail || err?.data?.message || "Failed to update profile");
            }
        },
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show preview immediately
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload image to server
            try {
                const response = await uploadProfileImage(file).unwrap();
                toast.success("Profile image uploaded successfully!");
                
                // Refetch profile data to get updated image URL
                refetch();
            } catch (err) {
                console.error("Profile image upload error:", err);
                toast.error(err?.data?.detail || err?.data?.message || "Failed to upload profile image");
            }
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin w-8 h-8 text-[#2a1f45]" />
            </div>
        );
    }

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
                            className={`absolute bottom-0 right-0 bg-[#2a1f45] text-white p-1 rounded-full cursor-pointer hover:bg-[#3a2a5a] ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploadingImage ? (
                                <Loader size={16} className="animate-spin" />
                            ) : (
                                <Edit size={16} />
                            )}
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={isUploadingImage}
                            />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{profileData?.full_name || "User"}</h3>
                        <p className="text-sm text-gray-600">{profileData?.email || ""}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm block mb-1">Full Name*</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.full_name && formik.errors.full_name ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.full_name && formik.errors.full_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.full_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Phone Number*</label>
                        <input
                            type="text"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
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
                        <label className="text-sm block mb-1">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formik.values.company_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your company name"
                            className={`w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black ${formik.touched.company_name && formik.errors.company_name ? 'border-red-500' : ''
                                }`}
                        />
                        {formik.touched.company_name && formik.errors.company_name && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.company_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1">Email</label>
                        <input
                            type="email"
                            value={profileData?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                </div>
                <div className="flex justify-end items-end">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-32 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer disabled:opacity-70"
                    >
                        {isUpdating ? (
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

