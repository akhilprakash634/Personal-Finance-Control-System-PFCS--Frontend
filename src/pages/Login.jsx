import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinanceStore } from "../store/financeStore";
import { Wallet } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useFinanceStore();
  const googleBtnRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }

    const initGoogle = () => {
      if (window.google) {
        try {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          if (!clientId) {
            console.error("VITE_GOOGLE_CLIENT_ID is missing!");
            setError("Google configuration error. Please check environment variables.");
            return;
          }

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              const success = await login(response.credential);
              if (success) navigate("/");
              else setError("Login failed. Please try again.");
            },
          });

          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_blue",
            size: "large",
            text: "signin_with",
            shape: "pill",
            width: "300", // Fixed width helps on mobile
          });
        } catch (err) {
          console.error("Google Auth Init Error:", err);
        }
      }
    };

    // Retry if script not loaded yet
    const interval = setInterval(() => {
      if (window.google) {
        initGoogle();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [user, login, navigate]);

  return (
    <div className="flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3 justify-center">
          <Wallet size={48} className="text-primary" />
          <h1 style={{ fontSize: "clamp(2rem, 10vw, 3rem)", margin: 0 }}>PFCS</h1>
        </div>
        <p className="text-secondary text-lg">Personal Finance Control System</p>
      </div>

      <div className="card flex-col items-center gap-6" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem" }}>
        <div className="text-center">
          <h2 style={{ fontSize: "1.5rem" }}>Welcome Back</h2>
          <p className="text-secondary">Securely manage your loans and finances</p>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-100 p-3 rounded-lg w-full text-center">
            {error}
          </div>
        )}

        <div ref={googleBtnRef} style={{ minHeight: "44px" }}></div>

        <div className="text-center text-xs text-secondary mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
