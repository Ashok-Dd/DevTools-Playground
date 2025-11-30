import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { Api } from "../Api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const GoogleSignInButton = () => {
  const [details, setDetails] = useState(null);
  const {userInfo , setUserInfo} = useStore() ;
  const navigate = useNavigate();

  // Google Login Success
  const handleSuccess = async (response) => {
    const { access_token } = response;

    try {
      // Fetch user info from Google
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const data = await res.json();

      setDetails(data);

      // Now send user details to backend
      await handleGoogleLogin(data);
    } catch (error) {
      console.log("Error fetching Google user:", error);
    }
  };

  const handleGoogleLogin = async (googleUser) => {
    try {
      const { given_name, email, sub } = googleUser;

      const response = await axios.post(Api + "/auth/google-login", { given_name, email, sub }, { withCredentials: true });

      if (response.data.success) {
        setUserInfo(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  // Google login trigger
  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (err) => console.log("Google Login Failed", err),
    flow: "implicit",
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--hover-bg)] transition-all font-medium"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
