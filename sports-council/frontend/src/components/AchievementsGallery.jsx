"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "../lib/api";

const staticAchievements = [
  {
    id: "1",
    title: "South Zone Cricket Gold",
    description: "SRM AP claimed Gold at the South Zone Inter-University Cricket Championship.",
    sport: "Cricket",
    date: "2025-03-14",
    category: "TROPHY",
    photoUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "State Football Runners-up",
    description: "Our football team reached the state finals in an outstanding campaign.",
    sport: "Football",
    date: "2024-11-20",
    category: "TROPHY",
    photoUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Kabaddi Intra-Hostel Trophy",
    description: "Dominant performance throughout the hostel league season.",
    sport: "Kabaddi",
    date: "2025-01-15",
    category: "TROPHY",
    photoUrl: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240229050313.jpg",
  },
  {
    id: "4",
    title: "Zonal Chess Championship",
    description: "Claimed all top positions at the Zonal Chess Championship.",
    sport: "Chess",
    date: "2023-08-05",
    category: "TROPHY",
    photoUrl: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2072&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Alex James — 100m Sprint Record",
    description: "Alex set a new university record of 10.4 seconds in the 100m Sprint.",
    sport: "Athletics",
    date: "2024-03-10",
    category: "RECORD",
    photoUrl: "https://assets.thehansindia.com/h-upload/2024/05/07/1444417-athlets.webp",
  },
  {
    id: "6",
    title: "Sarah Khan — Highest Run Scorer",
    description: "Sarah scored the most runs across the entire EVC cricket tournament.",
    sport: "Cricket",
    date: "2025-02-08",
    category: "ACCOLADE",
    photoUrl: "",
  },
  {
    id: "7",
    title: "Badminton Women's Gold",
    description: "Women's doubles team won Gold at the inter-collegiate tournament.",
    sport: "Badminton",
    date: "2025-02-25",
    category: "TROPHY",
    photoUrl: "https://i1.wp.com/badmintonbites.com/wp-content/uploads/2020/05/image_10_1280x.jpg?fit=1000%2C653&ssl=1",
  },
  {
    id: "8",
    title: "Table Tennis South Zone",
    description: "SRM AP swept Gold and Silver at the South Zone table tennis.",
    sport: "Table Tennis",
    date: "2024-09-12",
    category: "TROPHY",
    photoUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2070&auto=format&fit=crop",
  },
];

const CATEGORY_ICONS = { TROPHY: "🏆", ACCOLADE: "🥇", RECORD: "📋" };
const CATEGORY_COLORS = {
  TROPHY: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
  ACCOLADE: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
  RECORD: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20",
};

