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
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden bg-gradient-to-br from-[var(--background)] via-[var(--muted)] to-[var(--background)]">
      {/* Candy illustration background */}
      <span className="absolute left-6 top-6 text-6xl opacity-20 select-none">🍬</span>
      <span className="absolute right-8 top-20 text-7xl opacity-10 select-none">🍭</span>
      <span className="absolute left-12 bottom-12 text-8xl opacity-10 select-none">🧁</span>

      <form
        onSubmit={handleSubmit}
        className="bg-[oklch(from_var(--background)_l_c_h_/_80%)] backdrop-blur-md p-8 rounded-3xl shadow-2xl 
                   w-full max-w-sm flex flex-col gap-5 border border-[oklch(from_var(--primary)_l_c_h_/_40%)] relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-[var(--accent)] mb-2 text-center drop-shadow-lg">
          Register
        </h2>

        {error && <div className="text-[var(--destructive)] text-center">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] 
                     focus:outline-none focus:border-[var(--accent)] shadow-sm placeholder-[var(--muted-foreground)]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] 
                     focus:outline-none focus:border-[var(--accent)] shadow-sm placeholder-[var(--muted-foreground)]"
          required
        />

        <label className="flex items-center gap-2 text-[var(--muted-foreground)] font-medium">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
            className="accent-[var(--accent)] scale-110"
          />
          <span className="inline-flex items-center gap-1">
            Register as admin <span className="text-lg">🍩</span>
          </span>
        </label>

        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.07 }}
          type="submit"
          className="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] 
                     text-white font-bold py-3 rounded-full shadow-lg 
                     hover:shadow-[var(--accent)]/30 transition-all disabled:opacity-60 text-lg"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>

        <div className="text-[var(--muted-foreground)] text-center mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-[var(--accent)] hover:underline font-bold">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
