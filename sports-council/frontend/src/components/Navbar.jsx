"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Clubs", href: "/clubs" },
  { name: "Events", href: "/events" },
  { name: "Achievements", href: "/achievements" },
];

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#0c0b06]/95 text-white shadow-2xl shadow-black/30 backdrop-blur-md transition-colors">
      {/* Top Bar - University Colors Strip */}
      <div className="w-full bg-brand-srm text-white text-[10px] font-bold py-1.5 px-6 flex justify-between items-center hidden md:flex uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>✉ info@srmuniversity.ac.in</span>
          <span>📍 SRM University AP, Andhra Pradesh</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:opacity-100 opacity-80">Facebook</span>
          <span className="cursor-pointer hover:opacity-100 opacity-80">Instagram</span>
          <span className="cursor-pointer hover:opacity-100 opacity-80">Twitter</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex h-[70px] items-center justify-between bg-[#0c0b06]/95 px-6 py-4 xl:px-12">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-srm text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg transform group-hover:rotate-6 transition-transform">
            S
          </div>
          <span className="font-syne hidden text-xl font-extrabold uppercase tracking-tight text-white sm:block">
            SRM <span className="text-white/75">Sports</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center h-full gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative h-full flex items-center px-5 font-outfit text-xs font-bold uppercase tracking-widest transition-all rounded-xl hover:bg-brand-srm/5 ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          <div className="hidden md:block">
            <Link
              to="/events"
              className="px-6 py-2.5 bg-brand-srm text-white font-outfit text-xs font-bold tracking-widest uppercase hover:bg-brand-srm_light transition-colors shadow-lg rounded-xl"
            >
              Join a Club
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 rounded-full bg-foreground origin-center"
            />
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-6 h-0.5 rounded-full bg-foreground"
            />
            <motion.span
              initial={false}
              animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 rounded-full bg-foreground origin-center"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[100%] left-0 right-0 bg-background border-b border-border md:hidden overflow-hidden shadow-2xl z-[90]"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-syne font-bold uppercase tracking-wide transition-colors ${
                      isActive ? "text-brand-srm" : "text-foreground opacity-60 hover:opacity-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 bg-brand-srm text-white text-center font-outfit text-lg font-bold tracking-widest uppercase rounded-2xl"
              >
                Join a Club
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
