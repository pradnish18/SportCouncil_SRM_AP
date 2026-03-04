"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Trophy,
    Newspaper,
    Settings,
    LogOut
} from "lucide-react";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Clubs", href: "/admin/clubs", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    { name: "News", href: "/admin/news", icon: Newspaper },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === "/admin/login") return <>{children}</>;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/5 flex flex-col pt-8">
                <div className="px-8 mb-12">
                    <Link href="/admin" className="font-syne font-extrabold text-2xl flex items-center gap-2">
                        <span className="text-3xl">🏅</span>
                        <span>CMS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isActive ? "bg-brand-blue text-white shadow-lg" : "text-muted hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="font-outfit font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span className="font-outfit font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
