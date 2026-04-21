import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { useGetMyWorkInfoQuery, useUpdateMyWorkInfoMutation } from '@/service/profileApi';

const defaultDealIn = {
    residential: { primary: false, rebelle: false },
    commercial: { primary: false, rebelle: false },
};

const extractPayload = (response) => response?.data || response?.result || response || {};

const parseCommaSeparatedValues = (value = '') =>
    value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

const ProfileFormWork = ({ isEditing, setIsEditing, registerSubmit, setIsSubmitting }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { data: workInfoResponse, refetch } = useGetMyWorkInfoQuery(undefined, {
        skip: !token,
    });
    const [updateMyWorkInfo] = useUpdateMyWorkInfoMutation();

    const validationSchema = Yup.object().shape({
        locations: Yup.string().required('Locations are required'),
        zoomOptions: Yup.string().required('Zoom options are required'),
        dealIn: Yup.object().test(
            'at-least-one-category',
            'Select at least one category',
            (value) => {
                if (!value) return false;
                const residential = value?.residential || {};
                const commercial = value?.commercial || {};
                return (
                    !!residential.primary ||
                    !!residential.rebelle ||
                    !!commercial.primary ||
                    !!commercial.rebelle
                );
            }
        ),
        categories: Yup.array().min(1, 'Select at least one category'),
        officeAddress: Yup.string().required('Office address is required'),
    });

    const formik = useFormik({
        initialValues: {
            locations: '',
            zoomOptions: '',
            dealIn: defaultDealIn,
            categories: [],
            officeAddress: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (setIsSubmitting) setIsSubmitting(true);

                const payload = {
                    focus_locations: parseCommaSeparatedValues(values.locations),
                    zoom_options: values.zoomOptions,
                    deal_in: values.dealIn || defaultDealIn,
                    top_categories: values.categories || [],
                    office_address: values.officeAddress,
                };

                const response = await updateMyWorkInfo(payload).unwrap();
                const updatedUser = extractPayload(response);
                dispatch(setUser(updatedUser));
                toast.success('Work info updated successfully!');
                refetch();

                if (setIsEditing) setIsEditing(false);
            } catch (err) {
                toast.error(err?.data?.detail || err?.data?.message || 'Failed to update work info');
            } finally {
                if (setIsSubmitting) setIsSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const workInfo = extractPayload(workInfoResponse);
        if (!workInfo || typeof workInfo !== 'object') return;

        formik.setValues({
            locations: Array.isArray(workInfo.focus_locations)
                ? workInfo.focus_locations.join(', ')
                : '',
            zoomOptions: workInfo.zoom_options || '',
            dealIn: workInfo.deal_in && typeof workInfo.deal_in === 'object'
                ? workInfo.deal_in
                : defaultDealIn,
            categories: Array.isArray(workInfo.top_categories) ? workInfo.top_categories : [],
            officeAddress: workInfo.office_address || '',
        });
    }, [workInfoResponse]);

    useEffect(() => {
        if (registerSubmit) {
            registerSubmit(() => formik.submitForm());
        }
    }, [registerSubmit, formik.submitForm]);

    const handleCategoryChange = (e) => {
        if (!isEditing) return;
        const { value, checked } = e.target;
        const newCategories = checked
            ? [...formik.values.categories, value]
            : formik.values.categories.filter((item) => item !== value);
        formik.setFieldValue('categories', newCategories);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 mb-6">
            <div className="border border-[#d1d5db] bg-white/70 p-4 rounded-xl">
                <label className="text-sm block mb-1 font-medium text-[#374151]">What are the main Locations you focus in Ourgoor?*</label>
                <input
                    type="text"
                    name="locations"
                    placeholder="Search Locations"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                        ${isEditing ? 'bg-white/85 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}`}
                    onChange={formik.handleChange}
                    value={formik.values.locations}
                />
                {formik.touched.locations && formik.errors.locations && (
                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.locations}</div>
                )}
            </div>

            <div className="border border-[#d1d5db] bg-white/70 p-4 rounded-xl">
                <label className="text-sm block mb-1 font-medium text-[#374151]">ZoomOptions *</label>
                <input
                    type="text"
                    name="zoomOptions"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                        ${isEditing ? 'bg-white/85 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}`}
                    onChange={formik.handleChange}
                    value={formik.values.zoomOptions}
                />
                {formik.touched.zoomOptions && formik.errors.zoomOptions && (
                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.zoomOptions}</div>
                )}
            </div>

            <div className="border border-[#d1d5db] bg-white/70 p-4 rounded-xl">
                <label className="text-sm block mb-1 font-medium text-[#374151]">What do you Deal in?*</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Residential</h4>
                        <div className="space-y-2">
                            {['primary', 'rebelle'].map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`residential-${type}`}
                                        className="h-4 w-4 accent-[#C6A256]"
                                        disabled={!isEditing}
                                        checked={!!formik.values.dealIn?.residential?.[type]}
                                        onChange={() => isEditing && formik.setFieldValue(
                                            `dealIn.residential.${type}`,
                                            !formik.values.dealIn?.residential?.[type]
                                        )}
                                    />
                                    <label htmlFor={`residential-${type}`} className={!isEditing ? 'text-[#6b7280]' : ''}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Commercial</h4>
                        <div className="space-y-2">
                            {['primary', 'rebelle'].map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`commercial-${type}`}
                                        className="h-4 w-4 accent-[#C6A256]"
                                        disabled={!isEditing}
                                        checked={!!formik.values.dealIn?.commercial?.[type]}
                                        onChange={() => isEditing && formik.setFieldValue(
                                            `dealIn.commercial.${type}`,
                                            !formik.values.dealIn?.commercial?.[type]
                                        )}
                                    />
                                    <label htmlFor={`commercial-${type}`} className={!isEditing ? 'text-[#6b7280]' : ''}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {formik.touched.dealIn && formik.errors.dealIn && (
                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.dealIn}</div>
                )}
            </div>

            <div className="border border-[#d1d5db] bg-white/70 p-4 rounded-xl">
                <label className="text-sm block mb-1 font-medium text-[#374151]">Choose your Top Categories*</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {['Floor', 'Apartment', 'Villa', 'Plot', 'Retail', 'Office'].map((category) => (
                        <div key={category} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`category-${category.toLowerCase()}`}
                                className="h-4 w-4 accent-[#C6A256]"
                                value={category}
                                disabled={!isEditing}
                                checked={formik.values.categories.includes(category)}
                                onChange={handleCategoryChange}
                            />
                            <label htmlFor={`category-${category.toLowerCase()}`} className={!isEditing ? 'text-[#6b7280]' : ''}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
                {formik.touched.categories && formik.errors.categories && (
                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.categories}</div>
                )}
            </div>

            <div className="border border-[#d1d5db] bg-white/70 p-4 rounded-xl">
                <label className="text-sm block mb-1 font-medium text-[#374151]">Your Office Address</label>
                <input
                    type="text"
                    name="officeAddress"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-[#d1d5db] rounded-lg text-[#1f2937] focus:outline-none transition-colors
                        ${isEditing ? 'bg-white/85 focus:border-[#C6A256] cursor-text' : 'bg-[#f3f4f6] text-[#6b7280] cursor-not-allowed'}`}
                    onChange={formik.handleChange}
                    value={formik.values.officeAddress}
                />
                {formik.touched.officeAddress && formik.errors.officeAddress && (
                    <div className="text-[#C6A256] text-xs mt-1">{formik.errors.officeAddress}</div>
                )}
            </div>
        </form>
    );
};

export default ProfileFormWork;
