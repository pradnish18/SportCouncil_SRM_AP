"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const trophies = [
    { id: 1, title: "South Zone Cricket Gold", year: "2025", category: "Inter-University", image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2071&auto=format&fit=crop" },
    { id: 2, title: "State Football Runners-up", year: "2024", category: "State Level", image: "https://images.unsplash.com/photo-1423928930836-8e99351c3905?q=80&w=2070&auto=format&fit=crop" },
    { id: 3, title: "Kabaddi Intra-Hostel Trophy", year: "2025", category: "Hostel League", image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=2070&auto=format&fit=crop" },
    { id: 4, title: "Zonal Chess Championship", year: "2023", category: "Inter-University", image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2072&auto=format&fit=crop" },
];

const records = [
    { student: "Alex James", achievement: "100m Sprint Record - 10.4s", year: "2024", level: "National Level" },
    { student: "Sarah Khan", achievement: "Highest Run Scorer (EVC)", year: "2025", level: "Inter-School" },
];

export default function AchievementsGallery() {
    return (
        <div className="space-y-24">
            {/* Trophy Masonry */}
            <div>
                <h2 className="text-3xl font-syne font-bold mb-12">Trophy Cabinet</h2>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {trophies.map((trophy, idx) => (
                        <motion.div
                            key={trophy.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative break-inside-avoid rounded-3xl overflow-hidden glass group h-[300px]"
                        >
                            <Image
                                src={trophy.image}
                                alt={trophy.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="text-[10px] uppercase tracking-widest text-brand-purple mb-1 font-bold">{trophy.category}</div>
                                <h3 className="text-xl font-syne font-bold">{trophy.title}</h3>
                                <div className="text-sm text-muted mt-1">{trophy.year}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Individual Records */}
            <div className="border-t border-white/5 pt-24">
                <h2 className="text-3xl font-syne font-bold mb-12">Athlete Records</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {records.map((r, idx) => (
                        <motion.div
                            key={r.student}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 glass rounded-3xl border-l-4 border-brand-purple flex items-start justify-between"
                        >
                            <div>
                                <h4 className="text-2xl font-syne font-bold mb-2">{r.student}</h4>
                                <p className="text-lg text-muted font-outfit">{r.achievement}</p>
                                <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest font-bold">
                                    <span className="text-brand-purple">{r.level}</span>
                                    <span className="opacity-30">|</span>
                                    <span className="text-muted">{r.year}</span>
                                </div>
                            </div>
                            <span className="text-4xl">🥇</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
