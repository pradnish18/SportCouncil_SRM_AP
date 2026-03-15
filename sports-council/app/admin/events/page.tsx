"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const STAGES = ["PLANNED", "LIVE", "PAST"];

export default function AdminEvents() {
    const { data: events, error } = useSWR('/api/events', fetcher);
    const [selected, setSelected] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredEvents = filter === "All" ? events : events?.filter((e: any) => e.stage === filter);

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        setMessage("");
        const isNew = !selected.id;
        const url = isNew ? '/api/admin/events' : `/api/admin/events/${selected.id}`;
        const method = isNew ? 'POST' : 'PUT';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selected, date: new Date(selected.date || Date.now()).toISOString() })
            });
            if (res.ok) { setMessage("✅ Saved!"); setSelected(null); mutate('/api/events'); }
            else setMessage("❌ Failed to save.");
        } catch { setMessage("❌ Network error."); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
        mutate('/api/events');
    };

    const stageColor = (stage: string) => {
        if (stage === "LIVE") return "text-red-400 bg-red-500/10 border-red-500/20";
        if (stage === "PLANNED") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
        return "text-white/50 bg-white/5 border-white/10";
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-syne font-extrabold text-white">Events</h1>
                    <p className="text-white/40 font-outfit text-sm mt-1">Manage live, upcoming and past events</p>
                </div>
                <button onClick={() => setSelected({ title: '', sport: '', venue: '', stage: 'PLANNED', date: new Date().toISOString().split('T')[0] })}
                    className="px-6 py-3 bg-brand-srm text-white rounded-xl font-bold font-outfit text-sm hover:bg-brand-srm/80 transition-colors">
                    + Add Event
                </button>
            </div>

            {message && <div className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">{message}</div>}

            {/* Stage Filter */}
            <div className="flex gap-3">
                {["All", ...STAGES].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${filter === s ? 'bg-brand-srm text-white border-brand-srm' : 'text-white/40 border-white/10 hover:text-white'}`}>
                        {s}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredEvents?.map((event: any) => (
                    <motion.div key={event.id} layout className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wider ${stageColor(event.stage)}`}>{event.stage}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-syne font-bold text-white">{event.title}</div>
                            <div className="text-xs text-white/40 font-outfit">{event.sport} · {event.venue} · {new Date(event.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected({ ...event, date: new Date(event.date).toISOString().split('T')[0] })} className="px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(event.id)} className="px-4 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                        </div>
                    </motion.div>
                ))}
                {!events && !error && <div className="text-white/30 text-center py-12">Loading events...</div>}
                {filteredEvents?.length === 0 && <div className="text-white/30 text-center py-12 font-outfit">No events in this category.</div>}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
                        onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-4 shadow-2xl my-8">
                            <h2 className="text-2xl font-syne font-bold text-white">{selected.id ? 'Edit Event' : 'Add Event'}</h2>

                            {[
                                { key: 'title', label: 'Event Title' },
                                { key: 'sport', label: 'Sport' },
                                { key: 'venue', label: 'Venue' },
                                { key: 'category', label: 'Category (e.g. Inter-University)' },
                                { key: 'time', label: 'Time (e.g. 10:00 AM)' },
                                { key: 'description', label: 'Description' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">{f.label}</label>
                                    <input type="text" value={selected[f.key] || ''} onChange={e => setSelected({ ...selected, [f.key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors placeholder:text-white/20" />
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Date</label>
                                    <input type="date" value={selected.date || ''} onChange={e => setSelected({ ...selected, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Stage</label>
                                    <select value={selected.stage || 'PLANNED'} onChange={e => setSelected({ ...selected, stage: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors">
                                        {STAGES.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {selected.stage === 'LIVE' && (
                                <div className="space-y-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Live Score Data</p>
                                    {['team1', 'team2', 'score1', 'score2', 'liveUpdates'].map(f => (
                                        <div key={f}>
                                            <label className="block text-xs text-white/40 mb-1 capitalize">{f}</label>
                                            <input type="text" value={selected[f] || ''} onChange={e => setSelected({ ...selected, [f]: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-outfit outline-none focus:border-red-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selected.stage === 'PAST' && (
                                <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Results</p>
                                    {['winner1st', 'winner2nd', 'matchDetails'].map(f => (
                                        <div key={f}>
                                            <label className="block text-xs text-white/40 mb-1 capitalize">{f}</label>
                                            <input type="text" value={selected[f] || ''} onChange={e => setSelected({ ...selected, [f]: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white font-outfit font-bold text-sm transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-brand-srm text-white font-outfit font-bold text-sm hover:bg-brand-srm/80 disabled:opacity-50 transition-colors">
                                    {saving ? 'Saving...' : 'Save Event'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
