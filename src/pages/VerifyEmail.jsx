import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import api from "../config/api";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying your email, please wait...");
    const [error, setError] = useState(null);
    
    
    const hasCalledApi = useRef(false);

    useEffect(() => {
        const verifyUserEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setError("Invalid link. The verification token is missing.");
                setStatus("");
                return;
            }

            if (hasCalledApi.current) return;
            hasCalledApi.current = true; 

            try {
              
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await api.get(`${backendUrl}/auth/verify-email?token=${token}`);

                if (response.data.success) {
                    setStatus("Email verified successfully! Redirecting to login...");
                    toast.success("Email verified successfully!"); 
                    
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);
                }
            } catch (err) {
                console.error(err);
              
                const serverMessage = err.response?.data?.message || "Verification failed. The link might be expired.";
                setError(serverMessage);
                toast.error(serverMessage); 
                setStatus("");
            }
        };

        verifyUserEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                
                {status && <p className="text-blue-600 font-medium">{status}</p>}
                
                {error && (
                    <div>
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <button 
                            onClick={() => navigate("/")} 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;