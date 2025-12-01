import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { Link, useNavigate } from "react-router-dom";


export default function Settings() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [adminId, setAdminId] = useState(null);
	const [hasPassword, setHasPassword] = useState(null);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const togglePassword = () => setShowPassword((s) => !s);

	// Fetch current admin id then admin data
	useEffect(() => {
		let mounted = true;
		const load = async () => {
			setLoading(true);
			try {
				const verifyRes = await api.get("/auth/verify");
				const id = verifyRes.data?.admin?.id || verifyRes.data?.admin?._id || null;
				if (!id) {
					setError("Unable to determine current admin. Please log in again.");
					// optionally navigate to login
					// navigate('/login');
					setLoading(false);
					return;
				}

				setAdminId(id);
				const adminRes = await api.get(`/admin/${id}`);
				if (!mounted) return;
				setForm((f) => ({ ...f, email: adminRes.data?.email || "" }));
				setHasPassword(adminRes.data?.hasPassword ?? false);
			} catch (err) {
				console.error(err);
				setError(err.response?.data?.message || "Failed to load profile.");
				// If token invalid, redirect to login
				if (err.response?.status === 401) {
					localStorage.removeItem("token");
					navigate("/login");
				}
			} finally {
				if (mounted) setLoading(false);
			}
		};
		load();
		return () => { mounted = false; };
	}, [navigate]);

	const handleSave = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		if (!adminId) return setError("Cannot update: missing admin id.");

		const payload = {};
		if (form.email) payload.email = form.email;

		// Include password change only when user has opened the change-password flow
		if (showChangePassword) {
			if (!currentPassword) return setError("Please enter your current password.");
			if (!newPassword) return setError("Please enter a new password.");
			if (newPassword !== confirmPassword) return setError("New password and confirm password do not match.");
			payload.currentPassword = currentPassword;
			payload.password = newPassword;
		}

		if (!payload.email && !payload.password) {
			return setError("No changes to save.");
		}

		try {
			setLoading(true);
			const res = await api.put(`/admin/${adminId}`, payload);
			setMessage("Settings saved.");
			setForm((f) => ({ ...f, password: "" }));
			// after successful update, clear change-password fields and update flag
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setShowChangePassword(false);
			setHasPassword(res.data?.hasPassword ?? hasPassword);
			// Optionally update token or local state if email affects auth
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || "Failed to save settings.");
			if (err.response?.status === 401) {
				localStorage.removeItem("token");
				navigate("/login");
			}
		} finally {
			setLoading(false);
			setTimeout(() => setMessage(""), 3000);
		}
	};

	return (
		<div className="">
			<Navbar />
			<div className="flex flex-col md:flex-row gap-50 px-4 py-6 max-w-7xl mx-auto w-full">
				<SideBar />

				<div className=" w-full max-w-md bg-[var(--panel)] p-8 rounded-xl shadow-xl border border-white/10">
					<h2 className="text-2xl font-semibold mb-6 text-center">Settings</h2>

					{loading && <div className="mb-4 text-sm text-[var(--muted)]">Loading...</div>}
					{message && <div className="mb-4 text-green-400 text-sm">{message}</div>}
					{error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

					<form onSubmit={handleSave} className="flex flex-col gap-4">

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

						{/* Password / Change-password flow */}
						<div className="flex flex-col gap-1">
							<label className="text-sm text-[var(--muted)]">Password</label>
							{hasPassword !== null && (
								<div className="text-xs mt-1 text-[var(--muted)]">
									{hasPassword ? <span className="text-[var(--muted)]">Password is set</span> : <span className="text-yellow-400">No password set</span>}
								</div>
							)}

							<div className="flex items-center gap-3 mt-2">
								<button
									type="button"
									onClick={() => setShowChangePassword((s) => !s)}
									className="px-3 py-1 rounded bg-white/5 text-sm hover:bg-white/10"
								>
									{showChangePassword ? "Cancel change" : "Change password"}
								</button>
								<div className="ml-auto text-right">
									<Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:underline">
										Forgot password?
									</Link>
								</div>
							</div>

							{showChangePassword && (
								<div className="mt-3 flex flex-col gap-2">
									<input
										type="password"
										placeholder="Current password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 outline-none"
									/>
									<div className="relative">
										<input
											type={showPassword ? "text" : "password"}
											placeholder="New password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											className="w-full px-3 py-2 rounded bg-[#1a2333] border border-white/10 outline-none pr-10"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((s) => !s)}
											className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] p-1"
										>
											{showPassword ? (
												"Hide"
											) : (
												"Show"
											)}
										</button>
										</div>
										<input
											type="password"
											placeholder="Confirm new password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 outline-none"
										/>
								</div>
							)}
						</div>

						<div className="flex gap-3 mt-2">
							<button
								type="submit"
								className="flex-1 py-2 rounded bg-[var(--accent)] text-black font-medium hover:bg-blue-400 transition"
								disabled={loading}
							>
								Save
							</button>

							<Link to="/" className="flex-1 text-center py-2 rounded border border-white/10 hover:bg-white/5 transition">
								Cancel
							</Link>
						</div>

					</form>
				</div>
			</div>
		</div>
	);
}
