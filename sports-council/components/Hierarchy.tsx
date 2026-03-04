"use client";

import { motion } from "framer-motion";

const hierarchy = [
    {
        tier: "Directors",
        members: [
            { name: "Dr. Prem Kumar", title: "Sports Director", image: "/placeholder-user.jpg" },
            { name: "Smt. Shanti Devi", title: "Deputy Director", image: "/placeholder-user.jpg" },
        ]
    },
    {
        tier: "Convenors",
        members: [
            { name: "John Doe", title: "Cricket Convenor", image: "/placeholder-user.jpg" },
            { name: "Jane Smith", title: "Football Convenor", image: "/placeholder-user.jpg" },
        ]
    },
    {
        tier: "Coaches",
        members: [
            { name: "Coach Mike", title: "Athletics Coach", image: "/placeholder-user.jpg" },
            { name: "Coach Sarah", title: "Basketball Coach", image: "/placeholder-user.jpg" },
        ]
    },
    {
        tier: "Student Body",
        members: [
            { name: "Alex Johnson", title: "President", image: "/placeholder-user.jpg" },
            { name: "Sam Williams", title: "Secretary", image: "/placeholder-user.jpg" },
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

            <div className="space-y-20">
                {hierarchy.map((group, gIdx) => (
                    <div key={group.tier}>
                        <div className="flex items-center gap-6 mb-10">
                            <h3 className="text-lg font-syne font-bold uppercase tracking-widest text-brand-indigo">{group.tier}</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-indigo/30 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {group.members.map((member, mIdx) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: mIdx * 0.1 }}
                                    className="group"
                                >
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass mb-4">
                                        <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors"></div>
                                        {/* Placeholder image overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                            <span className="text-6xl text-white">👤</span>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-syne font-bold group-hover:text-brand-blue transition-colors">{member.name}</h4>
                                    <p className="text-sm text-muted uppercase tracking-wider mt-1">{member.title}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
