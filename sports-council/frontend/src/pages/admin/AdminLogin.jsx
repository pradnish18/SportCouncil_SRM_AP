import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("adminToken", data.token || "authenticated");
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10"
      >
        <div className="rounded-2xl border border-border bg-card p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="mx-auto mb-6 h-24 w-24 rounded-2xl overflow-hidden shadow-lg shadow-brand-srm/20 bg-background p-2">
              <img
                src="/images/sports-council-logo.png"
                alt="SRM Sports Council"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <h2 className="text-3xl font-syne font-bold text-foreground">Admin Login</h2>
            <p className="mt-3 text-sm text-muted">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-muted">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="block w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500 font-medium"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-srm py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-srm/20 hover:bg-brand-srm/90 focus:outline-none focus:ring-2 focus:ring-brand-srm focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
