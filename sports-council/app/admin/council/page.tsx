"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());
const TIERS = ["DIRECTOR", "CONVENOR", "COACH", "STUDENT_BODY"];

export default function AdminCouncil() {
    const { data: members, error } = useSWR('/api/council', fetcher);
    const membersList = members ? Object.values(members).flat() : null;
    const [selected, setSelected] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        const isNew = !selected.id;
        const url = isNew ? '/api/admin/council' : `/api/admin/council/${selected.id}`;
        try {
            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected)
            });
            if (res.ok) { setMessage("✅ Saved!"); setSelected(null); mutate('/api/council'); }
            else setMessage("❌ Failed.");
        } catch { setMessage("❌ Network error."); }
        finally { setSaving(false); }
    };

    const tierIcon = (tier: string) => ({ DIRECTOR: '⭐', CONVENOR: '🎯', COACH: '🏋️', STUDENT_BODY: '👤' }[tier] || '👤');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-syne font-extrabold text-white">Council Members</h1>
                    <p className="text-white/40 font-outfit text-sm mt-1">Manage the sports council hierarchy</p>
                </div>
                <button onClick={() => setSelected({ name: '', title: '', tier: 'STUDENT_BODY', order: 0 })}
                    className="px-6 py-3 bg-brand-srm text-white rounded-xl font-bold font-outfit text-sm hover:bg-brand-srm/80 transition-colors">
                    + Add Member
                </button>
            </div>

            {message && <div className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">{message}</div>}

            <div className="space-y-3">
                {membersList?.map((m: any) => (
                    <motion.div key={m.id} layout className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="text-2xl">{tierIcon(m.tier)}</div>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" /> : <span className="text-sm">👤</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-syne font-bold text-white">{m.name}</div>
                            <div className="text-xs text-white/40 font-outfit">{m.title} · {m.tier}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(m)} className="px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10">Edit</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/admin/council/${m.id}`, { method: 'DELETE' }); mutate('/api/council'); } }} className="px-4 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">Delete</button>
                        </div>
                    </motion.div>
                ))}
                {!membersList && !error && <div className="text-white/30 text-center py-12">Loading...</div>}
                {membersList?.length === 0 && <div className="text-white/30 text-center py-12 font-outfit">No council members yet.</div>}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-4 shadow-2xl">
                            <h2 className="text-2xl font-syne font-bold text-white">{selected.id ? 'Edit Member' : 'Add Member'}</h2>
                            {[{ key: 'name', label: 'Full Name' }, { key: 'title', label: 'Title / Role' }, { key: 'photoUrl', label: 'Photo URL' }].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">{f.label}</label>
                                    <input type="text" value={selected[f.key] || ''} onChange={e => setSelected({ ...selected, [f.key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Tier</label>
                                    <select value={selected.tier || 'STUDENT_BODY'} onChange={e => setSelected({ ...selected, tier: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none">
                                        {TIERS.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Display Order</label>
                                    <input type="number" value={selected.order || 0} onChange={e => setSelected({ ...selected, order: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
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
