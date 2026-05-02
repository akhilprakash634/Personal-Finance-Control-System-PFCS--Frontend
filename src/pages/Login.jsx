import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFinanceStore } from "../store/financeStore";
import { Wallet } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useFinanceStore();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }

    // Initialize Google Login
    const handleCredentialResponse = async (response) => {
      const success = await login(response.credential);
      if (success) {
        navigate("/");
      }
    };

    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_blue",
        size: "large",
        text: "continue_with",
        shape: "pill",
      });
    }
  }, [user, login, navigate]);

  return (
    <div className="flex-col items-center justify-center min-h-screen gap-8">
      <div className="flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Wallet size={48} className="text-primary" />
          <h1 style={{ fontSize: "3rem", margin: 0 }}>PFCS</h1>
        </div>
        <p className="text-secondary text-lg">Personal Finance Control System</p>
      </div>

      <div className="card flex-col items-center gap-6" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem" }}>
        <div className="text-center">
          <h2>Welcome Back</h2>
          <p className="text-secondary">Securely manage your loans and finances</p>
        </div>

        <div ref={googleBtnRef}></div>

        <div className="text-center text-xs text-secondary mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
