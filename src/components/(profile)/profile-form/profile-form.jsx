"use client"
import React, { useEffect, useState } from "react";
import ProfileFormPersonal from "./profile-form-personal";
import ProfileFormKyc from "./profile-form-kyc";
import ProfileFormWork from "./profile-form-work";
import { useSelector } from "react-redux";
import AgentDigitalCard from "../agent-digital-card";
import BuilderDigitalCard from "../builder-digital-card";

const ProfileForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('personal');
    const role = (user?.role || '').toLowerCase();
    const canViewExtraSections = role === 'agent' || role === 'builder';
    const isAgent = role === 'agent';
    const isBuilder = role === 'builder';

    useEffect(() => {
        if (!canViewExtraSections && activeTab !== 'personal') {
            setActiveTab('personal');
        }
    }, [canViewExtraSections, activeTab]);

    return (
        <div className="min-h-screen profile-gradient p-4 md:p-6 flex justify-center items-center">
            <div className="w-full max-w-5xl mx-auto bg-[#F5EFE7] rounded-2xl p-4 md:p-6 border border-[#212121]/10 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
                <h2 className="text-2xl font-bold mb-6 text-[#1f2937]">EDIT PROFILE</h2>

                {isAgent && <AgentDigitalCard />}
                {isBuilder && <BuilderDigitalCard />}

                <div className="flex flex-wrap gap-2 border-b border-[#212121]/15 mb-6 pb-2">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'personal' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                    >
                        Personal Info
                    </button>
                    {canViewExtraSections && (
                        <>
                            <button
                                onClick={() => setActiveTab('work')}
                                className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'work' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                            >
                                Work Info
                            </button>
                            <button
                                onClick={() => setActiveTab('kyc')}
                                className={`md:px-4 px-3 py-2 text-sm md:text-base rounded-lg font-semibold cursor-pointer transition-all duration-200 ${activeTab === 'kyc' ? 'text-[#1f2937] bg-white border border-[#C6A256]/40 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/70 border border-transparent'}`}
                            >
                                KYC Doc
                            </button>
                        </>
                    )}
                </div>

                {activeTab === 'personal' && (
                    <ProfileFormPersonal />
                )}

                {canViewExtraSections && activeTab === 'work' && (
                    <ProfileFormWork />
                )}

                {canViewExtraSections && activeTab === 'kyc' && (
                    <ProfileFormKyc />
                )}
            </div>
        </div>
    );
};

export default ProfileForm;


