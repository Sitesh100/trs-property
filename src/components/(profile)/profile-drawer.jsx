"use client";
import { Dialog } from "@headlessui/react";
import {
    LogOut,
    X
} from "lucide-react";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProfileDrawer({ onLogout, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const previewImage = user?.profile_image_url || '/assets/images/profile.png';
    const role = String(user?.role || '').toLowerCase();
    const isAgentRole = role.includes('agent') || role.includes('consultant');
    const isBuilderRole = role.includes('builder');

    const customerMenuItems = [
        { name: "Profile", url: '/profile' },
        { name: "Post Property Free", url: '/post-property' },
        { name: "Post Requirement Free", url: '/post-buy-requirement' },
        { name: "Post Buy Requirement", url: '/post-buy-requirement' },
        { name: "My Buy Requirements", url: '/my-buy-requirement' },
        { name: "My Properties", url: '/my-property' },
        { name: "My Matches", url: '/property-matches' },
        { name: "Cart", url: '/property-favourite' },
    ];

    const agentMenuItems = [
        { name: "Profile", url: '/agent/profile' },
        // { name: "Post Property Free", url: '/agent/post-property' },
        // { name: "Post Buy Requirement", url: '/agent/post-buy-requirement' },
        // { name: "My Buy Requirements", url: '/agent/my-buy-requirements' },
        // { name: "My Properties", url: '/agent/my-property' },
        // { name: "Match Making", url: '/agent/match-making' },
        { name: "my dashboard", url: '/agent/leads' },
    ];

    const builderMenuItems = [
        { name: "Profile", url: '/builder/profile' },
        { name: "Analytics", url: '/builder/analytics' },
    ];

    const menuItems = isBuilderRole ? builderMenuItems : isAgentRole ? agentMenuItems : customerMenuItems;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#F5EFE7] text-[#212121] w-10 h-10 flex justify-center items-center rounded-full overflow-hidden shadow cursor-pointer"
            >
                <Image
                    width={40}
                    height={40}
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </button>




            <AnimatePresence>
                {isOpen && (
                    <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
                        <div className="fixed inset-0 z-50">
                            <motion.div
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-[#212121]"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                className="fixed inset-y-0 right-0 w-72 sm:w-80 bg-linear-to-b from-[#212121] via-[#212121] to-[#212121] shadow-2xl p-5 flex flex-col justify-between z-50"
                            >
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 text-[#F5EFE7] hover:text-[#C6A256] transition
                                    cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>


                                <div className="mt-10">
                                    <Link href="/" className="text-2xl font-bold text-[#F5EFE7] flex items-center">
                                        <Image src="/assets/logo/logo1.png" alt="Logo" width={100} height={100} />
                                    </Link>
                                    <ul className="space-y-5 mt-10">
                                        {menuItems?.map(({ name, url }) => (
                                            <Link
                                                href={url}
                                                key={name}
                                                className="flex items-center gap-3 text-[#F5EFE7] hover:text-[#C6A256] cursor-pointer transition-colors"
                                            >
                                                <span>{name}</span>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => {
                                        onLogout?.();
                                        setIsOpen(false);
                                    }}
                                    className="bg-[#F5EFE7] text-[#212121] px-4 py-2 rounded text-sm font-medium cursor-pointer
                                    flex justify-center items-center"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Log Out
                                </button>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}
