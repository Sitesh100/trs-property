"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GlobalBackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      title="Go back"
      className="fixed left-4 bottom-6 z-50 w-12 h-12 rounded-full bg-[#C6A256] text-[#121212] hidden md:flex items-center justify-center shadow-lg shadow-[#C6A256]/30 hover:bg-[#d4b366] transition-colors duration-300"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}