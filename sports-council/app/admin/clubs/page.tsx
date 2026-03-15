"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Club {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    bgImageUrl?: string;
    order: number;
    convenor?: { name: string; role: string; details: string };
    coConvenor?: { name: string; role: string; details: string };
    achievements?: string[];
    gallery?: { url: string }[];
}

export default function AdminClubs() {
    const { data: clubs, error } = useSWR<Club[]>('/api/clubs', fetcher);
    const [selected, setSelected] = useState<Partial<Club> | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        setMessage("");

        const isNew = !selected.id;
        const url = isNew ? '/api/admin/clubs' : `/api/admin/clubs/${selected.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected)
            });
            if (res.ok) {
                setMessage("✅ Saved successfully!");
                setSelected(null);
                mutate('/api/clubs');
            } else {
                setMessage("❌ Failed to save.");
            }
        } catch {
            setMessage("❌ Network error.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this club?")) return;
        await fetch(`/api/admin/clubs/${id}`, { method: 'DELETE' });
        mutate('/api/clubs');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-syne font-extrabold text-white">Clubs</h1>
                    <p className="text-white/40 font-outfit text-sm mt-1">Manage all sports clubs</p>
                </div>
                <button
                    onClick={() => setSelected({
                        name: '', description: '', order: 0,
                        convenor: { name: '', role: 'Convenor', details: '' },
                        coConvenor: { name: '', role: 'Co-Convenor', details: '' },
                        achievements: [''],
                        gallery: []
                    })}
                    className="px-6 py-3 bg-brand-srm text-white rounded-xl font-bold font-outfit text-sm hover:bg-brand-srm/80 transition-colors"
                >
                    + Add Club
                </button>
            </div>

            {message && <div className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">{message}</div>}

            {/* Clubs Table */}
            <div className="space-y-3">
                {clubs?.map((club) => (
                    <motion.div key={club.id} layout className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        {club.logoUrl && (
                            <img src={club.logoUrl} alt={club.name} className="w-12 h-12 rounded-xl object-cover" />
                        )}
                        {!club.logoUrl && (
                            <div className="w-12 h-12 rounded-xl bg-brand-srm/20 flex items-center justify-center text-xl">🏆</div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-syne font-bold text-white">{club.name}</div>
                            <div className="text-xs text-white/40 font-outfit truncate">{club.description || 'No description'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(club)} className="px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(club.id)} className="px-4 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                        </div>
                    </motion.div>
                ))}
                {!clubs && !error && <div className="text-white/30 text-center py-12">Loading clubs...</div>}
                {clubs?.length === 0 && <div className="text-white/30 text-center py-12 font-outfit">No clubs yet. Add one!</div>}
            </div>

            {/* Edit / Add Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
                        >
                            <h2 className="text-2xl font-syne font-bold text-white">{selected.id ? 'Edit Club' : 'Add New Club'}</h2>

                            {[
                                { key: 'name', label: 'Club Name', placeholder: 'e.g. Cricket' },
                                { key: 'description', label: 'Description', placeholder: 'Short club description...' },
                                { key: 'logoUrl', label: 'Logo URL', placeholder: 'https://...' },
                                { key: 'bgImageUrl', label: 'Background Image URL', placeholder: 'https://...' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">{field.label}</label>
                                    <input
                                        type="text"
                                        value={(selected as any)[field.key] || ''}
                                        onChange={(e) => setSelected({ ...selected, [field.key]: e.target.value })}
                                        placeholder={field.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors placeholder:text-white/20"
                                    />
                                </div>
                            ))}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                <h3 className="md:col-span-2 text-sm uppercase tracking-widest text-brand-srm font-bold">Leadership</h3>
                                {['convenor', 'coConvenor'].map((key) => {
                                    const roleObj = (selected as any)[key] || { name: '', role: key === 'convenor' ? 'Convenor' : 'Co-Convenor', details: '' };
                                    return (
                                        <div key={key} className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{key === 'convenor' ? 'Convenor' : 'Co-Convenor'}</div>
                                            <input type="text" placeholder="Name" value={roleObj.name} onChange={e => setSelected({ ...selected, [key]: { ...roleObj, name: e.target.value } })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-srm" />
                                            <input type="text" placeholder="Title/Role" value={roleObj.role} onChange={e => setSelected({ ...selected, [key]: { ...roleObj, role: e.target.value } })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-srm" />
                                            <input type="text" placeholder="Short Bio/Details" value={roleObj.details} onChange={e => setSelected({ ...selected, [key]: { ...roleObj, details: e.target.value } })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-srm" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm uppercase tracking-widest text-brand-srm font-bold">Key Achievements</h3>
                                    <button onClick={() => setSelected({ ...selected, achievements: [...(selected.achievements || []), ''] })} className="text-xs text-brand-srm hover:text-white transition-colors">+ Add Line</button>
                                </div>
                                {(selected.achievements || ['']).map((ach, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input type="text" value={ach} onChange={(e) => {
                                            const newAch = [...(selected.achievements || [])];
                                            newAch[idx] = e.target.value;
                                            setSelected({ ...selected, achievements: newAch });
                                        }} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-brand-srm" placeholder="E.g. Zonal Champions 2024" />
                                        <button onClick={() => setSelected({ ...selected, achievements: selected.achievements?.filter((_, i) => i !== idx) })} className="px-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">✕</button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm uppercase tracking-widest text-brand-srm font-bold">Gallery Images</h3>
                                    <button onClick={() => setSelected({ ...selected, gallery: [...(selected.gallery || []), { url: '' }] })} className="text-xs text-brand-srm hover:text-white transition-colors">+ Add Image</button>
                                </div>
                                {(selected.gallery || []).map((img, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input type="text" value={img.url} onChange={(e) => {
                                            const newGal = [...(selected.gallery || [])];
                                            newGal[idx].url = e.target.value;
                                            setSelected({ ...selected, gallery: newGal });
                                        }} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-brand-srm" placeholder="Image URL (https://...)" />
                                        <button onClick={() => setSelected({ ...selected, gallery: selected.gallery?.filter((_, i) => i !== idx) })} className="px-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">✕</button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Display Order</label>
                                <input
                                    type="number"
                                    value={selected.order || 0}
                                    onChange={(e) => setSelected({ ...selected, order: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white font-outfit font-bold text-sm transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-brand-srm text-white font-outfit font-bold text-sm hover:bg-brand-srm/80 disabled:opacity-50 transition-colors">
                                    {saving ? 'Saving...' : 'Save Club'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
