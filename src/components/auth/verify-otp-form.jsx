import { setToken, setUser } from "@/redux/authSlice";
import { useVerifyOtpMutation } from "@/service/authApi";
import { Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function OtpInput({ length = 4, onChange }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChange?.(newOtp.join(""));

            // Move to next input
            if (value && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevIndex = index - 1;
            inputsRef.current[prevIndex]?.focus();
        }
    };

    return (
        <div className="flex space-x-2 mt-4">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center text-lg bg-[#2a1f45] border border-[#3a2a5a] text-white rounded"
                />
            ))}
        </div>
    );
}

function VerifyOtpForm({ onClose, sendOtpInfo }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [otpValue, setOtpValue] = useState("");
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    const handleOtpChange = (value) => {
        setOtpValue(value);
    };

    const handlerVerifyOtp = async () => {
        if (!otpValue) return toast.error("please fill the otp input");
        try {
            const response = await verifyOtp({ otp: otpValue, phone: sendOtpInfo?.phone, role: sendOtpInfo?.role }).unwrap();
            if (response?.status) {
                dispatch(setToken(response?.user?.access_token));
                dispatch(setUser(response?.user));
                toast.success(response?.message);
                router.push("/property");
                onClose();
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || 'Something went wrong');
        }
    }

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Welcome to RX100 Verify Otp</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="mt-6 flex flex-col justify-start items-center space-y-4">
                    <label className="block text-sm font-medium text-gray-300">Enter OTP</label>
                    <OtpInput onChange={handleOtpChange} />
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handlerVerifyOtp}
                        className="w-full bg-[#2a1f45] hover:bg-[#3a2a5a] text-white font-medium py-2 rounded transition-colors h-10 flex items-center justify-center cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="animate-spin">
                                <Loader />
                            </div>
                        ) : (
                            "Verify Otp"
                        )}
                    </button>
                </div>
            </div>

        </>
    );
}

export default VerifyOtpForm;
