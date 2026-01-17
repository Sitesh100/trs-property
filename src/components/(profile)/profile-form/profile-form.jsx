"use client"
import React, { useState } from "react";
import ProfileFormPersonal from "./profile-form-personal";
import ProfileFormKyc from "./profile-form-kyc";
import ProfileFormWork from "./profile-form-work";
import { useSelector } from "react-redux";
import { Edit } from "lucide-react";

const ProfileForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="min-h-screen profile-gradient p-6 flex justify-center items-center">
            <div className="w-6xl mx-auto bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">EDIT PROFILE</h2>

                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'personal' ? 'text-[#2a1f45] border-b-2 border-[#2a1f45]' : 'text-gray-500'}`}
                    >
                        Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('work')}
                        className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'work' ? 'text-[#2a1f45] border-b-2 border-[#2a1f45]' : 'text-gray-500'}`}
                    >
                        Work Info
                    </button>
                    <button
                        onClick={() => setActiveTab('kyc')}
                        className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'kyc' ? 'text-[#2a1f45] border-b-2 border-[#2a1f45]' : 'text-gray-500'}`}
                    >
                        KYC Doc
                    </button>
                </div>

                {activeTab === 'personal' && (
                    <ProfileFormPersonal user={user} />
                )}

                {activeTab === 'work' && (
                    <ProfileFormWork />
                )}

                {activeTab === 'kyc' && (
                    <ProfileFormKyc />
                )}
            </div>
        </div>
    );
};

export default ProfileForm;


