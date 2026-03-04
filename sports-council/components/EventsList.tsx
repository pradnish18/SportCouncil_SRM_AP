"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
    { id: 1, title: "Inter-Hostel League", sport: "Cricket", venue: "Hostel Ground", date: "Present", stage: "LIVE", teams: "Hostel 1 vs Hostel 4", scores: "15/0 (2.1 ov)" },
    { id: 2, title: "University Open", sport: "Badminton", venue: "Indoor Court 2", date: "March 15, 2026", stage: "UPCOMING", time: "10:00 AM" },
    { id: 3, title: "Annual Athletic Meet", sport: "Athletics", venue: "Main Field", date: "March 20, 2026", stage: "UPCOMING", time: "07:30 AM" },
    { id: 4, title: "T20 Championship Finals", sport: "Cricket", venue: "Main Field", date: "Feb 25, 2026", stage: "PAST", winner: "SRM Blue", runnerUp: "Vellore United", matchDetails: "SRM won by 40 runs" },
    { id: 5, title: "Intra-School Chess Cup", sport: "Chess", venue: "Admin Hall", date: "Feb 18, 2026", stage: "PAST", winner: "Rahul S.", runnerUp: "Priya V.", matchDetails: "Exhilarating endgame by Rahul" },
];

export default function EventsList() {
    const [filter, setFilter] = useState<"LIVE" | "UPCOMING" | "PAST">("UPCOMING");

    const filteredEvents = events.filter(e => e.stage === filter);

    return (
        <div className="space-y-12">
            {/* Tabs */}
            <div className="flex justify-center sm:justify-start gap-4 p-1 glass rounded-2xl w-fit">
                {["LIVE", "UPCOMING", "PAST"].map((stage) => (
                    <button
                        key={stage}
                        onClick={() => setFilter(stage as any)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${filter === stage ? "bg-brand-blue text-white shadow-lg" : "text-muted hover:text-white"
                            }`}
                    >
                        {stage}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredEvents.map((event) => (
                            <motion.div
                                key={event.id}
                                layout
                                className={`relative p-8 rounded-3xl glass border-l-4 ${event.stage === 'LIVE' ? 'border-red-500 bg-red-500/5' :
                                        event.stage === 'UPCOMING' ? 'border-brand-blue' : 'border-muted'
                                    }`}
                            >
                                {event.stage === 'LIVE' && (
                                    <div className="absolute top-6 right-6 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-red-500 uppercase">Live Now</span>
                                    </div>
                                )}

                                <div className="text-sm font-syne font-bold uppercase tracking-widest text-brand-indigo mb-2">
                                    {event.sport}
                                </div>
                                <h3 className="text-2xl font-syne font-bold mb-4">{event.title}</h3>

                                <div className="space-y-3 text-sm font-outfit text-muted">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-50">📍</span> {event.venue}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-50">📅</span> {event.date}
                                    </div>
                                    {event.time && (
                                        <div className="flex items-center gap-3">
                                            <span className="opacity-50">⏰</span> {event.time}
                                        </div>
                                    )}
                                </div>

                                {event.stage === 'LIVE' && event.teams && (
                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className="text-xs uppercase tracking-widest text-muted mb-2">Current Score</div>
                                        <div className="text-xl font-syne font-bold text-white mb-1">{event.teams}</div>
                                        <div className="text-lg font-outfit text-edit">{event.scores}</div>
                                    </div>
                                )}

                                {event.stage === 'PAST' && event.winner && (
                                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-edit">🥇</span>
                                            <div>
                                                <div className="text-[10px] uppercase text-muted">Winner</div>
                                                <div className="text-sm font-bold">{event.winner}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-subtle opacity-50">🥈</span>
                                            <div>
                                                <div className="text-[10px] uppercase text-muted">Runner-up</div>
                                                <div className="text-sm font-bold">{event.runnerUp}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {filteredEvents.length === 0 && (
                            <div className="col-span-full py-20 text-center text-muted font-outfit border-2 border-dashed border-white/5 rounded-3xl">
                                No events found in this category.
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
