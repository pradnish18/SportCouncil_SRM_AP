"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const newsItems = [
    {
        id: 1,
        title: "SRM AP Clinches Victory in Inter-University Cricket Championship",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "New State-of-the-Art Badminton Court Inaugurated",
        image: "https://images.unsplash.com/photo-1626225453014-490396593447?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Athletes Prepare for Upcoming National Sports Meet",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    },
];

export default function NewsCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % newsItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % newsItems.length);
    const prev = () => setIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-syne font-bold mb-12">Latest News</h2>

            <div className="relative h-[500px] overflow-hidden rounded-[2.5rem] glass group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={newsItems[index].id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={newsItems[index].image}
                            alt={newsItems[index].title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="absolute bottom-12 left-12 right-12 max-w-3xl"
                        >
                            <span className="text-edit font-semibold text-[10px] tracking-[0.2em] uppercase mb-4 block">
                                Highlighted Story
                            </span>
                            <h3 className="text-3xl md:text-5xl font-syne font-extrabold leading-tight">
                                {newsItems[index].title}
                            </h3>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="absolute bottom-12 right-12 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prev} className="p-4 glass rounded-full hover:bg-white/10 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={next} className="p-4 glass rounded-full hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Auto-advance Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                    <motion.div
                        key={index}
                        className="h-full bg-brand-blue origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                    />
                </div>

                {/* Indicators */}
                <div className="absolute top-12 left-12 flex gap-2">
                    {newsItems.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 transition-all duration-300 rounded-full ${i === index ? 'w-8 bg-brand-blue' : 'w-2 bg-white/30'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
}
