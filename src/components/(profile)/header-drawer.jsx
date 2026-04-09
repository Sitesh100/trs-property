"use client";

import { Dialog } from "@headlessui/react";
import {
    X,
    Menu,
    LogOut,
    LogIn
} from "lucide-react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeaderDrawer({ menuOpen, setMenuOpen, links, isLoggedIn, onLogout, onLogin }) {

    return (
        <>
            <button
                onClick={() => setMenuOpen(true)}
                className="text-[#F5EFE7] flex justify-center items-center cursor-pointer"
            >
                <Menu />
            </button>


            <AnimatePresence>
                {menuOpen && (
                    <Dialog as={Fragment} open={menuOpen} onClose={() => setMenuOpen(false)}>
                        <div className="fixed inset-0 z-50">
                            <motion.div
                                onClick={() => setMenuOpen(false)}
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
                                    onClick={() => setMenuOpen(false)}
                                    className="absolute top-4 right-4 text-[#F5EFE7] hover:text-[#C6A256] transition
                                    cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="mt-10">
                                    <Link href="/" className="text-2xl font-bold text-[#F5EFE7] flex items-center">
                                        <Image src="/assets/logo/logo2.avif" alt="Logo" width={100} height={100} />
                                    </Link>
                                    <ul className="space-y-5 mt-10">
                                        {links?.map(({ label, href }) => (
                                            <Link
                                                href={href}
                                                key={label}
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 text-[#F5EFE7] hover:text-[#C6A256] cursor-pointer transition-colors"
                                            >
                                                <span>{label}</span>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>

                                {isLoggedIn ? (
                                    <button
                                        onClick={() => {
                                            onLogout?.();
                                            setMenuOpen(false);
                                        }}
                                        className="bg-[#F5EFE7] text-[#212121] px-4 py-2 rounded text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onLogin?.();
                                            setMenuOpen(false);
                                        }}
                                        className="bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] px-4 py-2 rounded text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}
