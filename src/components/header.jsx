// src/components/header.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "./auth/auth-modal";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "@/redux/authSlice";
import toast from "react-hot-toast";
import ProfileDrawer from "./(profile)/profile-drawer";
import { usePathname, useRouter } from "next/navigation";
import HeaderDrawer from "./(profile)/header-drawer";
import { Circle, HardHat, Home, User, Users2, Building2 } from "lucide-react";

const links = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/property', label: 'PROPERTIES', icon: Building2 },
    { href: '/about', label: 'ABOUT', icon: Circle },
    { href: '/agent', label: 'AGENT', icon: User },
    { href: '/builder', label: 'BUILDER', icon: HardHat },
    { href: '/customer', label: 'CUSTOMER', icon: Users2 },
];

function Header() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const handlerLogout = () => {
        dispatch(clearAuth());
        toast.success("Successfully logged out");
        router.push('/');
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full property-gradient backdrop-blur-sm">
                <div className="container mx-auto py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-end">
                        <Image src="/assets/logo/logo2.avif" alt="Logo" width={90} height={100} />
                        <Image src="/assets/logo/logo1.avif" alt="Logo" width={200} height={200} className="ml-[-20px]" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {links.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-1.5 text-white text-sm font-medium transition-all duration-300 ${
                                    pathname === href
                                        ? 'text-amber-400 opacity-100'
                                        : 'opacity-90 hover:opacity-100 hover:text-amber-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}

                        {token ? (
                            <ProfileDrawer onLogout={handlerLogout} user={user} />
                        ) : (
                            <button
                                onClick={() => setOpen(true)}
                                className="golden-button group relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-5 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-300/50"
                            >
                                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                    Post Property Free
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        )}
                    </nav>

                    {/* Mobile */}
                    <div className="flex items-center gap-4 md:hidden">
                        {token ? (
                            <ProfileDrawer onLogout={handlerLogout} user={user} />
                        ) : (
                            <button
                                onClick={() => setOpen(true)}
                                className="golden-button group relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-4 py-1.5 rounded-md text-sm font-semibold"
                            >
                                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                    LogIn
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        )}

                        <HeaderDrawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} links={links} />
                    </div>
                </div>
            </header>

            <AuthModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    )
}

export default Header;