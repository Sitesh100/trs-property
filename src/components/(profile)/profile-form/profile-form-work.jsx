import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProfileFormWork = ({ isEditing, setIsEditing, registerSubmit, setIsSubmitting }) => {
    const validationSchema = Yup.object().shape({
        locations: Yup.string().required('Locations are required'),
        zoomOptions: Yup.string().required('Zoom options are required'),
        dealIn: Yup.object().shape({
            residential: Yup.object().shape({
                primary: Yup.boolean(),
                rebelle: Yup.boolean()
            }),
            commercial: Yup.object().shape({
                primary: Yup.boolean(),
                rebelle: Yup.boolean()
            })
        }).test(
            'at-least-one-category',
            'Select at least one category',
            (value) => (
                value.residential.primary ||
                value.residential.rebelle ||
                value.commercial.primary ||
                value.commercial.rebelle
            )
        ),
        categories: Yup.array().min(1, 'Select at least one category'),
        officeAddress: Yup.string().required('Office address is required')
    });

    const formik = useFormik({
        initialValues: {
            locations: '',
            zoomOptions: '',
            dealIn: {
                residential: { primary: false, rebelle: false },
                commercial: { primary: false, rebelle: false }
            },
            categories: [],
            officeAddress: 'amd'
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (setIsSubmitting) setIsSubmitting(true);
                console.log('Form submitted:', values);
                // TODO: call your API mutation here
                if (setIsEditing) setIsEditing(false);
            } catch (err) {
                console.error(err);
            } finally {
                if (setIsSubmitting) setIsSubmitting(false);
            }
        }
    });

    // Register this form's submit so the top-level button can trigger it
    useEffect(() => {
        if (registerSubmit) {
            registerSubmit(() => formik.submitForm());
        }
    }, [registerSubmit]);

    const handleCategoryChange = (e) => {
        if (!isEditing) return;
        const { value, checked } = e.target;
        const newCategories = checked
            ? [...formik.values.categories, value]
            : formik.values.categories.filter(item => item !== value);
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
                                        checked={formik.values.dealIn.residential[type]}
                                        onChange={() => isEditing && formik.setFieldValue(
                                            `dealIn.residential.${type}`,
                                            !formik.values.dealIn.residential[type]
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
                                        checked={formik.values.dealIn.commercial[type]}
                                        onChange={() => isEditing && formik.setFieldValue(
                                            `dealIn.commercial.${type}`,
                                            !formik.values.dealIn.commercial[type]
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