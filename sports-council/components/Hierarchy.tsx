"use client";

import { motion } from "framer-motion";
import { clubs } from "./ClubsGrid";

const directorateOfSports = [
    {
        title: "Directorate of Sports",
        members: [
            { name: "Placeholder Name", title: "Director", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Assistant Director", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Sports Officer", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Sports Person", image: "/placeholder-user.jpg" },
        ]
    }
];

const sportsCouncil = [
    {
        tier: "Core Team",
        members: [
            { name: "Placeholder Name", title: "Secretary", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Deputy Secretary", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Joint Secretary", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Treasurer", image: "/placeholder-user.jpg" },
        ]
    },
    {
        tier: "Wings",
        members: [
            { name: "Placeholder Name", title: "Events Wing", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Operations", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Public Relations", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Writers Wing", image: "/placeholder-user.jpg" },
            { name: "Placeholder Name", title: "Technical Wing", image: "/placeholder-user.jpg" },
        ]
    }
];

export default function Hierarchy() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-syne font-bold">Council Hierarchy</h2>
                <p className="mt-4 text-muted font-outfit">The leadership steering SRM Sports towards excellence.</p>
            </div>

            {/* Directorate of Sports */}
            <div className="space-y-20 mb-20">
                {directorateOfSports.map((group) => (
                    <div key={group.title}>
                        <div className="flex items-center gap-6 mb-10">
                            <h3 className="text-lg font-syne font-bold uppercase tracking-widest text-brand-blue">{group.title}</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-blue/30 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {group.members.map((member, mIdx) => (
                                <MemberCard key={member.title} member={member} index={mIdx} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sports Council Header */}
            <div className="mb-10 text-center">
                <h3 className="text-2xl font-syne font-bold">Sports Council</h3>
                <div className="h-[2px] w-24 mx-auto mt-4 bg-brand-indigo/50"></div>
            </div>

            {/* Sports Council - Core Team and Wings */}
            <div className="space-y-20">
                {sportsCouncil.map((group) => (
                    <div key={group.tier}>
                        <div className="flex items-center gap-6 mb-10">
                            <h3 className="text-lg font-syne font-bold uppercase tracking-widest text-brand-indigo">{group.tier}</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-indigo/30 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {group.members.map((member, mIdx) => (
                                <MemberCard key={member.title} member={member} index={mIdx} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Clubs Section */}
                <div>
                    <div className="flex items-center gap-6 mb-10">
                        <h3 className="text-lg font-syne font-bold uppercase tracking-widest text-brand-indigo">Clubs</h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-indigo/30 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clubs.map((club, cIdx) => (
                            <div key={club.id} className="space-y-6 p-6 glass rounded-3xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{club.icon}</span>
                                    <h4 className="text-xl font-syne font-bold">{club.name}</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-xs text-muted uppercase tracking-tighter mb-1">Convenor</p>
                                        <p className="font-syne font-semibold">{club.convenor.name}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-xs text-muted uppercase tracking-tighter mb-1">Co-Convenor</p>
                                        <p className="font-syne font-semibold">{club.coConvenor.name}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MemberCard({ member, index }: { member: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div className="relative aspect-square sm:aspect-[3/4] rounded-2xl overflow-hidden glass mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                    <span className="text-4xl sm:text-6xl text-white">👤</span>
                </div>
            </div>
            <h4 className="text-base sm:text-xl font-syne font-bold group-hover:text-brand-blue transition-colors leading-tight">{member.name}</h4>
            <p className="text-xs sm:text-sm text-muted uppercase tracking-wider mt-1">{member.title}</p>
        </motion.div>
    );
}
