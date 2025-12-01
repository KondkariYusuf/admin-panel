import React from "react";
import { NavLink } from "react-router-dom";
import navLinks from "../constants/navLinks";

export default function SideBar() {
  return (
    <aside className="flex w-full md:w-60 flex-col rounded-lg border border-white/10 bg-[var(--panel)] p-4 text-sm text-white/80">
      <div className="mb-3 text-xs uppercase tracking-wide text-[var(--muted)]">
        Quick Links
      </div>
      <nav className="flex flex-col gap-1">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "rounded-md px-3 py-2 transition",
                isActive
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "hover:bg-white/5",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