export default function AchievementsGallery() {
  const { data: apiData } = useSWR("/api/achievements", fetcher);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allAchievements = useMemo(() => {
    const raw = Array.isArray(apiData) && apiData.length > 0 ? apiData : staticAchievements;
    return raw
      .map((a) => ({
        ...a,
        year: new Date(a.date).getFullYear().toString(),
        dateObj: new Date(a.date),
      }))
      .sort((a, b) => b.dateObj - a.dateObj);
  }, [apiData]);

  const uniqueSports = useMemo(() => ["All", ...Array.from(new Set(allAchievements.map((a) => a.sport)))], [allAchievements]);
  const uniqueYears = useMemo(
    () => ["All", ...Array.from(new Set(allAchievements.map((a) => a.year))).sort((a, b) => Number(b) - Number(a))],
    [allAchievements]
  );

  const filtered = useMemo(
    () =>
      allAchievements.filter((a) => {
        if (selectedSport !== "All" && a.sport !== selectedSport) return false;
        if (selectedYear !== "All" && a.year !== selectedYear) return false;
        if (selectedCategory !== "All" && a.category !== selectedCategory) return false;
        return true;
      }),
    [allAchievements, selectedSport, selectedYear, selectedCategory]
  );

  const trophies = filtered.filter((a) => a.category === "TROPHY");
  const accolades = filtered.filter((a) => a.category === "ACCOLADE");
  const records = filtered.filter((a) => a.category === "RECORD");

  return (
    <div className="space-y-32">
      {/* ——— Filters ——— */}
      <div className="flex flex-wrap gap-4 items-center p-8 rounded-[2.5rem] bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted mr-4">
          <span className="text-lg">⚡</span> Filter By
        </div>
        {/* Sport filter */}
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="bg-background border border-border text-foreground text-sm font-bold rounded-xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all cursor-pointer"
        >
          {uniqueSports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {/* Year filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-background border border-border text-foreground text-sm font-bold rounded-xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-srm/20 focus:border-brand-srm transition-all cursor-pointer"
        >
          {uniqueYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 ml-2">
          {["All", "TROPHY", "ACCOLADE", "RECORD"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === c
                  ? "bg-brand-srm text-white border-brand-srm shadow-lg shadow-brand-srm/30"
                  : "border-border text-muted hover:text-foreground hover:border-brand-srm"
              }`}
            >
              {c === "All" ? "All" : `${CATEGORY_ICONS[c]} ${c}`}
            </button>
          ))}
        </div>
        {(selectedSport !== "All" || selectedYear !== "All" || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setSelectedSport("All");
              setSelectedYear("All");
              setSelectedCategory("All");
            }}
            className="ml-auto text-[10px] font-black uppercase tracking-[0.1em] text-brand-srm hover:opacity-80 transition-all underline underline-offset-4 decoration-2"
          >
            Reset All
          </button>
        )}
      </div>

      {/* ——— Trophy Cabinet (Masonry) ——— */}
      {trophies.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-brand-srm" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-srm">Championships</span>
              </div>
              <h2 className="text-5xl font-syne font-black text-foreground">Trophy Cabinet</h2>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-muted font-outfit text-sm">
              <span className="font-bold text-foreground">{trophies.length}</span> Masterpieces found
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {trophies.map((trophy, idx) => (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative break-inside-avoid rounded-[2.5rem] overflow-hidden group cursor-pointer theme-card border border-border shadow-xl hover:shadow-brand-srm/10 transition-all duration-500"
                style={{ minHeight: idx % 3 === 1 ? "420px" : "340px" }}
              >
                {trophy.photoUrl ? (
                  <img
                    src={trophy.photoUrl}
                    alt={trophy.title}
                    className="absolute inset-0 object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-srm/5 flex items-center justify-center text-7xl opacity-40">
                    🏆
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border w-fit mb-4 transition-all group-hover:scale-105 ${CATEGORY_COLORS["TROPHY"]}`}>
                    {CATEGORY_ICONS["TROPHY"]} {trophy.sport}
                  </div>
                  <h3 className="text-2xl font-syne font-black text-foreground leading-tight group-hover:text-brand-srm transition-colors mb-3">
                    {trophy.title}
                  </h3>
                  <div className="text-sm text-brand-srm/80 font-black mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-srm" />
                    {trophy.year}
                  </div>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-700">
                    {trophy.description && (
                      <p className="text-sm text-muted font-outfit leading-relaxed">{trophy.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ——— Accolades & Inter-University ——— */}
      {accolades.length > 0 && (
        <section className="pt-32 border-t border-border">
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-brand-srm" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-srm">Recognition</span>
              </div>
              <h2 className="text-5xl font-syne font-black text-foreground">Accolades</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {accolades.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col rounded-[2.5rem] overflow-hidden theme-card border border-border group hover:border-brand-srm/30 transition-all duration-300 shadow-xl shadow-foreground/5"
              >
                {a.photoUrl && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={a.photoUrl}
                      alt={a.title}
                      className="absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  </div>
                )}
                <div className="p-10 flex flex-col flex-1">
                  <div className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border w-fit mb-6 ${CATEGORY_COLORS["ACCOLADE"]}`}>
                    {CATEGORY_ICONS["ACCOLADE"]} {a.sport}
                  </div>
                  <h4 className="text-2xl font-syne font-black text-foreground mb-4 leading-tight group-hover:text-brand-srm transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-sm text-muted font-outfit leading-relaxed flex-1">{a.description}</p>
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <span>📅</span> {new Date(a.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-srm/20 shadow-[0_0_10px_rgba(var(--brand-srm),0.2)]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ——— Individual Records ——— */}
      {records.length > 0 && (
        <section className="pt-32 border-t border-border">
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-brand-srm" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-srm">Milestones</span>
              </div>
              <h2 className="text-5xl font-syne font-black text-foreground">Athlete Records</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {records.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-10 p-10 bg-card/60 backdrop-blur-xl rounded-[3rem] border-l-8 border-l-brand-srm border border-border group hover:shadow-2xl hover:shadow-brand-srm/5 transition-all"
              >
                <div className="flex-shrink-0 relative">
                  <div className="absolute -inset-2 bg-brand-srm/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                  {r.photoUrl ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-srm/30 shadow-2xl">
                      <img src={r.photoUrl} alt={r.title} className="absolute inset-0 object-cover" />
                    </div>
                  ) : (
                    <div className="relative w-24 h-24 rounded-2xl bg-background border-2 border-brand-srm/20 flex items-center justify-center text-5xl shadow-2xl">
                      {CATEGORY_ICONS["RECORD"]}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-srm rounded-full flex items-center justify-center text-white border-4 border-background shadow-xl">
                    <span className="text-lg">🎖️</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="text-2xl font-syne font-black text-foreground mb-3 leading-tight group-hover:text-brand-srm transition-colors">
                    {r.title}
                  </h4>
                  <p className="text-sm text-muted font-outfit mb-6 leading-relaxed">{r.description}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-brand-srm bg-brand-srm/5 px-3 py-1.5 rounded-lg border border-brand-srm/10">
                      {r.sport}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted bg-foreground/[0.03] px-3 py-1.5 rounded-lg border border-border">
                      {r.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-40 text-center text-muted font-outfit border-2 border-dashed border-border rounded-[3rem] bg-card/30">
          <div className="text-7xl mb-8 grayscale opacity-40">🏆</div>
          <h3 className="text-2xl font-syne font-black text-foreground mb-2">No Records Found</h3>
          <p className="mb-10 opacity-70">We couldn't find any achievements matching your current filters.</p>
          <button
            onClick={() => {
              setSelectedSport("All");
              setSelectedYear("All");
              setSelectedCategory("All");
            }}
            className="px-10 py-4 bg-brand-srm text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-brand-srm/20 hover:scale-105 active:scale-95 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
