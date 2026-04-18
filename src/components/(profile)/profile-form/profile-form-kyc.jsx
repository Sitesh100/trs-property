import { getImageUrl } from '@/utils/getImageUrl';
import { useGetProfileKYCQuery, useProfileKYCMutation } from '@/service/profileApi';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProfileFormKyc = ({ isEditing, setIsEditing, registerSubmit, setIsSubmitting }) => {
    const { data, isLoading: isLoadingKYC } = useGetProfileKYCQuery();
    const [profileKYC, { isLoading }] = useProfileKYCMutation();

    const [files, setFiles] = useState({
        govt_id: '',
        visiting_card: '',
        rera_certificate: ''
    });

    const [previews, setPreviews] = useState({
        govt_id: null,
        visiting_card: null,
        rera_certificate: null,
    });

    const handleFileChange = (e, type) => {
        if (!isEditing) return;
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            if (setIsSubmitting) setIsSubmitting(true);
            const response = await profileKYC({ ...files }).unwrap();
            if (response?.status) {
                toast.success(response?.message);
                setFiles({ govt_id: null, visiting_card: null, rera_certificate: null });
                if (setIsEditing) setIsEditing(false);
            }
        } catch (err) {
            toast.error(err?.data?.message || "Something went wrong");
        } finally {
            if (setIsSubmitting) setIsSubmitting(false);
        }
    };

    // Register this form's submit so the top-level button can trigger it
    useEffect(() => {
        if (registerSubmit) {
            registerSubmit(handleSubmit);
        }
    }, [registerSubmit, files]); // re-register when files change so submit always has latest files

    useEffect(() => {
        if (data?.data) {
            setPreviews({
                govt_id: data?.data?.govt_id ? getImageUrl(data.data.govt_id) : null,
                visiting_card: data?.data?.visiting_card ? getImageUrl(data.data.visiting_card) : null,
                rera_certificate: data?.data?.rera_certificate ? getImageUrl(data.data.rera_certificate) : null,
            });
        }
    }, [data]);

    if (isLoadingKYC) return <>loading...</>

    const docFields = [
        { key: 'govt_id', label: 'Govt. ID', uploadLabel: 'Upload Govt ID', previewAlt: 'Govt ID Preview' },
        { key: 'visiting_card', label: 'Visiting Card', uploadLabel: 'Upload Visiting Card', previewAlt: 'Visiting Card Preview' },
        { key: 'rera_certificate', label: 'RERA', uploadLabel: 'Upload RERA', previewAlt: 'RERA Preview' },
    ];

    return (
        <div className="mb-6">
            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-[#d1d5db]">
                    <span className="text-[#374151] font-medium">Phone Number Verified</span>
                    <span className="text-[#C6A256]">Verified</span>
                </div>

                {docFields.map(({ key, label, uploadLabel, previewAlt }) => (
                    <div key={key} className="py-3 px-3 rounded-xl border border-[#d1d5db] bg-white/70">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#374151] font-medium">{label}</span>
                            <span className="text-[#C6A256]">
                                {files[key] ? "Uploaded" : "Pending"}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {isEditing && (
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, key)}
                                    />
                                    <div className="w-48 text-center px-4 py-2 bg-[#1f2937] text-[#F5EFE7] rounded-lg hover:bg-[#111827] transition-colors">
                                        {uploadLabel}
                                    </div>
                                </label>
                            )}
                            {previews[key] ? (
                                <div className="mt-2 md:mt-0">
                                    <img
                                        src={previews[key]}
                                        alt={previewAlt}
                                        className="h-16 w-16 object-cover border border-[#d1d5db] rounded-lg"
                                    />
                                </div>
                            ) : (
                                !isEditing && (
                                    <span className="text-sm text-[#6b7280] italic">No document uploaded</span>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileFormKyc;