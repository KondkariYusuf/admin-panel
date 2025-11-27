import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required.");
    }

    try {
      // send to backend (remove if not ready)
      const res = await api.post("/auth/register", form);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md bg-[var(--panel)] p-8 rounded-xl shadow-xl border border-white/10">
        
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--muted)]">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none"
              placeholder="Your full name"
            />
          </div>

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
              placeholder="Min 6 characters"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full py-2 rounded bg-[var(--accent)] text-black font-medium hover:bg-blue-400 transition"
          >
            Register
          </button>

          {/* Login Redirect */}
          <p className="text-sm text-center text-[var(--muted)] mt-3">
            Already have an account?
            <Link to="/login" className="text-[var(--accent)] ml-1">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
