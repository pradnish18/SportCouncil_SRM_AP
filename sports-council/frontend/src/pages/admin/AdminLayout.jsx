import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Shield, Calendar, Award, Newspaper, Users, BarChart3 } from "lucide-react";

const iconMap = {
  Dashboard: LayoutDashboard,
  Clubs: Shield,
  Events: Calendar,
  Achievements: Award,
  News: Newspaper,
  Council: Users,
  Stats: BarChart3,
};

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/clubs", label: "Clubs", icon: Shield },
    { path: "/admin/events", label: "Events", icon: Calendar },
    { path: "/admin/achievements", label: "Achievements", icon: Award },
    { path: "/admin/news", label: "News", icon: Newspaper },
    { path: "/admin/council", label: "Council", icon: Users },
    { path: "/admin/stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-syne font-bold text-brand-srm">
              SRM Sports
            </Link>
            <span className="text-muted">Admin Panel</span>
          </div>
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-brand-srm text-white rounded-lg hover:bg-brand-srm/90 transition-colors"
          >
            Logout
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)] p-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-brand-srm text-white"
                      : "hover:bg-brand-srm/10 text-foreground"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
