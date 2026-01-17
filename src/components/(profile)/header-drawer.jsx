"use client";

import { Dialog } from "@headlessui/react";
import {
    User,
    ClipboardList,
    FilePlus,
    X,
    Menu
} from "lucide-react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeaderDrawer({ menuOpen, setMenuOpen, links }) {

    return (
        <>
            <button
                onClick={() => setMenuOpen(true)}
                className="text-white flex justify-center items-center cursor-pointer"
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
                                    onClick={() => setMenuOpen(false)}
                                    className="absolute top-4 right-4 text-white hover:text-red-500 transition
                                    cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="mt-10">
                                    <Link href="/" className="text-2xl font-bold text-white flex items-center">
                                        <Image src="/assets/logo/logo1.png" alt="Logo" width={100} height={100} />
                                    </Link>
                                    <ul className="space-y-5 mt-10">
                                        {links?.map(({ label, icon: Icon, href }) => (
                                            <Link
                                                href={href}
                                                key={label}
                                                className="flex items-center gap-3 text-white hover:text-yellow-400 cursor-pointer transition-colors"
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span>{label}</span>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
}
