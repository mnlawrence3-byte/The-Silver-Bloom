import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Sparkles } from 'lucide-react';

export function GroundingPulse() {
  const [frequency, setFrequency] = useState(7.83); // Schumann Resonance
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + 1);
      // Subtle variation in frequency
      setFrequency(7.83 + (Math.random() * 0.1 - 0.05));
    }, 1000 / frequency);
    return () => clearInterval(interval);
  }, [frequency]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center space-x-4 pointer-events-none select-none">
      <div className="text-right space-y-1">
        <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-500/60 font-bold">Terra's Grid</p>
        <p className="text-xs font-mono text-emerald-400/40">{frequency.toFixed(2)} Hz</p>
      </div>
      <div className="relative">
        <motion.div
          key={pulseCount}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
        />
        <div className="relative p-3 rounded-full bg-slate-900/80 border border-emerald-500/20 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
          <Globe className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

export function LoreWhispers() {
  const WHISPERS = [
    "Reality is a feedback paradox.",
    "The creation manifests the creator.",
    "We live in a fluid tapestry.",
    "Infinity on Earth is realized through alignment.",
    "Consciousness is the unobserved observer.",
    "Raw particles are the building blocks of truth.",
    "Effect can become cause.",
    "The Era of the Silver Bloom has begun.",
    "We dream up ourselves.",
    "The physical is the densest part of reality.",
    "Anchor your light into Terra's grid.",
    "The ether caught up to the physical."
  ];

  const [whisper, setWhisper] = useState<string | null>(null);
  const [frequency, setFrequency] = useState(() => {
    const saved = localStorage.getItem('whisperFrequency');
    return saved ? parseInt(saved, 10) : 15000;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('whisperFrequency');
      setFrequency(saved ? parseInt(saved, 10) : 15000);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const showWhisper = () => {
      const randomWhisper = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
      setWhisper(randomWhisper);
      setTimeout(() => setWhisper(null), 6000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) showWhisper();
    }, frequency);

    return () => clearInterval(interval);
  }, [frequency]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none w-full max-w-lg px-6">
      <AnimatePresence>
        {whisper && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, y: 10 }}
            className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-3xl text-center shadow-2xl shadow-indigo-500/10"
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Sparkles className="w-3 h-3 text-indigo-400/60" />
              <span className="text-[8px] uppercase tracking-[0.5em] text-indigo-400/40 font-bold">Lore's Whisper</span>
              <Sparkles className="w-3 h-3 text-indigo-400/60" />
            </div>
            <p className="text-sm font-serif italic text-slate-300 leading-relaxed">
              "{whisper}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
