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
        <div className="min-h-screen profile-gradient p-6 flex justify-center items-center">
            <div className="w-6xl mx-auto bg-[#F5EFE7] rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">EDIT PROFILE</h2>

                {isAgent && <AgentDigitalCard />}
                {isBuilder && <BuilderDigitalCard />}

                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'personal' ? 'text-[#212121] border-b-2 border-[#212121]' : 'text-[#F5EFE7]'}`}
                    >
                        Personal Info
                    </button>
                    {canViewExtraSections && (
                        <>
                            <button
                                onClick={() => setActiveTab('work')}
                                className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'work' ? 'text-[#212121] border-b-2 border-[#212121]' : 'text-[#F5EFE7]'}`}
                            >
                                Work Info
                            </button>
                            <button
                                onClick={() => setActiveTab('kyc')}
                                className={`md:px-4 px-2 py-2 font-medium cursor-pointer ${activeTab === 'kyc' ? 'text-[#212121] border-b-2 border-[#212121]' : 'text-[#F5EFE7]'}`}
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


