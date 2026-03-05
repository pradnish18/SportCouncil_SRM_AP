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

export const clubs: ClubData[] = [
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
            { type: 'image', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e' }
        ]
    },
    {
        id: "badminton",
        name: "Badminton",
        icon: "🏸",
        image: "https://images.unsplash.com/photo-1626225453014-490396593447?q=80&w=2070&auto=format&fit=crop",
        description: "Speed, agility, and precision — our badminton club is a hub for high-intensity training and competitive excellence.",
        convenor: { name: "Smt. Shanti Devi", role: "Convenor", details: "Former national player and renowned tactical expert." },
        coConvenor: { name: "Mike Wilson", role: "Co-Convenor", details: "Strength and conditioning specialist for racquet sports." },
        achievements: ["South Zone Champions (Women) 2025", "Inter-Collegiate Gold 2024"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1626225453014-490396593447' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef' }
        ]
    },
    {
        id: "volleyball",
        name: "Volleyball",
        icon: "🏐",
        image: "https://images.unsplash.com/photo-1592656094267-764a45159577?q=80&w=2070&auto=format&fit=crop",
        description: "High-flying action and seamless teamwork define our Volleyball club, where every spike tells a story of dedication.",
        convenor: { name: "Mr. R. Sharma", role: "Convenor", details: "Former national level setter with focus on team synergy." },
        coConvenor: { name: "Anjali Gupta", role: "Co-Convenor", details: "Specialist in defensive strategies and player stamina." },
        achievements: ["Zonal Runner-up 2024", "State Invitational Gold"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1592656094267-764a45159577' }
        ]
    },
    {
        id: "kabaddi",
        name: "Kabaddi",
        icon: "🤼",
        image: "https://images.unsplash.com/photo-1612872089673-98782ee9f835?q=80&w=2070&auto=format&fit=crop",
        description: "Experience the raw power and tactical depth of Kabaddi, a sport rooted in tradition and fueled by modern athleticism.",
        convenor: { name: "Mr. Vikram Singh", role: "Convenor", details: "Renowned coach with expertise in traditional raiding techniques." },
        coConvenor: { name: "Amit Kumar", role: "Co-Convenor", details: "Expert in defensive locks and team coordination." },
        achievements: ["All India Inter-University Bronze 2023", "State Pro-Kabaddi Trials Winners"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1612872089673-98782ee9f835' }
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
        achievements: ["All India Inter-University Finalist 2023", "State League Champions 2024"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa' }
        ],
        coachImage: "/images/coaches/football_coach.png"
    },
    {
        id: "tennis",
        name: "Tennis",
        icon: "🎾",
        image: "https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6?q=80&w=2070&auto=format&fit=crop",
        description: "From baseline rallies to powerful serves, our tennis club offers world-class training and competitive opportunities.",
        convenor: { name: "Dr. A. Sen", role: "Convenor", details: "Passionate about biomechanics and stroke optimization." },
        coConvenor: { name: "David Miller", role: "Co-Convenor", details: "Former professional circuit player and mentor." },
        achievements: ["Inter-University Tennis Shield 2023", "Open Singles Champion (Zonal)"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece' }
        ]
    },
    {
        id: "table-tennis",
        name: "Table Tennis",
        icon: "🏓",
        image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2070&auto=format&fit=crop",
        description: "Precision, reflexes, and lightning-fast rallies — our table tennis club is for those who master the art of the small ball.",
        convenor: { name: "Ms. Sunita Rao", role: "Convenor", details: "Former state champion with a focus on deceptive spin techniques." },
        coConvenor: { name: "Rajesh Khanna", role: "Co-Convenor", details: "Expert in player agility and mental focus." },
        achievements: ["South Zone Inter-University Gold 2024", "Inter-Collegiate Team Champions"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900' }
        ]
    },
    {
        id: "carrom",
        name: "Carrom",
        icon: "♟️",
        image: "https://images.unsplash.com/photo-1611091565578-831518349257?q=80&w=2070&auto=format&fit=crop",
        description: "A blend of strategy and touch, the Carrom club provides a platform for precision players to showcase their skills.",
        convenor: { name: "Mr. T. Mani", role: "Convenor", details: "National level carrom referee and veteran player." },
        coConvenor: { name: "Suresh G.", role: "Co-Convenor", details: "Expert in board strategy and tournament organization." },
        achievements: ["University Open Champions 2024", "State Board Masters Runner-up"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1611091565578-831518349257' }
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
        achievements: ["National Collegiate Chess Masters 2024", "Zonal Rapid Chess Gold"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461' }
        ]
    },
    {
        id: "athletics",
        name: "Athletics",
        icon: "🏃",
        image: "https://images.unsplash.com/photo-1461896756985-23w78536ec6b?q=80&w=2070&auto=format&fit=crop",
        description: "The foundation of all sports. Our athletics club trains students in track and field events with elite coaching.",
        convenor: { name: "Dr. L. Narayana", role: "Convenor", details: "Former Olympic qualifier coach with focus on biomechanics." },
        coConvenor: { name: "Priya Das", role: "Co-Convenor", details: "Specialist in middle-distance running and endurance." },
        achievements: ["All India Inter-University Track Gold 2024", "Best Athletics Team Award"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1461896756985-23w78536ec6b' }
        ]
    },
    {
        id: "gymnasium",
        name: "Gymnasium",
        icon: "🏋️",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
        description: "Build strength and character in our state-of-the-art gymnasium, where fitness meets science.",
        convenor: { name: "Mr. S. Kulkarni", role: "Convenor", details: "Certified master trainer with expertise in strength conditioning." },
        coConvenor: { name: "Rahul V.", role: "Co-Convenor", details: "Expert in bodybuilding and nutritional science." },
        achievements: ["Inter-Collegiate Best Physique Gold", "University Fitness Excellence 2024"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }
        ]
    },
    {
        id: "fitness",
        name: "Fitness",
        icon: "💪",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac00ad?q=80&w=2070&auto=format&fit=crop",
        description: "Promoting a culture of health and wellness through diverse fitness programs and community engagement.",
        convenor: { name: "Ms. Aarti Shah", role: "Convenor", details: "Renowned lifestyle coach and metabolic health expert." },
        coConvenor: { name: "Sameer J.", role: "Co-Convenor", details: "Specialist in functional training and HIIT." },
        achievements: ["Campus Wellness Leadership Award", "Fitness Challenge Winners 2023"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac00ad' }
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
        achievements: ["Zonal Playoff Winners 2024", "Invitational Tournament Gold"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a' }
        ]
    },
    {
        id: "yoga-meditation",
        name: "Yoga and Meditation",
        icon: "🧘",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
        description: "Achieve balance of mind and body through our Yoga and Meditation programs, focusing on holistic well-being.",
        convenor: { name: "Swami Atmananda", role: "Convenor", details: "Practitioner of Hatha and Raja Yoga with decades of experience." },
        coConvenor: { name: "Dr. Rekha M.", role: "Co-Convenor", details: "Expert in mindfulness-based stress reduction (MBSR)." },
        achievements: ["International Yoga Day Lead Organizers", "Excellence in Holistic Health Award"],
        gallery: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b' }
        ]
    }
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
