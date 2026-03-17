"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('adminUser');
        if (!stored) {
            router.push('/admin/login');
        } else {
            setUser(JSON.parse(stored));
        }
    }, [router]);

    const { data: stats } = useSWR('/api/stats', fetcher);
    const { data: clubs } = useSWR('/api/clubs', fetcher);
    const { data: events } = useSWR('/api/events', fetcher);
    const { data: achievements } = useSWR('/api/achievements', fetcher);

    const cards = [
        { label: "Total Clubs", value: clubs?.length ?? "—", icon: "🏆", color: "bg-brand-srm/10 border-brand-srm/20", href: "/admin/clubs" },
        { label: "Total Athletes", value: stats?.totalMembers ?? "—", icon: "👤", color: "bg-blue-500/10 border-blue-500/20", href: "/admin/clubs" },
        { label: "Live Events", value: events?.filter((e: any) => e.stage === "LIVE").length ?? "—", icon: "🔴", color: "bg-red-500/10 border-red-500/20", href: "/admin/events" },
        { label: "Upcoming Events", value: events?.filter((e: any) => e.stage === "PLANNED").length ?? "—", icon: "📅", color: "bg-amber-500/10 border-amber-500/20", href: "/admin/events" },
        { label: "Achievements", value: achievements?.length ?? "—", icon: "🥇", color: "bg-yellow-500/10 border-yellow-500/20", href: "/admin/achievements" },
    ];

    const quickLinks = [
        { label: "Manage Clubs", icon: "🏅", href: "/admin/clubs", desc: "Edit club info, rosters, gallery" },
        { label: "Manage Events", icon: "📅", href: "/admin/events", desc: "Add live, upcoming, past events" },
        { label: "Achievements", icon: "🏆", href: "/admin/achievements", desc: "Post trophies and records" },
        { label: "News Feed", icon: "📰", href: "/admin/news", desc: "Update news carousel items" },
        { label: "Council Members", icon: "👥", href: "/admin/council", desc: "Manage directors and coaches" },
        { label: "Site Stats", icon: "📊", href: "/admin/stats", desc: "Update Hero section stats" },
    ];

    if (!user) return null;

    return (
        <div className="space-y-12">
            {/* Welcome */}
            <div>
                <p className="text-white/50 font-outfit text-sm mb-1">Welcome back,</p>
                <h1 className="text-4xl font-syne font-extrabold text-white">
                    {user.username} <span className="text-brand-srm text-2xl">{user.role === 'SUPER_ADMIN' ? '⭐ Super Admin' : '🏅 Club Rep'}</span>
                </h1>
                <p className="text-white/40 font-outfit mt-2">SRM Sports Council Content Management System</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Link href={card.href} className={`block p-6 rounded-2xl border ${card.color} bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group`}>
                            <div className="text-3xl mb-3">{card.icon}</div>
                            <div className="text-3xl font-syne font-extrabold text-white group-hover:text-brand-srm transition-colors">{card.value}</div>
                            <div className="text-xs uppercase tracking-widest text-white/50 mt-1 font-bold">{card.label}</div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-xl font-syne font-bold text-white mb-6">Quick Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickLinks.map((link, i) => (
                        <motion.div
                            key={link.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Link href={link.href} className="flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-srm/40 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-brand-srm/20 flex items-center justify-center text-2xl group-hover:bg-brand-srm/40 transition-colors">
                                    {link.icon}
                                </div>
                                <div>
                                    <div className="font-syne font-bold text-white group-hover:text-brand-srm transition-colors">{link.label}</div>
                                    <div className="text-xs text-white/40 font-outfit mt-0.5">{link.desc}</div>
                                </div>
                                <span className="ml-auto text-white/20 group-hover:text-brand-srm transition-colors text-lg">→</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
