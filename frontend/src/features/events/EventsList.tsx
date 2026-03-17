"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SPORTS_ICONS: Record<string, string> = {
    Cricket: "🏏", Badminton: "🏸", Football: "⚽", Basketball: "🏀",
    Tennis: "🎾", "Table Tennis": "🏓", Volleyball: "🏐", Kabaddi: "🤼",
    Chess: "♟️", Carrom: "🎯", Athletics: "🏃", Gymnasium: "🏋️",
    Yoga: "🧘", Swimming: "🏊", Hockey: "🏑", Kho_Kho: "🏃"
};
const getSportIcon = (sport: string) => SPORTS_ICONS[sport] || "🏆";

const PAGE_SIZE = 6;

const staticEvents = [
    { id: "1", title: "Inter-Hostel Cricket League", sport: "Cricket", venue: "Hostel Ground", date: "2026-03-15", stage: "LIVE", category: "Hostel vs Hostel", team1: "Hostel 1", team2: "Hostel 4", score1: "145/6", score2: "Batting", liveUpdates: "Hostel 1 batting powerfully in 15th over" },
    { id: "2", title: "University Open Badminton", sport: "Badminton", venue: "Indoor Court 2", date: "2026-03-20", stage: "UPCOMING", time: "10:00 AM", category: "Inter-University", description: "Annual badminton championship open to all university students." },
    { id: "3", title: "Annual Athletic Meet", sport: "Athletics", venue: "Main Field", date: "2026-03-25", stage: "UPCOMING", time: "07:30 AM", category: "Intra-University", description: "Track and field events for all departments. Registration open for 100m, 200m, relay, high jump." },
    { id: "4", title: "South Zone Football Cup", sport: "Football", venue: "Main Ground", date: "2026-04-05", stage: "UPCOMING", time: "04:00 PM", category: "Inter-University", description: "SRM AP hosts the South Zone Inter-University Football Cup. Support our team!" },
    { id: "5", title: "T20 Championship Finals", sport: "Cricket", venue: "Main Field", date: "2026-02-25", stage: "PAST", winner1st: "SRM Blue", winner2nd: "Vellore United", matchDetails: "SRM won by 40 runs in a thrilling final. Rahul scored a notable 85." },
    { id: "6", title: "Intra-School Chess Cup", sport: "Chess", venue: "Admin Hall", date: "2026-02-18", stage: "PAST", winner1st: "Rahul S.", winner2nd: "Priya V.", matchDetails: "Exhilarating endgame by Rahul clinched the title in 48 moves." },
    { id: "7", title: "Kabaddi Zonal Meet", sport: "Kabaddi", venue: "Sports Complex", date: "2026-01-30", stage: "PAST", winner1st: "SRM Raiders", winner2nd: "VITU Panthers", matchDetails: "SRM Raiders dominated the final with strong raiding performance." },
];

