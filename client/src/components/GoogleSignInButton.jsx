import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { Api } from "../Api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useStore();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    const { access_token } = response;
    setLoading(true);

    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const data = await res.json();

      await handleGoogleLogin(data);
    } catch (error) {
      console.error("Error fetching Google user:", error);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleUser) => {
    try {
      const { given_name, email, sub } = googleUser;

      const response = await axios.post(
        Api + "/auth/google-login",
        { given_name, email, sub },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserInfo(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (err) => console.log("Google Login Failed", err),
    flow: "implicit",
  });

  return (
    <button
      onClick={() => !loading && login()}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all font-medium
        bg-[var(--bg-secondary)] border-[var(--border)] hover:bg-[var(--hover-bg)]
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        // 🔄 Spinner
        <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;
