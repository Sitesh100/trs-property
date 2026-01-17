"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SignupForm from "./signup-form"
import SendOtpForm from "./send-otp-form"
import VerifyOtpForm from "./verify-otp-form"

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("sendOtp");
  const [sendOtpInfo, setSendOtpInfo] = useState({
    phone: "",
    role: "",
  });

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gradient-to-b from-[#1a1333] to-[#0d0a1a] rounded-lg shadow-xl w-full max-w-2xl z-10 relative"
          >

            {activeTab === "sendOtp" ?
              <SendOtpForm
                onClose={onClose}
                setSendOtpInfo={setSendOtpInfo}
                setActiveTab={setActiveTab}
              /> : activeTab === "verifyOtp" ?
                <VerifyOtpForm
                  onClose={onClose}
                  sendOtpInfo={sendOtpInfo}
                /> :
                <SignupForm
                  setActiveTab={setActiveTab}
                  onClose={onClose}
                />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}



