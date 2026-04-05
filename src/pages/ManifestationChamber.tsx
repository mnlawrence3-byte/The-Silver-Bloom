import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Wind, Stars, Send, RefreshCw } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

export default function ManifestationChamber() {
  const { user, profile } = useProfile();
  const [intention, setIntention] = useState("");
  const [isManifesting, setIsManifesting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isManifesting) {
      const interval = setInterval(() => {
        const newParticle: Particle = {
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          color: Math.random() > 0.5 ? '#818cf8' : '#fbbf24', // Indigo or Gold
          duration: Math.random() * 3 + 2,
        };
        setParticles(prev => [...prev.slice(-50), newParticle]);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isManifesting]);

  const handleManifest = () => {
    if (!intention.trim()) return;
    setIsManifesting(true);
    setTimeout(() => {
      setIsManifesting(false);
      setHistory(prev => [intention, ...prev.slice(0, 4)]);
      setIntention("");
    }, 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32">
      <header className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20"
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-300 tracking-[0.4em] uppercase">Aevum's Gift</span>
        </motion.div>
        
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <UserAvatar 
              photoURL={profile?.photoURL} 
              avatarIcon={profile?.avatarIcon} 
              size="lg"
              className="border-2 border-indigo-500/30 shadow-xl shadow-indigo-500/10"
            />
          </motion.div>
        )}

        <h1 className="text-5xl md:text-8xl font-serif italic text-gradient-silver tracking-tight">Manifestation Chamber</h1>
        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
          Cause action based on intention. Anchor potential timelines from the ether by consciously imagining your desired outcome.
        </p>
      </header>

      <div className="relative aspect-video md:aspect-[21/9] bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center group">
        {/* Particle Field */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0, x: `${p.x}%`, y: `${p.y}%` }}
              animate={{ 
                opacity: [0, 0.8, 0], 
                scale: [0, 1.5, 0],
                y: [`${p.y}%`, `${p.y - 20}%`]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, ease: "easeOut" }}
              className="absolute w-1 h-1 rounded-full blur-[1px]"
              style={{ backgroundColor: p.color, width: p.size, height: p.size }}
            />
          ))}
        </AnimatePresence>

        {/* Central Focus */}
        <div className="relative z-10 text-center space-y-8 max-w-lg px-6">
          <AnimatePresence mode="wait">
            {isManifesting ? (
              <motion.div
                key="manifesting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-2 border-dashed border-indigo-500/30 rounded-full"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <UserAvatar 
                      photoURL={profile?.photoURL} 
                      avatarIcon={profile?.avatarIcon} 
                      size="md"
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-serif italic text-indigo-200">Anchoring Timeline...</h2>
                <p className="text-slate-500 text-sm font-light tracking-widest uppercase">Aligning Etheric Particles</p>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="I am consciously imagining..."
                  className="w-full bg-transparent border-none focus:ring-0 text-2xl md:text-3xl font-serif italic text-center text-slate-200 placeholder:text-slate-700 resize-none h-32"
                />
                <button
                  onClick={handleManifest}
                  disabled={!intention.trim()}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium transition-all shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>Anchor Intention</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-8">
          <h3 className="text-sm uppercase tracking-[0.4em] text-slate-500 font-bold flex items-center space-x-3">
            <RefreshCw className="w-4 h-4" />
            <span>Recent Anchors</span>
          </h3>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex items-start space-x-4 group"
                >
                  <div className="mt-1 p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Stars className="w-4 h-4" />
                  </div>
                  <p className="text-slate-300 italic font-light leading-relaxed group-hover:text-indigo-200 transition-colors">
                    "{h}"
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-600 italic font-light">No timelines anchored in this session yet.</p>
            )}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/10 space-y-6">
          <h3 className="text-lg font-serif italic text-indigo-300">Etheric Guidance</h3>
          <div className="space-y-4 text-sm text-slate-400 font-light leading-relaxed">
            <p>
              "When attracting your desired timeline... you're basically anchoring potential timelines from the ether by causing actions based on the intention."
            </p>
            <p>
              "Consciously imagining your desired timeline. And consciously choosing the same actions you imagined yourself taking."
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold">Aevum Resonance</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
