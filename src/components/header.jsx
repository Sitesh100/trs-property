"use client"
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
import { Circle, HardHat, Home, User, Users2 } from "lucide-react";

const links = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/about', label: 'ABOUT', icon: Circle },
    { href: '/agent', label: 'AGENT', icon: User },
    { href: '/builder', label: 'BUILDER', icon: HardHat },
    { href: '/property', label: 'CUSTOMER', icon: Users2 },
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
        toast.success("Successfully logout");
        router.push('/');
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full property-gradient backdrop-blur-sm ">
                <div className="container mx-auto py-3 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-white flex items-end">
                     <Image src="/assets/logo/logo2.avif" alt="Logo" width={90} height={100} />
                        <Image src="/assets/logo/logo1.avif" alt="Logo" width={200} height={200} />
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        {links.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`nav-link text-white text-sm font-medium transition-all duration-300 ${pathname === href
                                    ? 'opacity-100'
                                    : 'opacity-90 hover:opacity-100'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                        {token ? (
                            <>
                                <ProfileDrawer onLogout={handlerLogout} user={user} />
                            </>
                        ) : (
                            <button
                                onClick={() => setOpen(true)}
                                className="sphere-button bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-5 py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-300/50"
                            >
                                <span>Post Property Free</span>
                            </button>
                        )}
                    </nav>

                    <div className="flex items-center gap-4 md:hidden">
                        <div>
                            {token ? (
                                <div className="flex items-center gap-4">
                                    <ProfileDrawer onLogout={handlerLogout} user={user} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setOpen(true)}
                                    className="sphere-button bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-300/50"
                                >
                                    <span>LogIn</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Drawer */}
                        <div className="md:hidden block">
                            <HeaderDrawer menuOpen={menuOpen} setMenuOpen={setMenuOpen} links={links} />
                        </div>
                    </div>
                </div>

            </header>
            <AuthModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    )
}

export default Header

