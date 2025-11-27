import React, { useState } from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Contact Us", to: "/contact" },

    
  ];

  return (
    <nav className="w-full bg-[var(--panel)] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          <Link to="/">
          <img src="/administrator.png" alt="" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm hover:text-[var(--accent)] transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Logout button */}
          <button className="px-4 py-2 bg-red-600 text-sm rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-[3px]"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[var(--panel)] border-t border-white/10 px-4 py-3 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-sm hover:text-[var(--accent)]"
            >
              {item.label}
            </Link>
          ))}

          <button className="w-full px-4 py-2 bg-red-600 text-sm rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
