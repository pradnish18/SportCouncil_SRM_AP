"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "../lib/api";

const fallbackNewsItems = [
  {
    id: "fallback-1",
    headline: "SRM AP Clinches Victory in Inter-University Cricket Championship",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
  },
  {
    id: "fallback-2",
    headline: "New State-of-the-Art Badminton Court Inaugurated",
    imageUrl: "https://images.unsplash.com/photo-1626225453014-490396593447?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "fallback-3",
    headline: "Athletes Prepare for Upcoming National Sports Meet",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function NewsCarousel() {
  const [index, setIndex] = useState(0);
  const { data: fetchedNews } = useSWR("/api/news", fetcher);

  // Map backend fields to frontend expected fields, filtering out invalid entries
  const mappedNews = Array.isArray(fetchedNews)
    ? fetchedNews
        .filter((news) => news.headline && news.imageUrl)
        .map((news) => ({
            id: news.id,
            headline: news.headline,
            imageUrl: news.imageUrl,
          }))
    : [];
  const newsData = mappedNews.length > 0 ? mappedNews : fallbackNewsItems;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % newsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [newsData.length]);

  const next = () => setIndex((prev) => (prev + 1) % newsData.length);
  const prev = () => setIndex((prev) => (prev - 1 + newsData.length) % newsData.length);

  if (newsData.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 w-full max-w-[95vw] 2xl:max-w-[1600px] mx-auto bg-background transition-colors duration-500">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-syne font-black text-foreground uppercase tracking-tight">Latest News</h2>
        <div className="flex gap-3">
          <button
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-brand-srm/10 transition-colors shadow-sm"
            aria-label="Previous story"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-brand-srm/10 transition-colors shadow-sm"
            aria-label="Next story"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[600px] md:h-[75vh] lg:min-h-[700px] max-h-[900px] overflow-hidden rounded-[3rem] border border-border group shadow-2xl">
        {newsData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{ pointerEvents: i === index ? "auto" : "none" }}
          >
            <img
              src={item.imageUrl}
              alt={item.headline}
              className="absolute inset-0 object-cover w-full h-full"
            />
            {/* Improved Theme-Aware Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-20 left-12 right-12 max-w-4xl z-10">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: i === index ? 1 : 0, x: i === index ? 0 : -20 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-3 py-1 bg-brand-srm text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 shadow-lg"
              >
                Highlighted Story
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 30 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-syne font-black text-white leading-[1.1] tracking-tight drop-shadow-xl"
              >
                {item.headline}
              </motion.h3>
            </div>
          </motion.div>
        ))}

        {/* Auto-advance Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20">
          <motion.div
            key={index}
            className="h-full bg-brand-srm origin-left shadow-[0_0_15px_rgba(73,70,35,0.8)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>

        {/* Indicators */}
        <div className="absolute top-12 left-12 flex gap-3 z-20">
          {newsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full shadow-lg ${
                i === index ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
