"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Trophy,
    Newspaper,
    Settings,
    LogOut,
    ChevronRight,
    BarChart2,
} from "lucide-react";

// Links visible to all admins
const sharedLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    { name: "News", href: "/admin/news", icon: Newspaper },
];

// Links only visible to Super Admins
const superAdminLinks = [
    { name: "Clubs", href: "/admin/clubs", icon: Users },
    { name: "Council", href: "/admin/council", icon: Users },
    { name: "Stats", href: "/admin/stats", icon: BarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (pathname === "/admin/login") return;
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            router.push('/admin/login');
            return;
        }
        setUser(JSON.parse(stored));
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    if (pathname === "/admin/login") return <>{children}</>;
    if (!user) return null;

    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const sidebarLinks = isSuperAdmin ? [...sharedLinks, ...superAdminLinks] : sharedLinks;

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col pt-6 bg-black/40 backdrop-blur-xl fixed top-0 left-0 h-full z-30">
                {/* Logo */}
                <div className="px-6 mb-8">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-srm rounded-xl flex items-center justify-center text-lg font-syne font-extrabold text-white shadow-lg">S</div>
                        <div>
                            <div className="font-syne font-extrabold text-white leading-none">Sports CMS</div>
                            <div className="text-[10px] text-white/30 font-outfit uppercase tracking-wider">SRM AP</div>
                        </div>
                    </Link>
                </div>

                {/* Role badge */}
                <div className="px-6 mb-6">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isSuperAdmin ? 'bg-brand-srm/15 border border-brand-srm/30 text-brand-srm' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
                        <span>{isSuperAdmin ? '⭐' : '🏅'}</span>
                        <span className="uppercase tracking-wider">{isSuperAdmin ? 'Super Admin' : 'Club Rep'}</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold px-3 mb-3">Navigation</div>
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive ? "bg-brand-srm/20 text-white border border-brand-srm/30" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                            >
                                <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-srm' : ''}`} />
                                <span className="font-outfit font-medium text-sm">{link.name}</span>
                                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-brand-srm" />}
                            </Link>
                        );
                    })}

                    {/* Separator + public site link */}
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all">
                            <Settings className="w-4 h-4 flex-shrink-0" />
                            <span className="font-outfit font-medium text-sm">View Public Site</span>
                        </Link>
                    </div>
                </nav>

                {/* User footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-srm/20 border border-brand-srm/30 flex items-center justify-center text-sm font-bold text-brand-srm">
                            {user.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">{user.username}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-outfit font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-64 p-10 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
