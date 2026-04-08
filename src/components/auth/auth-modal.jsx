"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "./signup-form";
import SendOtpForm from "./send-otp-form";
// import VerifyOtpForm from "./verify-otp-form"; // OTP functionality commented out

export default function AuthModal({ isOpen, onClose, initialTab = "sendOtp" }) {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sendOtpInfo, setSendOtpInfo] = useState({ phone: "", email: "", role: "" });

  // 🔥 YE NAYA HAI (BAS YE)
  useEffect(() => {
    const openModal = (event) => {
      const eventDetails = event?.detail || {};
      const tab = eventDetails?.tab || "sendOtp";
      const nextSendOtpInfo = eventDetails?.sendOtpInfo || { phone: "", email: "", role: "" };

      setSendOtpInfo((prev) => ({ ...prev, ...nextSendOtpInfo }));
      setActiveTab(tab);
      setInternalOpen(true);
    };
    window.addEventListener("open-auth-modal", openModal);
    return () => window.removeEventListener("open-auth-modal", openModal);
  }, []);

  useEffect(() => {
    setInternalOpen(isOpen);
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handleClose = () => {
    setInternalOpen(false);
    onClose();
  };

  if (!internalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          className="fixed inset-0 bg-[#020814]/80 backdrop-blur-[2px]"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`bg-[#0A1F3D] border border-[#C6A256]/35 rounded-xl shadow-2xl shadow-[#000000]/70 w-full z-10 mx-4 ${
            activeTab === "signup"
              ? "max-w-5xl overflow-visible"
              : "max-w-md max-h-[90vh] overflow-y-auto"
          }`}
        >
          {/* Login Form (Direct Login - No OTP) */}
          {activeTab === "sendOtp" && (
            <SendOtpForm
              onClose={handleClose}
              setSendOtpInfo={setSendOtpInfo}
              sendOtpInfo={sendOtpInfo}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Signup Form (Direct Signup - No OTP) */}
          {activeTab === "signup" && (
            <SignupForm
              setActiveTab={setActiveTab}
              onClose={handleClose}
              sendOtpInfo={sendOtpInfo}
              setSendOtpInfo={setSendOtpInfo}
            />
          )}

          {/* OTP Verification - COMMENTED OUT */}
          {/* {activeTab === "verifyOtp" && (
            <VerifyOtpForm
              onClose={handleClose}
              sendOtpInfo={sendOtpInfo}
              setActiveTab={setActiveTab}
            />
          )} */}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
