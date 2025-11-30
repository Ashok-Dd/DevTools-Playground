import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Loader2 } from "lucide-react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import { useState } from "react";
import axios from "axios";
import { Api } from "../../Api";
import { useStore } from "../../store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { setUserInfo } = useStore();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      if(password.length < 6) {
        setError("Password must have atleast 6 characters");
        return ;
      }
      const response = await axios.post(
        Api + "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserInfo(response.data.user);
        return nav("/dashboard");
      }

      setError(response.data.message || "Login failed. Try again.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-4 transition-all">
      {/* Back Button */}
      <button
        className="absolute top-4 z-50 left-4 p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border)]"
        onClick={() => nav("/")}
      >
        <ArrowLeft />
      </button>

      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-1 text-center">Welcome Back</h2>
        <p className="text-[var(--text-light)] text-center mb-8">
          Sign in to continue
        </p>

        {/* Error Box */}
        {error && (
          <div className="mb-4 w-full bg-red-500/15 text-red-400 border border-red-500/30 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Email</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <Mail size={18} className="text-[var(--text-light)]" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-[var(--text)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Password</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <Lock size={18} className="text-[var(--text-light)]" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none text-[var(--text)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          onClick={handleLogin}
          className={`w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl 
            bg-gradient-to-r from-[var(--primary)] to-purple-600 
            hover:from-[var(--primary-hover)] hover:to-purple-700 
            text-white font-semibold shadow-lg shadow-[var(--primary)]/30 transition-all
            ${loading && "opacity-70 cursor-not-allowed"}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Signing In...
            </>
          ) : (
            <>
              <LogIn size={18} /> Sign In
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border)]"></div>
          <span className="text-[var(--text-light)] text-sm">OR</span>
          <div className="flex-1 h-px bg-[var(--border)]"></div>
        </div>

        {/* Google Login */}
        <GoogleSignInButton />

        {/* Footer */}
        <p className="text-center mt-6 text-[var(--text-light)] text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
