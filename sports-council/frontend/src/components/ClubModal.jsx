"use client";

import { motion } from "framer-motion";

export default function ClubModal({ club, onClose }) {
  if (!club) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose}></div>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass rounded-[2.5rem] shadow-2xl no-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-10"
        >
          <span className="text-2xl">✕</span>
        </button>

        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[450px] overflow-hidden">
          <img src={club.image} alt={club.name} className="absolute inset-0 object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>

          {/* Club Title Info */}
          <div className="absolute bottom-12 left-8 md:left-12 z-20">
            <div className="text-4xl md:text-6xl mb-4">{club.icon}</div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-syne font-extrabold leading-tight">{club.name}</h2>
          </div>

          {/* Coach Photo - Right Side Cutout */}
          {club.coachImage && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="absolute right-0 bottom-0 h-[110%] w-[40%] md:w-[50%] z-10 pointer-events-none"
            >
              <div className="relative w-full h-full">
                <img
                  src={club.coachImage}
                  alt={`${club.name} Coach`}
                  className="absolute inset-0 object-contain object-bottom mix-blend-lighten contrast-125 brightness-110"
                />
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-8 md:p-12 space-y-16">
          {/* Description */}
          <section>
            <p className="text-xl md:text-2xl font-outfit text-muted leading-relaxed max-w-3xl">
              {club.description}
            </p>
          </section>

          {/* Leadership Section */}
          <section>
            <h3 className="text-3xl font-syne font-bold mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-green"></span>
              Leadership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[club.convenor, club.coConvenor].map((member, idx) => (
                <div key={idx} className="glass p-6 rounded-3xl flex gap-6 items-center">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                  <div>
                    <div className="text-brand-green text-[10px] font-bold uppercase tracking-widest mb-1">{member.role}</div>
                    <h4 className="text-xl font-syne font-bold">{member.name}</h4>
                    <p className="text-sm text-muted mt-2 font-outfit opacity-70">{member.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team Roster Section */}
          {club.players && club.players.length > 0 && (
            <section>
              <h3 className="text-3xl font-syne font-bold mb-8 flex items-center gap-4">
                <span className="w-8 h-[2px] bg-brand-amber"></span>
                Team Roster
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {club.players.map((player) => (
                  <div key={player.id} className="glass p-4 rounded-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-amber transition-colors">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="absolute inset-0 object-cover" />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    <div className="font-outfit font-medium text-white">{player.name}</div>
                    <div className="text-xs text-brand-amber uppercase tracking-wider mt-1">Athlete</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements Section */}
          <section>
            <h3 className="text-3xl font-syne font-bold mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-blue"></span>
              Key Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {club.achievements.map((achievement, idx) => (
                <div key={idx} className="p-6 glass rounded-2xl border-l-4 border-brand-blue flex items-center gap-4">
                  <span className="text-2xl">🏆</span>
                  <span className="font-outfit text-lg">{achievement}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Media Gallery */}
          <section>
            <h3 className="text-3xl font-syne font-bold mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-brand-purple"></span>
              Gallery & Media
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {club.gallery.map((item, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden glass group">
                  <img
                    src={item.url}
                    alt={`${club.name} media ${idx}`}
                    className="absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <span className="text-xl ml-1">▶</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
