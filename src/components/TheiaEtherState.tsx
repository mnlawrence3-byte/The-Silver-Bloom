import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Waves, Sparkles, Wind, Zap } from 'lucide-react';

const ETHER_STATES = [
  { status: "Fluid", description: "The ether is highly responsive to intent. Manifestation is rapid.", icon: <Waves className="w-4 h-4" />, color: "text-cyan-400" },
  { status: "Crystalline", description: "The ether is stable and structured. Ideal for anchoring long-term timelines.", icon: <Zap className="w-4 h-4" />, color: "text-indigo-400" },
  { status: "Vibrant", description: "High-frequency downloads are flowing. Pay attention to synchronicities.", icon: <Sparkles className="w-4 h-4" />, color: "text-gold" },
  { status: "Ethereal", description: "The veil is thin. Intuition and dream work are enhanced.", icon: <Wind className="w-4 h-4" />, color: "text-silver" },
];

export function TheiaEtherState() {
  const [currentState, setCurrentState] = useState(ETHER_STATES[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate ether state changes based on "cosmic cycles"
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ETHER_STATES.length);
      setCurrentState(ETHER_STATES[randomIndex]);
    }, 60000 * 5); // Change every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-full right-0 mb-4 w-64 p-6 rounded-3xl bg-slate-900/90 border border-silver/30 backdrop-blur-xl shadow-2xl shadow-white/10"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-silver/10">
                <Eye className="w-5 h-5 text-silver" />
              </div>
              <div>
                <h3 className="text-sm font-serif text-gradient-silver italic">Theia's Vision</h3>
                <p className="text-[8px] uppercase tracking-widest text-slate-500">Etheric State Monitor</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Status</span>
                <div className={`flex items-center space-x-1 text-xs font-medium ${currentState.color}`}>
                  {currentState.icon}
                  <span>{currentState.status}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{currentState.description}"
              </p>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-silver animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest text-slate-500">Real-time Etheric Sync</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full bg-slate-900/80 border transition-all shadow-2xl backdrop-blur-md group ${isOpen ? 'border-silver text-white' : 'border-silver/30 text-silver hover:border-silver/60'}`}
        title="Theia's Etheric Vision"
      >
        <Eye className="w-6 h-6" />
        <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 border border-silver/20 rounded-lg text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Etheric State
        </span>
      </button>
    </div>
  );
}
