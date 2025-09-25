import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
    const data = await register(email, password, isAdmin);
    authLogin(data.token, email, data.user?.isAdmin || false);
    const redirectTo = (location.state as any)?.from?.pathname || "/";
    navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden">
      {/* Candy illustration background */}
      <span className="absolute left-4 top-4 text-6xl opacity-20 select-none">🍬</span>
      <span className="absolute right-8 top-16 text-7xl opacity-10 select-none">🍭</span>
      <span className="absolute left-10 bottom-10 text-8xl opacity-10 select-none">🧁</span>
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col gap-5 border-2 border-pink-200 relative z-10">
        <h2 className="text-3xl font-extrabold text-pink-400 mb-2 text-center drop-shadow">Register</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl bg-pink-50 text-pink-700 border-2 border-pink-200 focus:outline-none focus:border-pink-400 shadow-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl bg-pink-50 text-pink-700 border-2 border-pink-200 focus:outline-none focus:border-pink-400 shadow-sm"
          required
        />
        <label className="flex items-center gap-2 text-pink-400 font-medium">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
            className="accent-pink-400 scale-110"
          />
          <span className="inline-flex items-center gap-1">Register as admin <span className="text-lg">🍩</span></span>
        </label>
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.07 }}
          type="submit"
          className="bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white font-bold py-3 rounded-full shadow hover:shadow-lg transition-all disabled:opacity-60 text-lg"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>
        <div className="text-pink-400 text-center mt-2">
          Already have an account? <a href="/login" className="text-pink-500 hover:underline font-bold">Login</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
