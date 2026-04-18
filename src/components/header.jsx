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
import { LogIn } from 'lucide-react';
import { clearAuthCookies } from "@/utils/authCookies";

const links = [
  { href: "/", label: "HOME" },
  { href: "/property", label: "PROPERTIES" },
  { href: "/consultant-lounge", label: "CONSULTANT LOUNGE" },
  { href: "/builder-lounge", label: "BUILDER LOUNGE" },
  { href: "/about", label: "ABOUT US" },
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

  const handlerLogout = () => {
    clearAuthCookies();
    dispatch(clearAuth());
    toast.success("Successfully logged out");
    router.push("/");
  };

  const normalizedRole = String(user?.role || user?.user_role || "").toLowerCase();
  const requirementRoute =
    normalizedRole.includes("agent") || normalizedRole.includes("consultant")
      ? "/agent/post-buy-requirement"
      : "/post-buy-requirement";

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#031D36] backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-end shrink-0">
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
            <div className="relative w-40 h-8 xs:w-44 xs:h-9 sm:w-52 sm:h-10 md:w-60 md:h-11 lg:w-76 lg:h-14">
              <Image
                src="/assets/logo/logo4.png"
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
                    ? "text-[#C6A256]"
                    : "text-[#F5EFE7] opacity-90 hover:opacity-100 hover:text-[#C6A256]"
                  }`}
              >
                {label}

                {/* Underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#212121] transition-all duration-300
                    ${pathname === href
                      ? "w-full"                         
                      : "w-0 group-hover:w-full"          
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
                  className="flex items-center cursor-pointer justify-center w-9 h-9 rounded-full bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] hover:shadow-[0_0_20px_rgba(198, 162, 86, 0.5)] transition-all duration-300 group"
                  title="Login"
                >
                  <LogIn className="w-5 h-5 text-[#212121] group-hover:text-[#F5EFE7] transition-colors" />
                </button>
                <button
                  onClick={() => router.push("/post-property")}
                  className=" group relative overflow-hidden bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] px-4 md:px-5 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(198, 162, 86, 0.5)] border border-[#C6A256]/50 whitespace-nowrap"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5EFE7]">
                    Post Property Free
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-[#212121] via-[#212121] to-[#212121] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => router.push(requirementRoute)}
                  className="group relative overflow-hidden bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] px-4 md:px-5 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(198,162,86,0.5)] border border-[#C6A256]/50 whitespace-nowrap"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5EFE7]">
                    Post Requirement Free
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-[#212121] via-[#212121] to-[#212121] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            )}
          </nav>
          {/* Mobile */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            {token ? (
              <ProfileDrawer onLogout={handlerLogout} user={user} />
            ) : (
              <>
                <button
                  onClick={() => router.push(requirementRoute)}
                  className="golden-button group relative overflow-hidden bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap border border-[#C6A256]/60 active:scale-95 transition-all duration-200"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5EFE7]">
                    Post Requirement Free
                  </span>
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="golden-button group relative overflow-hidden bg-linear-to-r from-[#C6A256] via-[#C6A256] to-[#C6A256] text-[#212121] px-4 rounded-md text-sm sm:text-sm font-semibold whitespace-nowrap border border-[#C6A256]/60 active:scale-95 transition-all duration-200"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#F5EFE7]">
                    Login
                  </span>
                  {/* <div className="absolute inset-0 bg-linear-to-r from-[#212121] via-[#212121] to-[#212121] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                </button>
              </>
            )}

            <HeaderDrawer
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              links={links}
              isLoggedIn={Boolean(token)}
              onLogout={handlerLogout}
              onLogin={() => setOpen(true)}
            />
          </div>
        </div>
      </header>

      <AuthModal isOpen={open} onClose={() => setOpen(false)} initialTab={initialTab} />
    </>
  );
}

export default Header;
