"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import ClubModal from "./ClubModal";
import useSWR from "swr";
import { fetcher } from "../lib/api";

export const clubs = [
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
      { type: "image", url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da" },
      { type: "image", url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e" },
    ],
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "🏸",
    image: "https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w1460/f_auto/primary/tdslyl0pptzs6vst4uq5",
    description: "Speed, agility, and precision — our badminton club is a hub for high-intensity training and competitive excellence.",
    convenor: { name: "Smt. Shanti Devi", role: "Convenor", details: "Former national player and renowned tactical expert." },
    coConvenor: { name: "Mike Wilson", role: "Co-Convenor", details: "Strength and conditioning specialist for racquet sports." },
    achievements: ["South Zone Champions (Women) 2025", "Inter-Collegiate Gold 2024"],
    gallery: [
      { type: "image", url: "https://images.unsplash.com/photo-1626225453014-490396593447" },
      { type: "image", url: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef" },
    ],
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "🏐",
    image: "https://www.lasemaine.fr/wp-content/uploads/2025/08/Volley.jpeg",
    description: "High-flying action and seamless teamwork define our Volleyball club, where every spike tells a story of dedication.",
    convenor: { name: "Mr. R. Sharma", role: "Convenor", details: "Former national level setter with focus on team synergy." },
    coConvenor: { name: "Anjali Gupta", role: "Co-Convenor", details: "Specialist in defensive strategies and player stamina." },
    achievements: ["Zonal Runner-up 2024", "State Invitational Gold"],
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1592656094267-764a45159577" }],
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    icon: "🤼",
    image: "https://azimpremjiuniversity.edu.in/imager/photos/stories/economies-of-khel-temp-qiufsjneehqhivxjwtftzyjjlralejbnjuki/1470366/EOK_Kabaddi_WebsiteBanner_4b32b63c5c28c858e051e9d1a2a717a1.jpeg",
    description: "Experience the raw power and tactical depth of Kabaddi, a sport rooted in tradition and fueled by modern athleticism.",
    convenor: { name: "Mr. Vikram Singh", role: "Convenor", details: "Renowned coach with expertise in traditional raiding techniques." },
    coConvenor: { name: "Amit Kumar", role: "Co-Convenor", details: "Expert in defensive locks and team coordination." },
    achievements: ["All India Inter-University Bronze 2023", "State Pro-Kabaddi Trials Winners"],
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1612872089673-98782ee9f835" }],
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
      { type: "image", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018" },
      { type: "image", url: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa" },
    ],
    coachImage: "/images/coaches/football_coach.png",
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    image: "https://i.pinimg.com/1200x/90/0c/19/900c194308c7fa34f59d219ac9b9311b.jpg",
    description: "From baseline rallies to powerful serves, our tennis club offers world-class training and competitive opportunities.",
    convenor: { name: "Dr. A. Sen", role: "Convenor", details: "Passionate about biomechanics and stroke optimization." },
    coConvenor: { name: "David Miller", role: "Co-Convenor", details: "Former professional circuit player and mentor." },
    achievements: ["Inter-University Tennis Shield 2023", "Open Singles Champion (Zonal)"],
    gallery: [
      { type: "image", url: "https://images.unsplash.com/photo-1595435066373-cf6a9e6900f6" },
      { type: "image", url: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece" },
    ],
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
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1534158914592-062992fbe900" }],
  },
  {
    id: "carrom",
    name: "Carrom",
    icon: "♟️",
    image: "https://i.pinimg.com/736x/00/47/35/00473582cc85d8b5e4e89a2d2f732cf8.jpg",
    description: "A blend of strategy and touch, the Carrom club provides a platform for precision players to showcase their skills.",
    convenor: { name: "Mr. T. Mani", role: "Convenor", details: "National level carrom referee and veteran player." },
    coConvenor: { name: "Suresh G.", role: "Co-Convenor", details: "Expert in board strategy and tournament organization." },
    achievements: ["University Open Champions 2024", "State Board Masters Runner-up"],
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1611091565578-831518349257" }],
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
      { type: "image", url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793" },
      { type: "image", url: "https://images.unsplash.com/photo-1586165368502-1bad197a6461" },
    ],
  },
  {
    id: "athletics",
    name: "Athletics",
    icon: "🏃",
    image: "https://i.pinimg.com/736x/7a/87/92/7a87927184ce01235f2cfede8ee5af2f.jpg",
    description: "The foundation of all sports. Our athletics club trains students in track and field events with elite coaching.",
    convenor: { name: "Dr. L. Narayana", role: "Convenor", details: "Former Olympic qualifier coach with focus on biomechanics." },
    coConvenor: { name: "Priya Das", role: "Co-Convenor", details: "Specialist in middle-distance running and endurance." },
    achievements: ["All India Inter-University Track Gold 2024", "Best Athletics Team Award"],
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211" }],
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
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48" }],
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: "💪",
    image: "https://i.pinimg.com/1200x/87/0f/db/870fdbc24f282fd469df9096aa2c1417.jpg",
    description: "Promoting a culture of health and wellness through diverse fitness programs and community engagement.",
    convenor: { name: "Ms. Aarti Shah", role: "Convenor", details: "Renowned lifestyle coach and metabolic health expert." },
    coConvenor: { name: "Sameer J.", role: "Co-Convenor", details: "Specialist in functional training and HIIT." },
    achievements: ["Campus Wellness Leadership Award", "Fitness Challenge Winners 2023"],
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac00ad" }],
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
      { type: "image", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc" },
      { type: "image", url: "https://images.unsplash.com/photo-1504450758481-7338eba7524a" },
    ],
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
    gallery: [{ type: "image", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b" }],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ClubsGrid() {
  const [selectedClub, setSelectedClub] = useState(null);
  const { data: dbClubs } = useSWR("/api/clubs", fetcher);

  // Use dynamic data if available, otherwise fallback to static
  const clubsData = Array.isArray(dbClubs) && dbClubs.length > 0 ? dbClubs : clubs;

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {clubsData.map((club) => (
          <ClubCard key={club.id} club={club} onClick={() => setSelectedClub(club)} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedClub && <ClubModal club={selectedClub} onClose={() => setSelectedClub(null)} />}
      </AnimatePresence>
    </>
  );
}

function ClubCard({ club, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border group-hover:border-brand-srm/40 transition-all duration-300">
        <img
          src={club.image}
          alt={club.name}
          className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-brand-srm/60 group-hover:via-brand-srm/20 transition-all duration-500" />

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{club.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
              {club.name}
            </span>
          </div>
          <h3 className="text-2xl font-syne font-black text-white leading-tight group-hover:text-white/90 transition-colors">
            {club.name}
          </h3>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-srm/80 transition-colors">
            <span className="text-xl">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
