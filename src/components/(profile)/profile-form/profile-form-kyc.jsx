import { basedUrl } from '@/libs/based-url';
import { useGetProfileKYCQuery, useProfileKYCMutation } from '@/service/profileApi';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProfileFormKyc = () => {
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
            const response = await profileKYC({ ...files }).unwrap();
            if (response?.status) {
                toast.success(response?.message);
                setFiles({
                    govt_id: null,
                    visiting_card: null,
                    rera_certificate: null
                });
            }
        } catch (err) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (data?.data) {
            setPreviews({
                govt_id: data?.data?.govt_id ? basedUrl + data?.data?.govt_id : null,
                visiting_card: data?.data?.visiting_card ? basedUrl + data?.data?.visiting_card : null,
                rera_certificate: data?.data?.rera_certificate ? basedUrl + data?.data?.rera_certificate : null,
            });
        }
    }, [data]);

    if (isLoadingKYC) return <>loading...</>

    return (
        <div className="mb-6">
            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b">
                    <span>Phone Number Verified</span>
                    <span className="text-green-600">Verified</span>
                </div>
                <div className="py-2 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <span>Govt. ID</span>
                        <span className={files.govt_id ? "text-green-600" : "text-yellow-600"}>
                            {files.govt_id ? "Uploaded" : "Pending"}
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'govt_id')}
                            />
                            <div className="w-48 text-center px-4 py-2 bg-[#2a1f45] text-white rounded hover:bg-[#3a2a5a]">
                                Upload Govt ID
                            </div>
                        </label>
                        {previews.govt_id && (
                            <div className="mt-2 md:mt-0">
                                <img
                                    src={previews.govt_id}
                                    alt="Govt ID Preview"
                                    className="h-16 w-16 object-cover border rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="py-2 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <span>Visiting Card</span>
                        <span className={files.visiting_card ? "text-green-600" : "text-yellow-600"}>
                            {files.visiting_card ? "Uploaded" : "Pending"}
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'visiting_card')}
                            />
                            <div className="w-48 text-center px-4 py-2 bg-[#2a1f45] text-white rounded hover:bg-[#3a2a5a]">
                                Upload Visiting Card
                            </div>
                        </label>
                        {previews.visiting_card && (
                            <div className="mt-2 md:mt-0">
                                <img
                                    src={previews.visiting_card}
                                    alt="Visiting Card Preview"
                                    className="h-16 w-16 object-cover border rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="py-2 border-b">
                    <div className="flex items-center justify-between mb-2">
                        <span>RERA</span>
                        <span className={files.rera_certificate ? "text-green-600" : "text-yellow-600"}>
                            {files.rera_certificate ? "Uploaded" : "Pending"}
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, 'rera_certificate')}
                            />
                            <div className="w-48 text-center px-4 py-2 bg-[#2a1f45] text-white rounded hover:bg-[#3a2a5a]">
                                Upload RERA
                            </div>
                        </label>
                        {previews.rera_certificate && (
                            <div className="mt-2 md:mt-0">
                                <img
                                    src={previews.rera_certificate}
                                    alt="RERA Preview"
                                    className="h-16 w-16 object-cover border rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex md:flex-row flex-col gap-4">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-36 px-6 py-2 flex justify-center items-center bg-[#2a1f45] text-white rounded hover:bg-[#3a2a5a] cursor-pointer"
                >
                    {isLoading ? (
                        <div className="animate-spin">
                            <Loader />
                        </div>
                    ) : (
                        "Update KYC"
                    )}
                </button>
                <button className="w-36 px-6 py-2 flex justify-center items-center bg-[#2a1f45] text-white rounded hover:bg-[#3a2a5a] cursor-pointer">
                    View Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileFormKyc;

