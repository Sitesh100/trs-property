"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import AuthModal from "./auth/auth-modal";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "@/redux/authSlice";
import toast from "react-hot-toast";
import ProfileDrawer from "./(profile)/profile-drawer";
import { usePathname, useRouter } from "next/navigation";
import HeaderDrawer from "./(profile)/header-drawer";
import { LogIn } from 'lucide-react';

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/property", label: "PROPERTIES" },
  { href: "/consultant-lounge", label: "CONSULTANT LOUNGE" },
  { href: "/builder-lounge", label: "BUILDER LOUNGE" },
  { href: "/contact", label: "CONTACT US" },
];

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("sendOtp");
  const pathname = usePathname();

  useEffect(() => {
    const resumeSubmit = () => {
      const submitBtn = document.querySelector("button[type='submit']");
      submitBtn?.click();
    };

    window.addEventListener("resume-form-submit", resumeSubmit);
    return () => window.removeEventListener("resume-form-submit", resumeSubmit);
  }, []);

  const handlerLogout = () => {
    dispatch(clearAuth());
    toast.success("Successfully logged out");
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full property-gradient backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-end flex-shrink-0">
            {/* <Image
              src="/assets/logo/logo2.avif"
              alt="Logo"
              width={70}
              height={80}
             
            />
            <Image
              src="/assets/logo/logo1.avif"
              alt="Logo"
              width={150}
              height={150}
              
            /> */}
            <div className="relative w-32 h-8 xs:w-36 xs:h-9 sm:w-44 sm:h-10 md:w-52 md:h-11 lg:w-60 lg:h-12">
              <Image
                src="/assets/logo/TPM Logo.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 xl:space-x-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-xs lg:text-sm font-bold transition-all duration-300 group whitespace-nowrap
                  ${pathname === href
                    ? "text-amber-400"
                    : "text-white opacity-90 hover:opacity-100 hover:text-amber-300"
                  }`}
              >
                {label}

                {/* Underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-amber-400 transition-all duration-300
                    ${pathname === href
                      ? "w-full"                          // active → full underline
                      : "w-0 group-hover:w-full"          // hover → animate in
                    }`}
                />
              </Link>
            ))}

            {token ? (
              <ProfileDrawer onLogout={handlerLogout} user={user} />
            ) : (
              <>
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 group"
                  title="Login"
                >
                  <LogIn className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => router.push("/post-property")}
                  className=" group relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-4 md:px-5 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-300/50 whitespace-nowrap"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    Post Property
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
               
              </>
            )}
          </nav>
          {/* Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            {token ? (
              <ProfileDrawer onLogout={handlerLogout} user={user} />
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="golden-button group relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  LogIn
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}

            <HeaderDrawer
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              links={links}
            />
          </div>
        </div>
      </header>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialTab={initialTab} />
    </>
  );
}

export default Header;
