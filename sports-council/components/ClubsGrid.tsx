"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ClubModal from "./ClubModal";

export interface ClubData {
    id: string;
    name: string;
    icon: string;
    image: string;
    description: string;
    convenor: { name: string; role: string; details: string };
    coConvenor: { name: string; role: string; details: string };
    achievements: string[];
    gallery: { type: 'image' | 'video'; url: string }[];
    coachImage?: string;
}

const clubs: ClubData[] = [
    {
        id: "cricket",
        name: "Cricket",
        icon: "🏏",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
        description: "The Cricket Club at SRM holds a legacy of excellence, producing top-tier athletes who compete at national and international levels.",
        convenor: { name: "Dr. Prem Kumar", role: "Convenor", details: "Veteran coach with 15+ years of experience in regional cricket." },
        coConvenor: { name: "John Doe", role: "Co-Convenor", details: "Former state-level captain and youth mentor." },
        achievements: ["South Zone Inter-University Gold 2024", "National T20 Cup Runners-up 2023", "SRM Premier League Champions"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da' }
        ]
    },
    {
        id: "football",
        name: "Football",
        icon: "⚽",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop",
        description: "Experience the passion and adrenaline of the beautiful game with our elite football club, focusing on tactical brilliance and physical prowess.",
        convenor: { name: "Prof. S. Raj", role: "Convenor", details: "Certified AFC 'A' License coach with a focus on youth development." },
        coConvenor: { name: "Jane Smith", role: "Co-Convenor", details: "Dedicated sports administrator and former collegiate player." },
        achievements: ["All India Inter-University Finalist 2023", "State League Champions 2024", "Best Offensive Team Award"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' }
        ],
        coachImage: "/images/coaches/football_coach.png"
    },
    {
        id: "badminton",
        name: "Badminton",
        icon: "🏸",
        image: "https://images.unsplash.com/photo-1626225453014-490396593447?q=80&w=2070&auto=format&fit=crop",
        description: "Speed, agility, and precision — our badminton club is a hub for high-intensity training and competitive excellence.",
        convenor: { name: "Smt. Shanti Devi", role: "Convenor", details: "Former national player and renowned tactical expert." },
        coConvenor: { name: "Mike Wilson", role: "Co-Convenor", details: "Strength and conditioning specialist for racquet sports." },
        achievements: ["South Zone Champions (Women) 2025", "Inter-Collegiate Gold 2024", "Excellence in Sportsmanship Award"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1626225453014-490396593447' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1626225453014-490396593447' }
        ]
    },
    {
        id: "basketball",
        name: "Basketball",
        icon: "🏀",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop",
        description: "Rise to the challenge with our basketball team, where teamwork and high-octane performance meet the hardwood.",
        convenor: { name: "Mr. K. Verma", role: "Convenor", details: "Experienced coach with multiple state championship titles." },
        coConvenor: { name: "Sarah Lee", role: "Co-Convenor", details: "Expert in player psychology and team building." },
        achievements: ["Zonal Playoff Winners 2024", "Invitational Tournament Gold", "Record for Most Defensive Interceptions"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc' }
        ]
    },
    {
        id: "tennis",
        name: "Tennis",
        icon: "🎾",
        image: "https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6?q=80&w=2070&auto=format&fit=crop",
        description: "From baseline rallies to powerful serves, our tennis club offers world-class training and competitive opportunities.",
        convenor: { name: "Dr. A. Sen", role: "Convenor", details: "Passionate about biomechanics and stroke optimization." },
        coConvenor: { name: "David Miller", role: "Co-Convenor", details: "Former professional circuit player and mentor." },
        achievements: ["Inter-University Tennis Shield 2023", "Open Singles Champion (Zonal)", "Mixed Doubles Invitational Gold"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6' }
        ]
    },
    {
        id: "chess",
        name: "Chess",
        icon: "♟️",
        image: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop",
        description: "The game of kings. Our chess club fosters strategic thinking and mental resilience among the finest minds of the university.",
        convenor: { name: "Mr. B. Gupta", role: "Convenor", details: "International Master with a passion for teaching opening theory." },
        coConvenor: { name: "Elena Petrova", role: "Co-Convenor", details: "Expert in endgame analysis and tournament strategy." },
        achievements: ["National Collegiate Chess Masters 2024", "Zonal Rapid Chess Gold", "Problem Solving Championship Winners"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461' },
            { type: 'video', url: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793' }
        ]
    },
];

export default function ClubsGrid() {
    const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, idx) => (
                    <motion.div
                        key={club.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -10 }}
                        onClick={() => {
                            console.log("Opening club:", club.name);
                            setSelectedClub(club);
                        }}
                        className="group relative h-[300px] rounded-[2rem] overflow-hidden glass cursor-pointer"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={club.image}
                                alt={club.name}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-2">{club.icon}</div>
                                <h3 className="text-2xl font-syne font-bold">{club.name}</h3>
                            </div>
                            <div className="w-12 h-12 glass rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <span className="text-xl">→</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Expansion Slot */}
                <div className="h-[300px] rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-muted">
                    <div className="text-4xl mb-2">➕</div>
                    <div className="text-sm font-outfit uppercase tracking-widest">More Coming Soon</div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedClub && (
                    <ClubModal
                        club={selectedClub}
                        onClose={() => setSelectedClub(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
