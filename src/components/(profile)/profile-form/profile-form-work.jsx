import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProfileFormWork = () => {
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
            (value) => {
                return (
                    value.residential.primary ||
                    value.residential.rebelle ||
                    value.commercial.primary ||
                    value.commercial.rebelle
                );
            }
        ),
        categories: Yup.array().min(1, 'Select at least one category'),
        officeAddress: Yup.string().required('Office address is required')
    });

    const formik = useFormik({
        initialValues: {
            locations: '',
            zoomOptions: '',
            dealIn: {
                residential: {
                    primary: false,
                    rebelle: false
                },
                commercial: {
                    primary: false,
                    rebelle: false
                }
            },
            categories: [],
            officeAddress: 'amd'
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted:', values);
            // Handle form submission here
        }
    });

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        let newCategories = [...formik.values.categories];

        if (checked) {
            newCategories.push(value);
        } else {
            newCategories = newCategories.filter(item => item !== value);
        }

        formik.setFieldValue('categories', newCategories);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 mb-6">
            <div className="border p-4 rounded-lg">
                <label className="text-sm block mb-1 font-medium">What are the main Locations you focus in Ourgoor?*</label>
                <input
                    type="text"
                    name="locations"
                    placeholder="Search Locations"
                    className="w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black"
                    onChange={formik.handleChange}
                    value={formik.values.locations}
                />
                {formik.touched.locations && formik.errors.locations && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.locations}</div>
                )}
            </div>

            <div className="border p-4 rounded-lg">
                <label className="text-sm block mb-1 font-medium">ZoomOptions *</label>
                <input
                    type="text"
                    name="zoomOptions"
                    className="w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black"
                    onChange={formik.handleChange}
                    value={formik.values.zoomOptions}
                />
                {formik.touched.zoomOptions && formik.errors.zoomOptions && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.zoomOptions}</div>
                )}
            </div>

            <div className="border p-4 rounded-lg">
                <label className="text-sm block mb-1 font-medium">What do you Deal in?*</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Residential</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="residential-primary"
                                    className="h-4 w-4"
                                    checked={formik.values.dealIn.residential.primary}
                                    onChange={() => formik.setFieldValue(
                                        'dealIn.residential.primary',
                                        !formik.values.dealIn.residential.primary
                                    )}
                                />
                                <label htmlFor="residential-primary">Primary</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="residential-rebelle"
                                    className="h-4 w-4"
                                    checked={formik.values.dealIn.residential.rebelle}
                                    onChange={() => formik.setFieldValue(
                                        'dealIn.residential.rebelle',
                                        !formik.values.dealIn.residential.rebelle
                                    )}
                                />
                                <label htmlFor="residential-rebelle">Rebelle</label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Commercial</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="commercial-primary"
                                    className="h-4 w-4"
                                    checked={formik.values.dealIn.commercial.primary}
                                    onChange={() => formik.setFieldValue(
                                        'dealIn.commercial.primary',
                                        !formik.values.dealIn.commercial.primary
                                    )}
                                />
                                <label htmlFor="commercial-primary">Primary</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="commercial-rebelle"
                                    className="h-4 w-4"
                                    checked={formik.values.dealIn.commercial.rebelle}
                                    onChange={() => formik.setFieldValue(
                                        'dealIn.commercial.rebelle',
                                        !formik.values.dealIn.commercial.rebelle
                                    )}
                                />
                                <label htmlFor="commercial-rebelle">Rebelle</label>
                            </div>
                        </div>
                    </div>
                </div>
                {formik.touched.dealIn && formik.errors.dealIn && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.dealIn}</div>
                )}
            </div>

            <div className="border p-4 rounded-lg">
                <label className="text-sm block mb-1 font-medium">Choose your Top Categories*</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {['Floor', 'Apartment', 'Villa', 'Plot', 'Retail', 'Office'].map((category) => (
                        <div key={category} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`category-${category.toLowerCase()}`}
                                className="h-4 w-4"
                                value={category}
                                checked={formik.values.categories.includes(category)}
                                onChange={handleCategoryChange}
                            />
                            <label htmlFor={`category-${category.toLowerCase()}`}>{category}</label>
                        </div>
                    ))}
                </div>
                {formik.touched.categories && formik.errors.categories && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.categories}</div>
                )}
            </div>

            <div className="border p-4 rounded-lg">
                <label className="text-sm block mb-1 font-medium">Your Office Address</label>
                <input
                    type="text"
                    name="officeAddress"
                    className="w-full px-3 py-2 border rounded bg-[#F9F9F9] text-black"
                    onChange={formik.handleChange}
                    value={formik.values.officeAddress}
                />
                {formik.touched.officeAddress && formik.errors.officeAddress && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.officeAddress}</div>
                )}
            </div>

            <div className="flex justify-end items-end">
                <button
                    type="submit"
                    className="w-32 bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ProfileFormWork;