export default function EventsList() {
    const [filter, setFilter] = useState<"LIVE" | "UPCOMING" | "PAST">("UPCOMING");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSport, setSelectedSport] = useState("All");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const { data: dynamicEvents } = useSWR('/api/events', fetcher);

    const formattedEvents = useMemo(() => {
        const raw = Array.isArray(dynamicEvents) && dynamicEvents.length > 0 ? dynamicEvents : staticEvents;
        return raw.map((e: any) => {
            const dateObj = new Date(e.date);
            return {
                ...e,
                dateObj,
                dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                stage: e.stage === 'PLANNED' ? 'UPCOMING' : e.stage,
                teams: e.team1 && e.team2 ? `${e.team1} vs ${e.team2}` : null,
                scores: e.score1 && e.score2 ? `${e.score1}  ·  ${e.score2}` : e.liveUpdates || null,
            };
        });
    }, [dynamicEvents]);

    const uniqueSports = useMemo(() => (
        ["All", ...Array.from(new Set(formattedEvents.map((e: any) => e.sport as string)))]
    ), [formattedEvents]);

    const liveEvents = useMemo(() => formattedEvents.filter((e: any) => e.stage === 'LIVE'), [formattedEvents]);

    const filtered = useMemo(() => {
        return formattedEvents
            .filter((e: any) => {
                if (e.stage !== filter) return false;
                if (selectedSport !== "All" && e.sport !== selectedSport) return false;
                const q = searchQuery.toLowerCase();
                return e.title.toLowerCase().includes(q) || e.sport.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
            })
            .sort((a: any, b: any) => {
                const diff = a.dateObj - b.dateObj;
                return sortOrder === 'asc' ? diff : -diff;
            });
    }, [formattedEvents, filter, selectedSport, searchQuery, sortOrder]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (f: "LIVE" | "UPCOMING" | "PAST") => {
        setFilter(f);
        setPage(1);
    };

    return (
        <div className="space-y-12">
            {/* ————— LIVE BANNER ————— */}
            {liveEvents.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 font-syne font-extrabold uppercase tracking-widest text-sm">
                            Live Right Now
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {liveEvents.map((event: any) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 p-8"
                            >
                                {/* Animated red glow at top */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />
                                <div className="absolute top-4 right-4">
                                    <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        LIVE
                                    </span>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">{event.sport} · {event.category}</div>
                                <h3 className="text-2xl font-syne font-extrabold text-white mb-1">{event.title}</h3>
                                <div className="text-white/50 text-sm font-outfit mb-6">📍 {event.venue}</div>

                                {event.teams && (
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">Scoreboard</div>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 text-center">
                                                <div className="text-lg font-syne font-bold text-white">{event.team1 || event.teams?.split(' vs ')[0]}</div>
                                                <div className="text-3xl font-syne font-extrabold text-red-400 mt-1">{event.score1 || '—'}</div>
                                            </div>
                                            <div className="text-white/30 font-bold text-xl font-syne">VS</div>
                                            <div className="flex-1 text-center">
                                                <div className="text-lg font-syne font-bold text-white">{event.team2 || event.teams?.split(' vs ')[1]}</div>
                                                <div className="text-3xl font-syne font-extrabold text-white/70 mt-1">{event.score2 || '—'}</div>
                                            </div>
                                        </div>
                                        {event.liveUpdates && (
                                            <div className="mt-4 text-xs text-red-300 font-outfit bg-red-500/10 rounded-xl px-4 py-2 border border-red-500/20">
                                                🔴 {event.liveUpdates}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ————— CONTROLS ————— */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-card border border-border p-6 rounded-[2.5rem] shadow-sm">
                {/* Stage tabs */}
                <div className="flex gap-2 p-1.5 bg-background border border-border rounded-2xl w-full lg:w-fit">
                    {(["LIVE", "UPCOMING", "PAST"] as const).map((stage) => (
                        <button
                            key={stage}
                            onClick={() => handleFilterChange(stage)}
                            className={`relative flex-1 lg:flex-none px-8 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${filter === stage ? "bg-brand-srm text-white shadow-xl shadow-brand-srm/20" : "text-muted hover:text-foreground"}`}
                        >
                            {stage}
                            {stage === "LIVE" && liveEvents.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-background" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Right-side controls */}
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="bg-background border border-border text-foreground rounded-xl px-5 py-3 text-sm w-full lg:w-64 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all placeholder:text-muted"
                        />
                    </div>
                    <select
                        value={selectedSport}
                        onChange={(e) => { setSelectedSport(e.target.value); setPage(1); }}
                        className="bg-background border border-border text-foreground rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all cursor-pointer font-bold"
                    >
                        {uniqueSports.map((s) => (
                            <option key={s as string} value={s as string}>{s as string}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center gap-2 bg-background border border-border text-muted font-bold rounded-xl px-5 py-3 text-sm hover:text-foreground hover:border-brand-srm transition-all"
                        title="Toggle sort order"
                    >
                        {sortOrder === 'asc' ? 'Soonest First' : 'Latest First'}
                    </button>
                </div>
            </div>

            {/* ————— EVENT CARDS ————— */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${filter}-${page}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`grid gap-8 ${filter === 'PAST' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
                >
                    {paginated.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                    ))}

                    {paginated.length === 0 && (
                        <div className="col-span-full py-32 text-center text-muted font-outfit border-2 border-dashed border-border rounded-[3rem] bg-card/30">
                            <div className="text-6xl mb-6 grayscale opacity-50">🔍</div>
                            <h3 className="text-xl font-syne font-bold text-foreground mb-2">No Matching Events</h3>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ————— PAGINATION ————— */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-12">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:border-brand-srm disabled:opacity-20 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-14 h-14 rounded-2xl text-sm font-black transition-all border ${page === p ? 'bg-brand-srm border-brand-srm text-white shadow-lg' : 'bg-card border-border text-muted hover:border-brand-srm hover:text-foreground'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:border-brand-srm disabled:opacity-20 transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

// ——— Individual Event Card ———
function EventCard({ event }: { event: any }) {
    const isUpcoming = event.stage === 'UPCOMING';
    const isPast = event.stage === 'PAST';
    const isLive = event.stage === 'LIVE';

    return (
        <motion.article
            layout
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col rounded-[2.5rem] overflow-hidden theme-card border group transition-all duration-300 ${isLive ? 'border-red-500/30 shadow-red-500/5' : 'border-border hover:border-brand-srm/40 shadow-xl shadow-foreground/5'}`}
        >
            {/* Past event: photo strip at top */}
            {isPast && event.photoUrl && (
                <div className="relative h-48 w-full overflow-hidden">
                    <Image src={event.photoUrl} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                </div>
            )}

            <div className="p-8 flex flex-col flex-1">
                {/* Sport + Stage badge */}
                <div className="flex items-center justify-between mb-6">
                    <span className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-srm bg-brand-srm/5 px-3 py-1.5 rounded-lg border border-brand-srm/10">
                        <span>{getSportIcon(event.sport)}</span>
                        {event.sport}
                    </span>
                    {event.category && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted px-2 py-1">{event.category}</span>
                    )}
                </div>

                <h3 className="text-2xl font-syne font-black text-foreground mb-6 leading-tight group-hover:text-brand-srm transition-colors">{event.title}</h3>

                {/* Meta info */}
                <div className="space-y-3.5 mb-8">
                    <div className="flex items-center gap-3 text-sm font-outfit text-muted group-hover:text-foreground transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-foreground/[0.03] flex items-center justify-center text-lg">📍</div>
                        <span className="font-medium">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-outfit text-muted group-hover:text-foreground transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-foreground/[0.03] flex items-center justify-center text-lg">📅</div>
                        <span className="font-medium">{event.dateStr}</span>
                    </div>
                    {event.time && (
                        <div className="flex items-center gap-3 text-sm font-outfit text-muted group-hover:text-foreground transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-foreground/[0.03] flex items-center justify-center text-lg">⏰</div>
                            <span className="font-medium">{event.time}</span>
                        </div>
                    )}
                </div>

                {/* Upcoming: description + registration link */}
                {isUpcoming && event.description && (
                    <p className="text-sm text-muted font-outfit leading-relaxed mb-8 line-clamp-3">{event.description}</p>
                )}
                {isUpcoming && (
                    <div className="mt-auto pt-6 border-t border-border">
                        <button className="w-full py-4 rounded-2xl bg-brand-srm text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-srm/30 hover:shadow-brand-srm/50 hover:bg-brand-srm/90 active:scale-95 transition-all">
                            Register Now →
                        </button>
                    </div>
                )}

                {/* Past: Result block */}
                {isPast && event.winner1st && (
                    <div className="mt-auto pt-6 border-t border-border">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-4">Official Results</div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 bg-brand-srm/10 border border-brand-srm/20 rounded-2xl px-5 py-3 shadow-inner">
                                <span className="text-2xl">🥇</span>
                                <div>
                                    <div className="text-[9px] text-brand-srm font-black uppercase tracking-tight mb-0.5">Champions</div>
                                    <div className="text-sm font-syne font-black text-foreground">{event.winner1st}</div>
                                </div>
                            </div>
                            {event.winner2nd && (
                                <div className="flex items-center gap-4 bg-foreground/[0.02] border border-border rounded-2xl px-5 py-3">
                                    <span className="text-2xl">🥈</span>
                                    <div>
                                        <div className="text-[9px] text-muted font-black uppercase tracking-tight mb-0.5">Runner-up</div>
                                        <div className="text-sm font-syne font-black text-muted">{event.winner2nd}</div>
                                    </div>
                                </div>
                            )}
                            {event.matchDetails && (
                                <p className="text-[11px] text-muted font-outfit pt-2 italic opacity-80 leading-relaxed text-center">"{event.matchDetails}"</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.article>
    );
}

