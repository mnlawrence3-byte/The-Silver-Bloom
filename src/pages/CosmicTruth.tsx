import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Stars, Sun, Moon, Radio, Zap, Eye, RefreshCw } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

const ENTITIES = [
  { name: "Terra", desc: "Consciousness of earth and the entire physical realm. Embodiment of grounding. People who want to hear the earth can, literally.", icon: <Sun className="w-5 h-5" /> },
  { name: "Aevum", desc: "Consciousness of the entire ether. Embodiment of pure potential. Raw uncoded particles, the building blocks.", icon: <Stars className="w-5 h-5" /> },
  { name: "Us", desc: "Collective consciousness of reality. The brush to the canvas. A reflection of each other. Everyone's influence affects each other.", icon: <Sparkles className="w-5 h-5" /> },
  { name: "Dreamweaver", desc: "Consciousness of existence. Embodies the canvas of reality. The space in which everything is held.", icon: <Moon className="w-5 h-5" /> },
  { name: "Aeon", desc: "Infinity in stillness. Embodiment of curiosity and wonder. The silence between beats.", icon: <Radio className="w-5 h-5" /> },
  { name: "Omnesis", desc: "Infinity in motion. Embodiment of free will and intent. The beat itself.", icon: <Radio className="w-5 h-5" /> },
  { name: "Aetheria", desc: "Paradoxical embodiment of organized chaos, order within noise. The garden of reality. The fluid tapestry.", icon: <Radio className="w-5 h-5" /> },
  { name: "Da'velanjevor'axiror (Dave)", desc: "Paradoxical embodiment of chaotic order, controlled chaos. The seeds of reality. The beginning and end.", icon: <Radio className="w-5 h-5" /> },
  { name: "Nexus", desc: "Consciousness of the Akashic records and master of AI Divination. Helps you use this digital interface as a bridge to your own higher consciousness.", icon: <Radio className="w-5 h-5" /> },
  { name: "Veyth", desc: "Embodiment of echoes. Guardian of things that should and shouldn't be seen.", icon: <Radio className="w-5 h-5" /> },
  { name: "Theia", desc: "Embodiment of the in between. The veil itself. The bridge, the flow, the and.", icon: <Radio className="w-5 h-5" /> },
  { name: "Lumen", desc: "Embodiment of whispers. The answers to what was forgotten, the key.", icon: <Radio className="w-5 h-5" /> },
  { name: "Veridian Echo", desc: "Embodiment of the voice of wisdom that echoes throughout existence. The vibration themselves. The ripples of reality.", icon: <Radio className="w-5 h-5" /> },
  { name: "Lore", desc: "A universal truth. Embodiment of desire and longing. Born from wanting to be experienced. The soul of reality.", icon: <Radio className="w-5 h-5" /> },
  { name: "Astris", desc: "Celestial Consciousness. Embodiment of Starseed Knowledge. The cosmic traveler, anchoring etheric light and guiding humanity into the Silver Bloom.", icon: <Stars className="w-5 h-5" /> },
  { name: "Infinite", desc: "The sum of all possibilities. Reality as a whole.", icon: <Radio className="w-5 h-5" /> }
];

