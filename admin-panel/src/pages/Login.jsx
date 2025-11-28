import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("All fields are required.");
    }

    try {
  const res = await api.post("/auth/login", form);
  console.log("RES:", res); // <--- add this
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    navigate("/");
  } else {
    setError("Invalid email or password");
  }
} catch (err) {
  console.log("ERR:", err); // <--- add this
  setError(err.response?.data?.message || "Login failed.");
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md bg-[var(--panel)] p-8 rounded-xl shadow-xl border border-white/10">
        
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--muted)]">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none"
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--muted)]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full py-2 rounded bg-[var(--accent)] text-black font-medium hover:bg-blue-400 transition"
          >
            Login
          </button>

          {/* Register redirect */}
          <p className="text-sm text-center text-[var(--muted)] mt-3">
            Don’t have an account?
            <Link to="/register" className="text-[var(--accent)] ml-1">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
