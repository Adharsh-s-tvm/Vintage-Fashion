import { useState } from "react";

const OtpModal = ({ formData, showOtpModal, setShowOtpModal, verifyOtpAndSignup  }) => {
    const [otp, setOtp] = useState("");  // ✅ Define OTP inside the component

    if (!showOtpModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Please enter the OTP sent to {formData?.email}
                </p>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                />
                <div className="flex gap-4">
                    <button 
                        onClick={() => verifyOtpAndSignup(otp)} 
                        className="flex-1 bg-blue-500 text-white p-2 rounded">
                        Verify OTP
                    </button>
                    <button
                        onClick={() => setShowOtpModal(false)}
                        className="flex-1 border border-gray-300 p-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpModal;