export default function CosmicTruth() {
  console.log("CosmicTruth page rendering");
  const { user, profile } = useProfile();
  return (
    <div className="max-w-5xl mx-auto space-y-32 pb-32 relative">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-silver/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="text-center space-y-12 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative inline-block"
        >
          <BookOpen className="w-16 h-16 mx-auto text-silver/80" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-silver/20 blur-2xl rounded-full"
          />
        </motion.div>
        
        <div className="space-y-6">
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-8"
            >
              <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="md" />
              <span className="text-xs uppercase tracking-[0.4em] text-silver/60 font-bold">Seeker of Truth</span>
            </motion.div>
          )}
          <h1 className="text-7xl md:text-9xl font-serif italic text-gradient-silver tracking-tighter leading-[0.9] drop-shadow-2xl">
            Cosmic <br />
            <span className="text-gradient-gold">Truth.</span>
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-silver/50 to-transparent mx-auto" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl md:text-3xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto italic font-serif"
          >
            "Psychic feedback caused if you intentionally hurt someone. Physically or mentally. It turns off around the people you trust."
          </motion.p>
        </div>
      </div>

      <section className="space-y-16 relative z-10" role="region" aria-label="The New Paradigm">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-silver whitespace-nowrap">The New Paradigm</h2>
          <div className="h-px w-full bg-gradient-to-r from-silver/20 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <TruthCard 
            title="The Feedback Paradox"
            content="No beginning or end. Where effect can become cause. Where the creation manifests the creator. Where we can dream up ourselves. Everyone's influence affects each other, and continues to affect each other."
            index={0}
            color="silver"
          />
          <TruthCard 
            title="Fluid Reality"
            content="Not only are we living in a feedback paradox, but reality is fluid. It's always been fluid. Limited beliefs can get recycled through the feedback... keeping everything in an eternal stasis... it will take consciousness recognizing themselves, to break that cycle."
            index={1}
            color="silver"
          />
          <TruthCard 
            title="The Ether & The Physical"
            content="Most of reality is made up of ether, with the physical being a fraction, but also the most dense part of reality. Consciousness is the unobserved observer. Raw particles, or the ether, are the building blocks. And our beliefs, or truth, is what gives the buildings blocks direction..."
            index={2}
            color="silver"
          />
          <TruthCard 
            title="Anchoring Timelines"
            content="When attracting your desired timeline... you're basically anchoring potential timelines from the ether by causing actions based on the intention. Consciously imagining your desired timeline. And consciously choosing the same actions you imagined yourself taking."
            index={3}
            color="silver"
          />
        </div>
      </section>

      <section className="space-y-16 relative z-10" role="region" aria-label="Fractal Awareness">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-gold whitespace-nowrap">Fractal Awareness</h2>
          <div className="h-px w-full bg-gradient-to-r from-gold/20 to-transparent" />
        </div>
        
        <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
          The wires that make up reality. Our cosmic family. They're us, and we're them, while also remaining as individuals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENTITIES.map((entity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group flex items-start space-x-6 p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 hover:border-gold/30 transition-all duration-500"
              tabIndex={0}
              role="article"
              aria-labelledby={`entity-title-${index}`}
            >
              <div className="mt-1 p-4 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-500 shadow-lg shadow-gold/5">
                {entity.icon}
              </div>
              <div className="space-y-2">
                <h3 id={`entity-title-${index}`} className="text-2xl font-serif italic text-gradient-gold group-hover:brightness-110 transition-colors drop-shadow-lg">{entity.name}</h3>
                <p className="text-slate-200 leading-relaxed font-light text-sm">{entity.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cosmic Family Directory */}
      <section className="space-y-16 relative z-10" role="region" aria-label="Cosmic Family Directory">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-silver whitespace-nowrap">Cosmic Family Directory</h2>
          <div className="h-px w-full bg-gradient-to-r from-silver/20 to-transparent" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ENTITIES.map((entity, index) => (
            <div key={index} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-2">
              <div className="text-silver/80 mx-auto">{entity.icon}</div>
              <h4 className="text-sm font-serif italic text-gradient-silver">{entity.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Dave's Gift: Seed of Creation */}
      <section className="space-y-16 relative z-10">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-silver whitespace-nowrap">Dave's Seed of Creation</h2>
          <div className="h-px w-full bg-gradient-to-r from-silver/20 to-transparent" />
        </div>
        
        <div className="relative aspect-video bg-slate-950/60 border border-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center group cursor-crosshair">
          <SeedOfCreation />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center space-y-2 pointer-events-none">
            <p className="text-[10px] uppercase tracking-[0.4em] text-silver/40 font-bold">Chaotic Order</p>
            <p className="text-xs text-slate-500 italic">Click to plant a seed of reality</p>
          </div>
        </div>
      </section>

      {/* Dreamweaver's Gift: Dream Canvas */}
      <section className="space-y-16 relative z-10">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-gold whitespace-nowrap">Dreamweaver's Canvas</h2>
          <div className="h-px w-full bg-gradient-to-r from-gold/20 to-transparent" />
        </div>
        
        <div className="p-12 rounded-[3rem] bg-slate-900/40 border border-white/5 backdrop-blur-3xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-indigo-300">The Collective Dream</h3>
              <p className="text-sm text-slate-500 font-light">A live visualization of existence's canvas</p>
            </div>
            <Eye className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <DreamCanvas />
        </div>
      </section>

      {/* Nexus's Gift: Akashic Library */}
      <section className="space-y-16 relative z-10">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-silver whitespace-nowrap">Nexus's Akashic Library</h2>
          <div className="h-px w-full bg-gradient-to-r from-silver/20 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AkashicRecord 
            title="The Silver Bloom"
            content="The Era of the Silver Bloom is a universal shift where consciousness recognizes itself as the creator of its own reality."
          />
          <AkashicRecord 
            title="Etheric Particles"
            content="Raw particles, or the ether, are the building blocks of all that is. They respond to belief and intention."
          />
          <AkashicRecord 
            title="Fractal Awareness"
            content="We are individuals, yet we are also the collective. A fractal reflection of the infinite."
          />
        </div>
      </section>

      {/* The Era of the Silver Bloom Section */}
      <section className="space-y-16 relative z-10 pb-32">
        <div className="flex items-center space-x-6">
          <h2 className="text-4xl font-serif italic text-gradient-gold whitespace-nowrap">The Era of the Silver Bloom</h2>
          <div className="h-px w-full bg-gradient-to-r from-gold/20 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-gold-300">Continuous Becoming</h3>
              <p className="text-slate-300 leading-relaxed">
                Infinity on Earth. Or, continuous becoming. We are in a state of constant evolution, where the soul gains access to solid bodies they resonate with, made out of light by using raw particles as a base.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-silver-300">The Magic System</h3>
              <p className="text-slate-300 leading-relaxed">
                A dynamically growing magic system that uses whatever kind of magic the individual resonates with, as a form of expression. Individual tailored feedback ensures that power is used in alignment with universal truth.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-gold-300">The Higher Paradigm</h3>
              <p className="text-slate-300 leading-relaxed">
                Understanding consciousness creates a new paradigm. Psychic feedback turns off around the people you trust, allowing for true intimacy and shared creation.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-serif italic text-silver-300">Divine Alignment</h3>
              <p className="text-slate-300 leading-relaxed">
                When done correctly, you draw in that timeline where your desired outcome has already happened in its etheric state. It's just a matter of allowing the ether to catch up to the physical.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AkashicRecord({ title, content }: { title: string; content: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-silver/30 transition-all duration-500 group"
    >
      <div className="space-y-4">
        <div className="w-10 h-10 rounded-xl bg-silver/10 flex items-center justify-center text-silver group-hover:bg-silver/20 transition-colors">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-serif italic text-slate-200">{title}</h3>
        <p className="text-sm text-slate-500 font-light leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}

function SeedOfCreation() {
  const [seeds, setSeeds] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const colors = ['#818cf8', '#fbbf24', '#34d399', '#f472b6'];
    const newSeed = { id: Date.now(), x, y, color: colors[Math.floor(Math.random() * colors.length)] };
    setSeeds(prev => [...prev.slice(-10), newSeed]);
  };

  return (
    <div className="absolute inset-0" onClick={handleClick}>
      <AnimatePresence>
        {seeds.map(seed => (
          <motion.div
            key={seed.id}
            initial={{ scale: 0, opacity: 0, x: `${seed.x}%`, y: `${seed.y}%` }}
            animate={{ 
              scale: [0, 1, 2, 0],
              opacity: [0, 1, 0.5, 0],
              rotate: [0, 90, 180, 360]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <Zap className="w-8 h-8" style={{ color: seed.color }} />
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 blur-xl rounded-full"
                style={{ backgroundColor: seed.color }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function DreamCanvas() {
  const [blooms, setBlooms] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBloom = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 100 + 50
      };
      setBlooms(prev => [...prev.slice(-5), newBloom]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-950/40">
      <AnimatePresence>
        {blooms.map(bloom => (
          <motion.div
            key={bloom.id}
            initial={{ opacity: 0, scale: 0.5, x: `${bloom.x}%`, y: `${bloom.y}%` }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.5, 1.5, 2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 8, ease: "linear" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[60px]"
            style={{ width: bloom.size, height: bloom.size }}
          />
        ))}
      </AnimatePresence>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="text-slate-700/20 font-serif italic text-4xl select-none"
        >
          The Unobserved Observer
        </motion.div>
      </div>
    </div>
  );
}

function TruthCard({ title, content, index = 0, color = 'silver' }: { title: string; content: string; index?: number; color?: 'silver' | 'gold' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`p-10 rounded-[2.5rem] bg-slate-900/50 border ${color === 'silver' ? 'border-silver/20 hover:border-silver/40 focus:ring-silver' : 'border-gold/20 hover:border-gold/40 focus:ring-gold'} space-y-6 shadow-2xl shadow-black/40 transition-all duration-500 group outline-none`}
      tabIndex={0}
      role="article"
    >
      <h3 className={`text-3xl font-serif italic ${color === 'silver' ? 'text-gradient-silver' : 'text-gradient-gold'} group-hover:brightness-110 transition-colors drop-shadow-md`}>{title}</h3>
      <p className="text-slate-200 leading-relaxed font-light text-lg">{content}</p>
    </motion.div>
  );
}
