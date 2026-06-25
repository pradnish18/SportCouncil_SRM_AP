"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";

export default function AuthModal({ mode: initialMode = "signin", onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login, signup, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (mode === "signup" && !name) {
      setError("Please enter your name");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = mode === "signin"
      ? await login(email, password)
      : await signup(name, email, password);

    if (result.success) {
      setSuccess(mode === "signin" ? "Signed in successfully!" : "Account created successfully!");
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 800);
    } else {
      setError(result.error);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setSuccess("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md glass rounded-[2.5rem] shadow-2xl p-8 md:p-10"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-20 w-20 rounded-2xl overflow-hidden bg-background p-2">
            <img
              src="/images/sports-council-logo.png"
              alt="SRM Sports Council"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <h2 className="text-2xl font-syne font-bold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-muted font-outfit mt-2">
            {mode === "signin"
              ? "Sign in to join clubs and connect with your sports community"
              : "Sign up to start your journey with SRM Sports Council"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
            />
          )}

          <input
            type="email"
            placeholder="SRM AP Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-srm/30 font-outfit"
          />

          {error && (
            <p className="text-sm text-red-500 font-outfit bg-red-500/10 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-500 font-outfit bg-green-500/10 rounded-xl px-4 py-3">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-srm text-white font-bold font-outfit hover:bg-brand-srm/90 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted font-outfit">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              className="text-brand-srm font-bold hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
