"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "../lib/api";

export default function Hero() {
  const { data: stats } = useSWR("/api/stats", fetcher);

  const totalTeams = stats ? stats.totalTeams : 15;
  const totalMembers = stats ? stats.totalMembers : 500;

  return (
    <section className="relative flex min-h-[calc(100vh-70px)] flex-col items-center justify-center overflow-hidden md:min-h-[calc(100vh-96px)]">
      {/* Background Video & Theme Overlay */}
      <div className="absolute inset-0 z-0 bg-brand-srm">
        <img
          src="/college-video-background.gif"
          alt="background"
          className="absolute inset-0 object-cover w-full h-full opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      <div className="z-10 text-center max-w-4xl px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.3em] uppercase border rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-md"
        >
          SRM University AP
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-8xl font-syne font-extrabold text-white drop-shadow-2xl leading-[0.95] tracking-tight"
        >
          SRM <span className="text-white/80">SPORTS</span>
          <br />
          COUNCIL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 font-outfit text-lg sm:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed font-medium"
        >
          Nurturing champions, fostering community, and driving athletic excellence at SRM University AP.
        </motion.p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="mt-16 z-10 glass shadow-2xl rounded-3xl p-1 bg-white/5 border-white/10"
      >
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 p-2">
          <div className="px-8 sm:px-12 py-6 text-center">
            <div className="text-3xl sm:text-4xl font-syne font-extrabold text-white">
              {totalTeams}+
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Teams</div>
          </div>
          <div className="hidden sm:block w-[1px] h-12 bg-white/10"></div>
          <div className="px-8 sm:px-12 py-6 text-center">
            <div className="text-3xl sm:text-4xl font-syne font-extrabold text-white">
              {totalMembers}+
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Athletes</div>
          </div>
          <div className="hidden sm:block w-[1px] h-12 bg-white/10"></div>
          <div className="px-8 sm:px-12 py-6 text-center">
            <div className="text-3xl sm:text-4xl font-syne font-extrabold text-white">
              25+
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mt-1">Sports</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
