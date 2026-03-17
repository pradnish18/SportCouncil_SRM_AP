"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminNews() {
    const { data: newsList, error } = useSWR('/api/news', fetcher);
    const [selected, setSelected] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        const isNew = !selected.id;
        const url = isNew ? '/api/admin/news' : `/api/admin/news/${selected.id}`;
        try {
            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected)
            });
            if (res.ok) { setMessage("✅ Saved!"); setSelected(null); mutate('/api/news'); }
            else setMessage("❌ Failed.");
        } catch { setMessage("❌ Network error."); }
        finally { setSaving(false); }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-syne font-extrabold text-white">News</h1>
                    <p className="text-white/40 font-outfit text-sm mt-1">Manage the homepage news carousel</p>
                </div>
                <button onClick={() => setSelected({ headline: '', imageUrl: '', order: 0 })}
                    className="px-6 py-3 bg-brand-srm text-white rounded-xl font-bold font-outfit text-sm hover:bg-brand-srm/80 transition-colors">
                    + Add News Item
                </button>
            </div>

            {message && <div className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">{message}</div>}

            <div className="space-y-3">
                {newsList?.map((item: any) => (
                    <motion.div key={item.id} layout className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.headline} className="w-16 h-12 rounded-xl object-cover" />}
                        {!item.imageUrl && <div className="w-16 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl">📰</div>}
                        <div className="flex-1 min-w-0">
                            <div className="font-syne font-bold text-white line-clamp-1">{item.headline}</div>
                            <div className="text-xs text-white/40 font-outfit">Order: {item.order}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(item)} className="px-4 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10">Edit</button>
                            <button onClick={async () => { if (confirm("Delete?")) { await fetch(`/api/admin/news/${item.id}`, { method: 'DELETE' }); mutate('/api/news'); } }} className="px-4 py-2 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">Delete</button>
                        </div>
                    </motion.div>
                ))}
                {!newsList && !error && <div className="text-white/30 text-center py-12">Loading news...</div>}
                {newsList?.length === 0 && <div className="text-white/30 text-center py-12 font-outfit">No news items yet.</div>}
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-4 shadow-2xl">
                            <h2 className="text-2xl font-syne font-bold text-white">{selected.id ? 'Edit News' : 'Add News'}</h2>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Headline</label>
                                <input type="text" value={selected.headline || ''} onChange={e => setSelected({ ...selected, headline: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Image URL</label>
                                <input type="text" value={selected.imageUrl || ''} onChange={e => setSelected({ ...selected, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors placeholder:text-white/20" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1.5 font-bold">Display Order</label>
                                <input type="number" value={selected.order || 0} onChange={e => setSelected({ ...selected, order: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-outfit outline-none focus:border-brand-srm transition-colors" />
                            </div>
                            {selected.imageUrl && (
                                <img src={selected.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-white/10" />
                            )}
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
