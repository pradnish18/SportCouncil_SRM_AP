"use client";

import { motion } from "framer-motion";
import useSWR from 'swr';
// `clubs` is no longer imported from ClubsGrid, we fetch it dynamically

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Fallback image for clubs without bgImage to match ClubsGrid
const fallbackClubImage = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop";

const memberContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const memberCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Hierarchy() {
    const { data: membersObj } = useSWR('/api/council', fetcher);
    // Fetch clubs to render the bottom row of Hierarchy
    const { data: dbClubs } = useSWR('/api/clubs', fetcher);

    // Fallbacks if data isn't loaded or available
    const directors = membersObj?.DIRECTOR || [];
    const convenors = membersObj?.CONVENOR || [];
    const coaches = membersObj?.COACH || [];
    const studentBody = membersObj?.STUDENT_BODY || [];

    // Sport icon map for common club names
    const sportIconMap: Record<string, string> = {
        basketball: "🏀", cricket: "🏏", football: "⚽", badminton: "🏸",
        volleyball: "🏐", tennis: "🎾", "table tennis": "🏓", kabaddi: "🤼",
        carrom: "♟️", chess: "♟️", athletics: "🏃", gymnasium: "🏋️",
        fitness: "💪", yoga: "🧘", "yoga and meditation": "🧘",
    };

    // Map Prisma clubs to UI format
    const clubsArr = Array.isArray(dbClubs) ? dbClubs : [];
    const clubs = clubsArr.map((club: any) => {
        const nameLower = club.name.toLowerCase();
        // Capitalize name: e.g. "basketball" → "Basketball", "table-tennis" → "Table Tennis"
        const capitalizedName = club.name
            .split(/[-\s]+/)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        // Use sport icon map; logoUrl may be a full image URL so don't use it as an emoji
        const icon = sportIconMap[nameLower] || "🏆";
        return {
            id: club.id,
            name: capitalizedName,
            icon,
            image: club.bgImageUrl || fallbackClubImage,
            convenor: { name: club.convenorName || "TBD" },
            coConvenor: { name: club.coConvenorName || "TBD" },
        };
    });

    // Map to expected structure
    const directorateOfSports = directors.length > 0 ? [
        {
            title: "Directorate of Sports",
            members: directors
        }
    ] : [];

    const sportsCouncil = (convenors.length > 0 || studentBody.length > 0) ? [
        {
            tier: "Core Team",
            members: studentBody
        },
        {
            tier: "Convenors & Coaches",
            members: [...convenors, ...coaches]
        }
    ] : [];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-border bg-background transition-colors duration-500">
            <motion.div
                className="text-center mb-24"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase border rounded-xl border-brand-srm/20 bg-brand-srm/5 text-brand-srm">
                    Leadership
                </div>
                <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-foreground tracking-tight">Council Hierarchy</h2>
                <p className="mt-4 text-muted font-outfit max-w-xl mx-auto">The leadership steering SRM Sports towards competitive excellence and holistic development.</p>
            </motion.div>

            {/* Directorate of Sports */}
            {directorateOfSports.length > 0 && (
                <div className="space-y-24 mb-24">
                    {directorateOfSports.map((group) => (
                        <div key={group.title}>
                            <div className="flex items-center gap-6 mb-12">
                                <h3 className="text-sm font-syne font-black uppercase tracking-[0.3em] text-brand-srm">{group.title}</h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-srm/20 to-transparent"></div>
                            </div>

                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                                variants={memberContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                            >
                                {group.members.map((member: any) => (
                                    <MemberCard key={member.name} member={member} />
                                ))}
                            </motion.div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sports Council Divider */}
            {sportsCouncil.length > 0 && (
                <div className="mb-16 relative py-12">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-8 font-syne font-bold text-3xl text-foreground transition-colors duration-500">Sports Council</span>
                    </div>
                </div>
            )}

            {/* Sports Council - Core Team and Wings */}
            <div className="space-y-24">
                {sportsCouncil.map((group) => (
                    group.members.length > 0 && (
                        <div key={group.tier}>
                            <div className="flex items-center gap-6 mb-12">
                                <h3 className="text-sm font-syne font-black uppercase tracking-[0.3em] text-brand-srm">{group.tier}</h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-srm/20 to-transparent"></div>
                            </div>

                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                                variants={memberContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                            >
                                {group.members.map((member: any) => (
                                    <MemberCard key={member.name} member={member} />
                                ))}
                            </motion.div>
                        </div>
                    )
                ))}

                {/* Clubs Section */}
                <div>
                    <div className="flex items-center gap-6 mb-12">
                        <h3 className="text-sm font-syne font-black uppercase tracking-[0.3em] text-brand-srm">Clubs Coordination</h3>
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-srm/20 to-transparent"></div>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={memberContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        {clubs.map((club: any) => (
                            <motion.div
                                key={club.id}
                                variants={memberCardVariants}
                                className="space-y-6 p-8 theme-card rounded-3xl border border-border group hover:border-brand-srm/40 transition-all shadow-sm active:scale-95 cursor-default"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-srm/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {club.icon}
                                    </div>
                                    <h4 className="text-xl font-syne font-extrabold text-foreground">{club.name}</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mt-8">
                                    <div className="p-5 bg-foreground/[0.03] rounded-2xl border border-border">
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.1em] mb-1">Convenor</p>
                                        <p className="font-syne font-bold text-foreground">{club.convenor.name}</p>
                                    </div>
                                    <div className="p-5 bg-foreground/[0.03] rounded-2xl border border-border">
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.1em] mb-1">Co-Convenor</p>
                                        <p className="font-syne font-bold text-foreground">{club.coConvenor.name}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function MemberCard({ member }: { member: any }) {
    return (
        <motion.div
            variants={memberCardVariants}
            className="group"
        >
            <div className="relative aspect-square sm:aspect-[3/4] rounded-3xl overflow-hidden bg-foreground/5 mb-6 group-hover:shadow-2xl transition-all border border-border">
                <div className="absolute inset-0 bg-brand-srm/5 group-hover:bg-brand-srm/0 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl text-foreground">👤</span>
                </div>
            </div>
            <h4 className="text-lg sm:text-xl font-syne font-extrabold text-foreground group-hover:text-brand-srm transition-colors leading-tight mb-1">{member.name}</h4>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{member.title}</p>
        </motion.div>
    );
}
