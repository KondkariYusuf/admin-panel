// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import SideBar from "../components/SideBar";

// export default function Settings() {
// 	const [form, setForm] = useState({
// 		email: "",
// 		password: "",
// 	});

// 	const [showPassword, setShowPassword] = useState(false);
// 	const [message, setMessage] = useState("");

// 	const handleChange = (e) => {
// 		setForm({ ...form, [e.target.name]: e.target.value });
// 	};

// 	const togglePassword = () => setShowPassword((s) => !s);

// 	const handleSave = (e) => {
// 		e.preventDefault();
// 		// Placeholder: integrate with API to save settings
// 		setMessage("Settings saved (placeholder).");
// 		setTimeout(() => setMessage(""), 3000);
// 	};

// 	return (
// 		<div>
// 			<Navbar />
// 			<div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-8">
			
				
			
// 			<div className="w-full max-w-md bg-[var(--panel)] p-8 rounded-xl shadow-xl border border-white/10">
// 				<h2 className="text-2xl font-semibold mb-6 text-center">Settings</h2>

// 				{message && <div className="mb-4 text-green-400 text-sm">{message}</div>}

// 				<form onSubmit={handleSave} className="flex flex-col gap-4">

// 					{/* Email */}
// 					<div className="flex flex-col gap-1">
// 						<label className="text-sm text-[var(--muted)]">Email</label>
// 						<input
// 							type="email"
// 							name="email"
// 							value={form.email}
// 							onChange={handleChange}
// 							className="px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none"
// 							placeholder="email@example.com"
// 						/>
// 					</div>

// 					{/* Password with visibility toggle */}
// 					<div className="flex flex-col gap-1 relative">
// 						<label className="text-sm text-[var(--muted)]">Password</label>
// 						<div className="relative">
// 							<input
// 								type={showPassword ? "text" : "password"}
// 								name="password"
// 								value={form.password}
// 								onChange={handleChange}
// 								className="w-full px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none pr-10"
// 								placeholder="Enter new password"
// 							/>

// 							<button
// 								type="button"
// 								onClick={togglePassword}
// 								className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] p-1"
// 								aria-label={showPassword ? "Hide password" : "Show password"}
// 							>
// 								{showPassword ? (
// 									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// 										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.032-5.625M3 3l18 18" />
// 									</svg>
// 								) : (
// 									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// 										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// 										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// 									</svg>
// 								)}
// 							</button>
// 						</div>

// 						<div className="text-right">
// 							<Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:underline">
// 								Forgot password?
// 							</Link>
// 						</div>
// 					</div>

// 					<div className="flex gap-3 mt-2">
// 						<button
// 							type="submit"
// 							className="flex-1 py-2 rounded bg-[var(--accent)] text-black font-medium hover:bg-blue-400 transition"
// 						>
// 							Save
// 						</button>

// 						<Link to="/" className="flex-1 text-center py-2 rounded border border-white/10 hover:bg-white/5 transition">
// 							Cancel
// 						</Link>
// 					</div>

// 				</form>
// 			</div>
// 		</div>
// 		</div>
// 	);
// }


import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import TagInput from "../components/TagInput";
import ImageUpload from "../components/ImageUpload";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";


export default function Settings() {
  

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const togglePassword = () => setShowPassword((s) => !s);

	const handleSave = (e) => {
		e.preventDefault();
		// Placeholder: integrate with API to save settings
		setMessage("Settings saved (placeholder).");
		setTimeout(() => setMessage(""), 3000);
	};
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-50 px-4 py-6 max-w-7xl mx-auto w-full">
        <SideBar />
	
        <div className=" w-full max-w-md bg-[var(--panel)] p-8 rounded-xl shadow-xl border border-white/10">
				<h2 className="text-2xl font-semibold mb-6 text-center">Settings</h2>

				{message && <div className="mb-4 text-green-400 text-sm">{message}</div>}

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

					{/* Password with visibility toggle */}
					<div className="flex flex-col gap-1 relative">
						<label className="text-sm text-[var(--muted)]">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={form.password}
								onChange={handleChange}
								className="w-full px-3 py-2 rounded bg-[#1a2333] border border-white/10 focus:border-[var(--accent)] outline-none pr-10"
								placeholder="Enter new password"
							/>

							<button
								type="button"
								onClick={togglePassword}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] p-1"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.032-5.625M3 3l18 18" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								)}
							</button>
						</div>

						<div className="text-right">
							<Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:underline">
								Forgot password?
							</Link>
						</div>
					</div>

					<div className="flex gap-3 mt-2">
						<button
							type="submit"
							className="flex-1 py-2 rounded bg-[var(--accent)] text-black font-medium hover:bg-blue-400 transition"
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
