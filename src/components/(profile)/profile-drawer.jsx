"use client";
import { Dialog } from "@headlessui/react";
import {
    User,
    LogOut,
    FilePlus,
    X,
    Heart,
    Home,
    BringToFront,
} from "lucide-react";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { basedUrl } from "@/libs/based-url";

export default function ProfileDrawer({ onLogout, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const previewImage = user?.image ? basedUrl + user?.image : '/assets/images/profile.png';
    const menuItems = [
        { name: "Profile", icon: User, url: '/profile' },
        { name: "Post Property", icon: FilePlus, url: '/post-property' },
        { name: "Post Buy Requirement", icon: FilePlus, url: '/post-buy-requirement' },
        { name: "My Property", icon: Home, url: '/my-property' },
        { name: "My Matches", icon: BringToFront, url: '/property-matches' },
        { name: "Favourite", icon: Heart, url: '/property-favourite' },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white text-black w-10 h-10 flex justify-center items-center rounded-full overflow-hidden shadow cursor-pointer"
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
                                className="fixed inset-0 bg-black"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
                                className="fixed inset-y-0 right-0 w-72 sm:w-80 bg-gradient-to-b from-[#3F2464] via-[#2b1748] to-black shadow-2xl p-5 flex flex-col justify-between z-50"
                            >
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 text-white hover:text-red-500 transition
                                    cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>


                                <div className="mt-10">
                                    <Link href="/" className="text-2xl font-bold text-white flex items-center">
                                        <Image src="/assets/logo/logo.png" alt="Logo" width={100} height={100} />
                                    </Link>
                                    <ul className="space-y-5 mt-10">
                                        {menuItems?.map(({ name, icon: Icon, url }) => (
                                            <Link
                                                href={url}
                                                key={name}
                                                className="flex items-center gap-3 text-white hover:text-yellow-400 cursor-pointer transition-colors"
                                            >
                                                <Icon className="h-5 w-5" />
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
                                    className="bg-white text-black px-4 py-2 rounded text-sm font-medium cursor-pointer
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
