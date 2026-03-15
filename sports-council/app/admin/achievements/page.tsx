"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());
const CATEGORIES = ["TROPHY", "ACCOLADE", "RECORD"];

export default function AdminAchievements() {
    const { data: achievements, error } = useSWR('/api/achievements', fetcher);
    const [selected, setSelected] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        const isNew = !selected.id;
        const url = isNew ? '/api/admin/achievements' : `/api/admin/achievements/${selected.id}`;
        try {
            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selected, date: new Date(selected.date || Date.now()).toISOString() })
            });
            if (res.ok) { setMessage("✅ Saved!"); setSelected(null); mutate('/api/achievements'); }
            else setMessage("❌ Failed.");
        } catch { setMessage("❌ Network error."); }
        finally { setSaving(false); }
    };

    const catIcon = (cat: string) => cat === 'TROPHY' ? '🏆' : cat === 'ACCOLADE' ? '🥇' : '📃';

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-syne font-extrabold text-white">Achievements</h1>
                    <p className="text-white/40 font-outfit text-sm mt-1">Trophies, accolades and records</p>
                </div>
                <button onClick={() => setSelected({ title: '', sport: '', category: 'TROPHY', date: new Date().toISOString().split('T')[0] })}
                    className="px-6 py-3 bg-brand-srm text-white rounded-xl font-bold font-outfit text-sm hover:bg-brand-srm/80 transition-colors">
                    + Add Achievement
                </button>
            </div>

            {message && <div className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">{message}</div>}

            <div className="space-y-3">
                {achievements?.map((a: any) => (
                    <motion.div key={a.id} layout className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-3xl">{catIcon(a.category)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-syne font-bold text-white">{a.title}</div>
                            <div className="text-xs text-white/40 font-outfit">{a.sport} · {a.category} · {new Date(a.date).getFullYear()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected({ ...a, date: new Date(a.date).toISOString().split('T')[0] })} className="px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10">Edit</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/admin/achievements/${a.id}`, { method: 'DELETE' }); mutate('/api/achievements'); } }} className="px-4 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">Delete</button>
                        </div>
                    </motion.div>
                ))}
                {!achievements && !error && <div className="text-white/30 text-center py-12">Loading...</div>}
                {achievements?.length === 0 && <div className="text-white/30 text-center py-12 font-outfit">No achievements yet.</div>}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-4 shadow-2xl">
                            <h2 className="text-2xl font-syne font-bold text-white">{selected.id ? 'Edit Achievement' : 'Add Achievement'}</h2>
                            {[{ key: 'title', label: 'Title' }, { key: 'sport', label: 'Sport' }, { key: 'description', label: 'Description' }, { key: 'photoUrl', label: 'Photo URL' }].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">{f.label}</label>
                                    <input type="text" value={selected[f.key] || ''} onChange={e => setSelected({ ...selected, [f.key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Date</label>
                                    <input type="date" value={selected.date || ''} onChange={e => setSelected({ ...selected, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Category</label>
                                    <select value={selected.category || 'TROPHY'} onChange={e => setSelected({ ...selected, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none">
                                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 font-outfit font-bold text-sm">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-brand-srm text-white font-outfit font-bold text-sm hover:bg-brand-srm/80 disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
