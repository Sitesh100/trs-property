import { setUser } from '@/redux/authSlice';
import { useGetCustomerProfileQuery, useUpdateCustomerProfileMutation } from '@/service/profileApi';
import { useUploadProfileImageMutation } from '@/service/authApi';
import { Edit, Loader } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const ProfileFormPersonal = ({ isEditing, setIsEditing, registerSubmit, setIsSubmitting }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const { data: profileData, isLoading: isLoadingProfile, refetch } = useGetCustomerProfileQuery(undefined, {
        skip: !token,
    });

    const [updateProfile, { isLoading: isUpdating }] = useUpdateCustomerProfileMutation();
    const [uploadProfileImage, { isLoading: isUploadingImage }] = useUploadProfileImageMutation();

    const [previewImage, setPreviewImage] = useState('/assets/images/profile.png');

    useEffect(() => {
        if (profileData) {
            formik.setValues({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
                city: profileData.city || '',
                company_name: profileData.company_name || '',
            });
            if (profileData.profile_image_url) {
                setPreviewImage(profileData.profile_image_url);
            }
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
                if (setIsSubmitting) setIsSubmitting(true);
                const response = await updateProfile(values).unwrap();
                toast.success("Profile updated successfully!");
                dispatch(setUser(response));
                refetch();
                if (setIsEditing) setIsEditing(false);
            } catch (err) {
                console.error("Profile update error:", err);
                toast.error(err?.data?.detail || err?.data?.message || "Failed to update profile");
            } finally {
                if (setIsSubmitting) setIsSubmitting(false);
            }
        },
    });

    // Register this form's submit so the top-level button can trigger it
    useEffect(() => {
        if (registerSubmit) {
            registerSubmit(() => formik.submitForm());
        }
    }, [registerSubmit]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            try {
                await uploadProfileImage(file).unwrap();
                toast.success("Profile image uploaded successfully!");
                refetch();
            } catch (err) {
                toast.error(err?.data?.detail || err?.data?.message || "Failed to upload profile image");
            }
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin w-8 h-8 text-[#212121]" />
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
                        {isEditing && (
                            <label
                                htmlFor="profile-upload"
                                className={`absolute bottom-0 right-0 bg-[#1f2937] text-[#F5EFE7] p-1 rounded-full cursor-pointer hover:bg-[#111827] transition-colors ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[#1f2937]">{profileData?.full_name || "User"}</h3>
                        <p className="text-sm text-[#6b7280]">{profileData?.email || ""}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-sm block mb-1 text-[#374151]">Full Name*</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formik.values.full_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                                ${isEditing ? 'bg-white/80 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}
                                ${formik.touched.full_name && formik.errors.full_name ? 'border-[#C6A256]' : ''}
                            `}
                        />
                        {formik.touched.full_name && formik.errors.full_name && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.full_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1 text-[#374151]">Phone Number*</label>
                        <input
                            type="text"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                                ${isEditing ? 'bg-white/80 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}
                                ${formik.touched.phone && formik.errors.phone ? 'border-[#C6A256]' : ''}
                            `}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.phone}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1 text-[#374151]">City*</label>
                        <input
                            type="text"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                                ${isEditing ? 'bg-white/80 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}
                                ${formik.touched.city && formik.errors.city ? 'border-[#C6A256]' : ''}
                            `}
                        />
                        {formik.touched.city && formik.errors.city && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.city}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1 text-[#374151]">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formik.values.company_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditing}
                            placeholder="Enter your company name"
                            className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                                ${isEditing ? 'bg-white/80 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}
                                ${formik.touched.company_name && formik.errors.company_name ? 'border-[#C6A256]' : ''}
                            `}
                        />
                        {formik.touched.company_name && formik.errors.company_name && (
                            <div className="text-[#C6A256] text-xs mt-1">{formik.errors.company_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm block mb-1 text-[#374151]">Email</label>
                        <input
                            type="email"
                            value={profileData?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed"
                        />
                        <p className="text-xs text-[#6b7280] mt-1">Email cannot be changed</p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ProfileFormPersonal;