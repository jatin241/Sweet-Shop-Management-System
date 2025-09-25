import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "./services/api";
import { useAuth } from "./contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const data = await login(email, password);
  authLogin(data.token, email);
  const redirectTo = (location.state as any)?.from?.pathname || "/";
  navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-[#5e2d2d] p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-pink-200 mb-2 text-center">Login</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-4 py-2 rounded bg-[#4d2323] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="px-4 py-2 rounded bg-[#4d2323] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400"
          required
        />
        <button
          type="submit"
          className="bg-pink-400 text-white font-bold py-2 rounded hover:bg-pink-500 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-pink-100 text-center mt-2">
          Don't have an account? <a href="/register" className="text-pink-300 hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
