"use client";

import { motion } from "framer-motion";
import { Target, Users, Trophy, Activity } from "lucide-react";

export default function AboutCouncil() {
    const values = [
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community",
            description: "Fostering a strong sense of belonging and teamwork across all sporting disciplines."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Excellence",
            description: "Striving for athletic and personal excellence in every competition."
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Achievement",
            description: "Celebrating victories and recognizing the hard work of our student-athletes."
        },
        {
            icon: <Activity className="w-8 h-8" />,
            title: "Well-being",
            description: "Promoting physical and mental well-being through sports and physical activities."
        }
    ];

    return (
        <section className="py-32 px-6 md:px-12 bg-background relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements - SRM Themed */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-brand-srm/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-brand-srm/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase border rounded-xl border-brand-srm/20 bg-brand-srm/10 text-brand-srm">
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-6xl font-syne font-extrabold mb-8 text-foreground leading-tight">
                            Elevating the Spirit of <span className="text-brand-srm">Sport</span> at SRM AP
                        </h2>
                        <p className="text-lg text-muted font-outfit leading-relaxed max-w-xl">
                            The SRM Sports Council is dedicated to nurturing athletic talent, promoting sportsmanship, and providing a platform for students to excel in their chosen sporting endeavors.
                            We organize premium events, support competitive clubs, and celebrate every victory of our representing athletes.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border"
                    >
                        <div className="absolute inset-0 bg-brand-srm/20 mix-blend-multiply" />
                        <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop" alt="Sports at SRM" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="text-white font-syne font-bold text-2xl italic">"Where passion meets performance."</div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="theme-card rounded-2xl p-8 hover:border-brand-srm/30 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-brand-srm/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-brand-srm">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-syne font-bold text-foreground mb-3">{value.title}</h3>
                            <p className="text-muted text-sm font-outfit leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

