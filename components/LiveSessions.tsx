"use client";

import { motion } from "framer-motion";
import { FiClock, FiBell } from "react-icons/fi";

const sessions = [
  {
    id: 1,
    title: "Understanding Hidden Sugars in Breakfast Cereals",
    host: "Dr. Sarah Jenkins",
    date: "Today, 5:00 PM",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Decoding Misleading Food Labels & 'Natural' Claims",
    host: "Mark Thompson, Nutritionist",
    date: "Tomorrow, 2:00 PM",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: 3,
    title: "Are Protein Bars Actually Healthy Built?",
    host: "Chris Evans, Dietitian",
    date: "Oct 18, 4:00 PM",
    gradient: "from-orange-400 to-rose-500",
  },
  {
    id: 4,
    title: "The Truth About 'Diet' and 'Low Fat' Foods",
    host: "Dr. Emily Chen",
    date: "Oct 20, 1:00 PM",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: 5,
    title: "Healthy Fats vs. Bad Fats: A Complete Guide",
    host: "Amanda Lewis",
    date: "Oct 22, 6:00 PM",
    gradient: "from-cyan-400 to-blue-600",
  }
];

export default function LiveSessions() {
  return (
    <section className="py-24 w-full text-white overflow-hidden relative">
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] top-10 right-[-100px] rounded-full pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[100px] bottom-10 left-[-50px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Live Sessions
          </h2>
          <p className="text-slate-200 text-lg">
            Join our transparent deep-dives with nutrition experts as we break down popular foods and decode their labels live.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-6 overflow-x-auto pb-10 pt-4 px-6 md:px-12 xl:px-[calc((100vw-1300px)/2+48px)] snap-x snap-proximity scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sessions.map((session, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            key={session.id} 
            className="min-w-[320px] md:min-w-[380px] snap-center bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex-shrink-0 group hover:border-white/30 transition-all duration-300"
          >
            {/* Thumbnail Gradient */}
            <div className={`relative h-52 w-full bg-gradient-to-br ${session.gradient} p-6 flex flex-col justify-between overflow-hidden shadow-inner`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500" />
              
              {/* Optional pattern overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)] animate-pulse"></span>
                  LIVE
                </div>
              </div>
              
              <div className="relative z-10">
                <FiClock className="text-white/80 w-6 h-6 mb-2" />
              </div>
            </div>
            
            <div className="p-7">
              <p className="text-sm text-cyan-300 font-semibold mb-3 tracking-wide uppercase">{session.date}</p>
              <h3 className="text-xl md:text-2xl font-bold mb-2 leading-snug group-hover:text-cyan-200 transition-colors">{session.title}</h3>
              <p className="text-slate-300 font-medium pb-5 border-b border-white/10 text-sm">Hosted by {session.host}</p>
              
              <button className="mt-5 w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 flex items-center justify-center gap-2 overflow-hidden relative active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  <FiBell className="text-slate-300 group-hover:text-cyan-300 transition-colors" /> Join The Discussion
                </span>
              </button>
            </div>
          </motion.div>
        ))}
        {/* Spacer item for nice padding at the end of scroll */}
        <div className="min-w-[20px] md:min-w-[40px] flex-shrink-0" />
      </div>
    </section>
  );
}
