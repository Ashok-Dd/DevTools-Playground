import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Check, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Api } from "../../Api";
import { useStore } from "../../store";

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const {usetInfo , setUserInfo} = useStore()

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    setError("");

    // Basic validation
    if (!username || !email || !password || !cpassword) {
      return setError("All fields are required!");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters!");
    }

    if (password !== cpassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        Api + "/auth/register",
        { username, email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        setUserInfo(res.data.user)
        nav("/");
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex justify-center items-center px-4 transition-all">
      
      <button
        className="absolute top-4 left-4 cursor-pointer z-50 p-2 rounded-lg bg-[var(--card-bg)]"
        onClick={() => nav("/")}
      >
        <ArrowLeft />
      </button>

      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-[var(--text-light)] text-center mb-8">
          Join the developer community
        </p>

        {/* Error Box */}
        {error && (
          <div className="mb-4 w-full bg-red-500/15 text-red-400 border border-red-500/30 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Username</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <User size={18} className="text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full bg-transparent outline-none text-[var(--text)]"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">Email</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <Mail size={18} className="text-[var(--text-light)]" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-[var(--text)]"
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
              placeholder="Create password"
              className="w-full bg-transparent outline-none text-[var(--text)]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Confirm Password</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <Check size={18} className="text-[var(--text-light)]" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-transparent outline-none text-[var(--text)]"
              onChange={(e) => setCpassword(e.target.value)}
            />
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
            bg-gradient-to-r from-[var(--primary)] to-purple-600 
            hover:from-[var(--primary-hover)] hover:to-purple-700 
            text-white font-semibold shadow-lg shadow-[var(--primary)]/30 
            transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
        </button>

        {/* Footer */}
        <p className="text-center mt-6 text-[var(--text-light)] text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
