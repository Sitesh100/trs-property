"use client"
import React, { useEffect, useRef, useState } from "react";
import ProfileFormPersonal from "./profile-form-personal";
import ProfileFormKyc from "./profile-form-kyc";
import ProfileFormWork from "./profile-form-work";
import { useSelector } from "react-redux";
import AgentDigitalCard from "../agent-digital-card";
import BuilderDigitalCard from "../builder-digital-card";
import { Edit2, X, Save } from "lucide-react";

const ProfileForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sub-forms register their submit function here so the top button can trigger it
    const submitRef = useRef(null);

    const role = (user?.role || '').toLowerCase();
    const canViewExtraSections = role === 'agent' || role === 'builder';
    const isAgent = role === 'agent';
    const isBuilder = role === 'builder';

    useEffect(() => {
        if (!canViewExtraSections && activeTab !== 'personal') {
            setActiveTab('personal');
        }
    }, [canViewExtraSections, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsEditing(false);
        submitRef.current = null;
    };

    const handleTopUpdate = () => {
        if (submitRef.current) {
            submitRef.current();
        }
    };

    const updateLabel = activeTab === 'personal'
        ? 'Update Profile'
        : activeTab === 'work'
            ? 'Save Changes'
            : 'Update KYC';

    return (
        <div className="min-h-screen profile-gradient p-4 md:p-6 flex justify-center items-center">
            <div className="w-full max-w-5xl mx-auto bg-[#F5EFE7] rounded-2xl p-4 md:p-6 border border-[#212121]/10 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#1f2937]">EDIT PROFILE</h2>

                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-[#F5EFE7] rounded-lg hover:bg-[#111827] transition-colors text-sm font-medium cursor-pointer"
                            >
                                <Edit2 size={15} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                {/* Cancel */}
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d5db] text-[#374151] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>

                                {/* Update / Save — triggers the active sub-form's submit */}
                                <button
                                    onClick={handleTopUpdate}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-[#F5EFE7] rounded-lg hover:bg-[#111827] transition-colors text-sm font-medium cursor-pointer disabled:opacity-70"
                                >
                                    <Save size={15} />
                                    {isSubmitting ? 'Saving...' : updateLabel}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isAgent && <AgentDigitalCard />}
                {isBuilder && <BuilderDigitalCard />}

                <div className="flex flex-wrap gap-2 border-b border-[#212121]/15 mb-6 pb-2">
                    <button
                        onClick={() => handleTabChange('personal')}
                        className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'personal' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                    >
                        Personal Info
                    </button>
                    {canViewExtraSections && (
                        <>
                            <button
                                onClick={() => handleTabChange('work')}
                                className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'work' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                            >
                                Work Info
                            </button>
                            <button
                                onClick={() => handleTabChange('kyc')}
                                className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'kyc' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                            >
                                KYC Doc
                            </button>
                        </>
                    )}
                </div>

                {activeTab === 'personal' && (
                    <ProfileFormPersonal
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        registerSubmit={(fn) => { submitRef.current = fn; }}
                        setIsSubmitting={setIsSubmitting}
                    />
                )}

                {canViewExtraSections && activeTab === 'work' && (
                    <ProfileFormWork
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        registerSubmit={(fn) => { submitRef.current = fn; }}
                        setIsSubmitting={setIsSubmitting}
                    />
                )}

                {canViewExtraSections && activeTab === 'kyc' && (
                    <ProfileFormKyc
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        registerSubmit={(fn) => { submitRef.current = fn; }}
                        setIsSubmitting={setIsSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfileForm;