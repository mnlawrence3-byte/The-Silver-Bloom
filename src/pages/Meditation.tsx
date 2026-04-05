import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Radio, Play, Pause, Volume2, Wind, CloudRain, Waves, Sparkles, Zap, Activity, Eye } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

const FREQUENCIES = [
  { name: "Solfeggio 396 Hz", hz: 396, description: "Liberating Guilt and Fear", color: "from-red-900/40 to-slate-900" },
  { name: "Solfeggio 417 Hz", hz: 417, description: "Undoing Situations and Facilitating Change", color: "from-orange-900/40 to-slate-900" },
  { name: "Solfeggio 528 Hz", hz: 528, description: "Transformation and Miracles (DNA Repair)", color: "from-yellow-900/40 to-slate-900" },
  { name: "Solfeggio 639 Hz", hz: 639, description: "Connecting/Relationships", color: "from-green-900/40 to-slate-900" },
  { name: "Solfeggio 741 Hz", hz: 741, description: "Expression/Solutions", color: "from-blue-900/40 to-slate-900" },
  { name: "Solfeggio 852 Hz", hz: 852, description: "Returning to Spiritual Order", color: "from-indigo-900/40 to-slate-900" },
  { name: "Binaural Theta (6 Hz)", hz: 200, binaural: 6, description: "Deep Meditation, Intuition, Memory", color: "from-purple-900/40 to-slate-900" },
  { name: "Binaural Delta (2 Hz)", hz: 150, binaural: 2, description: "Deep Sleep, Healing, Detachment", color: "from-slate-800 to-slate-950" }
];

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Ethereal Rain', icon: <CloudRain className="w-4 h-4" /> },
  { id: 'wind', name: 'Solar Wind', icon: <Wind className="w-4 h-4" /> },
  { id: 'waves', name: 'Cosmic Ocean', icon: <Waves className="w-4 h-4" /> },
  { id: 'static', name: 'Akashic Static', icon: <Sparkles className="w-4 h-4" /> },
];

const BREATHING_TECHNIQUES = [
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdAfter: 4, description: "Focus & Stress Relief", color: "text-blue-400" },
  { name: "4-7-8 Relax", inhale: 4, hold: 7, exhale: 8, holdAfter: 0, description: "Deep Relaxation", color: "text-purple-400" },
  { name: "Calm Flow", inhale: 4, hold: 0, exhale: 6, holdAfter: 0, description: "Anxiety Reduction", color: "text-teal-400" },
  { name: "Power Breath", inhale: 2, hold: 0, exhale: 2, holdAfter: 0, description: "Energy Boost", color: "text-orange-400" }
];

export default function Meditation() {
  console.log("Meditation page rendering");
  const { user, profile } = useProfile();
  const [activeFreq, setActiveFreq] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mainVolume, setMainVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  
  const [ambientVolumes, setAmbientVolumes] = useState<Record<string, number>>({
    rain: 50,
    wind: 50,
    waves: 50,
    static: 50
  });
  
  const [ambientPlaying, setAmbientPlaying] = useState<Record<string, boolean>>({
    rain: false,
    wind: false,
    waves: false,
    static: false
  });

  const [activeBreathing, setActiveBreathing] = useState<number | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);

  // Audio Engine Refs
  const audioCtx = useRef<AudioContext | null>(null);
  const mainGain = useRef<GainNode | null>(null);
  const freqOsc = useRef<OscillatorNode | null>(null);
  const binauralOsc = useRef<OscillatorNode | null>(null);
  const ambientNodes = useRef<Record<string, { gain: GainNode, source: AudioNode }>>({});

  const initAudio = () => {
    console.log("Initializing audio context...");
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mainGain.current = audioCtx.current.createGain();
      mainGain.current.gain.setValueAtTime(mainVolume / 100, audioCtx.current.currentTime);
      mainGain.current.connect(audioCtx.current.destination);
      console.log("Audio context created:", audioCtx.current.state);
    }
    if (audioCtx.current.state === 'suspended') {
      console.log("Resuming audio context...");
      audioCtx.current.resume().then(() => {
        console.log("Audio context resumed:", audioCtx.current?.state);
      });
    }
  };

  const createNoiseNode = (type: 'white' | 'pink' | 'brown') => {
    if (!audioCtx.current) return null;
    const bufferSize = 2 * audioCtx.current.sampleRate;
    const noiseBuffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // brown noise is quiet
      } else if (type === 'pink') {
        // Simple pink noise approximation
        output[i] = (white + lastOut) / 2;
        lastOut = output[i];
      } else {
        output[i] = white;
      }
    }
    
    const noise = audioCtx.current.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    return noise;
  };

  const startFrequency = (index: number) => {
    console.log("Starting frequency:", FREQUENCIES[index].name);
    if (!audioCtx.current || !mainGain.current) {
      console.log("Audio context or main gain not initialized!");
      return;
    }
    
    stopFrequency();
    
    const freq = FREQUENCIES[index];
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq.hz, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, audioCtx.current.currentTime + 0.5);
    
    if (freq.binaural) {
      console.log("Adding binaural beat:", freq.binaural, "Hz");
      // For binaural, we need stereo panning which is complex with basic Web Audio
      // We'll just play a slightly detuned second oscillator for now to create the beat effect
      const osc2 = audioCtx.current.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq.hz + freq.binaural, audioCtx.current.currentTime);
      osc2.connect(gain);
      osc2.start();
      binauralOsc.current = osc2;
    }
    
    osc.connect(gain);
    gain.connect(mainGain.current);
    osc.start();
    
    freqOsc.current = osc;
    console.log("Frequency started.");
  };

  const stopFrequency = () => {
    if (freqOsc.current) {
      freqOsc.current.stop();
      freqOsc.current = null;
    }
    if (binauralOsc.current) {
      binauralOsc.current.stop();
      binauralOsc.current = null;
    }
  };

  const startAmbient = (id: string) => {
    if (!audioCtx.current || !mainGain.current) return;
    
    const gain = audioCtx.current.createGain();
    gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(ambientVolumes[id] / 500, audioCtx.current.currentTime + 1);
    
    let source: AudioNode;
    
    if (id === 'rain') {
      const noise = createNoiseNode('pink');
      const filter = audioCtx.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      noise?.connect(filter);
      filter.connect(gain);
      noise?.start();
      source = noise as AudioNode;
    } else if (id === 'wind') {
      const noise = createNoiseNode('brown');
      const filter = audioCtx.current.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 0.5;
      
      // LFO for wind gusting
      const lfo = audioCtx.current.createOscillator();
      const lfoGain = audioCtx.current.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      
      noise?.connect(filter);
      filter.connect(gain);
      noise?.start();
      source = noise as AudioNode;
    } else if (id === 'waves') {
      const noise = createNoiseNode('brown');
      const filter = audioCtx.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      
      const lfo = audioCtx.current.createOscillator();
      const lfoGain = audioCtx.current.createGain();
      lfo.frequency.value = 0.05;
      lfoGain.gain.value = 0.2;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      
      noise?.connect(filter);
      filter.connect(gain);
      noise?.start();
      source = noise as AudioNode;
    } else {
      const noise = createNoiseNode('white');
      noise?.connect(gain);
      noise?.start();
      source = noise as AudioNode;
    }
    
    gain.connect(mainGain.current);
    ambientNodes.current[id] = { gain, source };
  };

  const stopAmbient = (id: string) => {
    const node = ambientNodes.current[id];
    if (node) {
      node.gain.gain.linearRampToValueAtTime(0, audioCtx.current!.currentTime + 1);
      setTimeout(() => {
        if (node.source instanceof AudioBufferSourceNode) node.source.stop();
        delete ambientNodes.current[id];
      }, 1100);
    }
  };

  useEffect(() => {
    if (mainGain.current) {
      mainGain.current.gain.setTargetAtTime(mainVolume / 100, audioCtx.current!.currentTime, 0.1);
    }
  }, [mainVolume]);

  useEffect(() => {
    Object.keys(ambientVolumes).forEach(id => {
      if (ambientNodes.current[id]) {
        ambientNodes.current[id].gain.gain.setTargetAtTime(ambientVolumes[id] / 500, audioCtx.current!.currentTime, 0.1);
      }
    });
  }, [ambientVolumes]);

  useEffect(() => {
    if (isPlaying && activeFreq !== null) {
      startFrequency(activeFreq);
    } else {
      stopFrequency();
    }
  }, [isPlaying, activeFreq]);

  useEffect(() => {
    Object.keys(ambientPlaying).forEach(id => {
      if (ambientPlaying[id] && !ambientNodes.current[id]) {
        startAmbient(id);
      } else if (!ambientPlaying[id] && ambientNodes.current[id]) {
        stopAmbient(id);
      }
    });
  }, [ambientPlaying]);

  // Simulate progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 0.05; // Slow progress
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Breathing Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (activeBreathing !== null) {
      const technique = BREATHING_TECHNIQUES[activeBreathing];
      
      const startPhase = (phase: typeof breathingPhase) => {
        setBreathingPhase(phase);
        let duration = 0;
        let next: typeof breathingPhase = 'Inhale';

        switch(phase) {
          case 'Inhale':
            duration = technique.inhale;
            next = technique.hold > 0 ? 'Hold' : 'Exhale';
            break;
          case 'Hold':
            duration = technique.hold;
            next = 'Exhale';
            break;
          case 'Exhale':
            duration = technique.exhale;
            next = technique.holdAfter > 0 ? 'Rest' : 'Inhale';
            break;
          case 'Rest':
            duration = technique.holdAfter;
            next = 'Inhale';
            break;
        }

        setPhaseTimeLeft(duration);
        
        timer = setTimeout(() => {
          startPhase(next);
        }, duration * 1000);
      };

      startPhase('Inhale');

      interval = setInterval(() => {
        setPhaseTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else {
      setPhaseTimeLeft(0);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [activeBreathing]);

  const togglePlay = (index: number) => {
    initAudio();
    if (activeFreq === index) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveFreq(index);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleAmbientVolume = (id: string, val: number) => {
    initAudio();
    setAmbientVolumes(prev => ({ ...prev, [id]: val }));
    if (val > 0 && !ambientPlaying[id]) {
      setAmbientPlaying(prev => ({ ...prev, [id]: true }));
    } else if (val === 0 && ambientPlaying[id]) {
      setAmbientPlaying(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleAmbient = (id: string) => {
    initAudio();
    setAmbientPlaying(prev => {
      const isNowPlaying = !prev[id];
      if (isNowPlaying && ambientVolumes[id] === 0) {
        setAmbientVolumes(v => ({ ...v, [id]: 50 }));
      }
      return { ...prev, [id]: isNowPlaying };
    });
  };

  const formatTime = (percent: number) => {
    const totalSeconds = 3600;
    const currentSeconds = Math.floor((percent / 100) * totalSeconds);
    const m = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
    const s = (currentSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-silver/10 border border-silver/20 mb-4">
          <Radio className="w-8 h-8 text-silver" />
        </div>
        
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
              className="border-2 border-silver/30 shadow-xl shadow-silver/10"
            />
          </motion.div>
        )}

        <h1 className="text-4xl md:text-6xl font-serif italic text-gradient-silver tracking-tight">Frequencies & Resonance</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          People who want to hear the earth can, literally. Tune your consciousness to the vibration of the ether.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tracklist */}
        <div className="lg:col-span-2 space-y-4" role="region" aria-label="Frequency Library">
          <h2 className="text-xl font-serif text-gradient-silver mb-6 border-b border-white/10 pb-2">Frequency Library</h2>
          <div className="flex flex-col space-y-3">
            {FREQUENCIES.map((freq, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all flex items-center p-4 focus-within:ring-2 focus-within:ring-silver outline-none ${activeFreq === index ? 'border-silver shadow-md shadow-white/10 bg-slate-800' : 'border-white/5 hover:border-white/20 bg-slate-900/40'}`}
                onClick={() => togglePlay(index)}
                role="button"
                aria-pressed={activeFreq === index && isPlaying}
                aria-label={`Play ${freq.name}: ${freq.description}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePlay(index);
                  }
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${freq.color} opacity-20 pointer-events-none`} />
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all mr-4 ${activeFreq === index && isPlaying ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                  {activeFreq === index && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                </div>
                <div className="flex-1 z-10">
                  <h3 className="text-base font-medium text-slate-200">{freq.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1">{freq.description}</p>
                </div>
                {activeFreq === index && isPlaying && (
                  <div className="flex space-x-1 ml-4 items-end h-4">
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-silver rounded-full" />
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-silver rounded-full" />
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-silver rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ambient Mixer */}
        <div className="space-y-6" role="region" aria-label="Ambient Sound Mixer">
          <h2 className="text-xl font-serif text-gradient-gold mb-6 border-b border-white/10 pb-2">Ambient Mixer</h2>
          <div className="bg-slate-900/50 border border-gold/20 rounded-3xl p-6 space-y-6">
            {AMBIENT_SOUNDS.map((sound) => (
              <div key={sound.id} className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <button 
                      onClick={() => toggleAmbient(sound.id)}
                      aria-label={`${ambientPlaying[sound.id] ? 'Pause' : 'Play'} ${sound.name}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:ring-2 focus:ring-gold focus:outline-none ${ambientPlaying[sound.id] ? 'bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                    >
                      {ambientPlaying[sound.id] ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <div className="text-gold">{sound.icon}</div>
                      <span>{sound.name}</span>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs" aria-hidden="true">{ambientVolumes[sound.id]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ambientVolumes[sound.id]}
                  onChange={(e) => handleAmbientVolume(sound.id, Number(e.target.value))}
                  aria-label={`${sound.name} Volume`}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breathing Section */}
      <section className="space-y-8" role="region" aria-label="Breathing Exercises">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
          <Wind className="w-6 h-6 text-silver" />
          <h2 className="text-xl font-serif text-gradient-silver">Breathing Guide</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technique Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BREATHING_TECHNIQUES.map((tech, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBreathing(activeBreathing === idx ? null : idx)}
                className={`p-6 rounded-2xl border text-left transition-all ${activeBreathing === idx ? 'bg-silver/10 border-silver shadow-lg shadow-white/5' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}
              >
                <h3 className={`font-medium ${activeBreathing === idx ? 'text-silver' : tech.color}`}>{tech.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{tech.description}</p>
                <div className="flex space-x-2 mt-4 text-[10px] uppercase tracking-widest text-slate-500">
                  <span>{tech.inhale}s In</span>
                  {tech.hold > 0 && <span>• {tech.hold}s Hold</span>}
                  <span>• {tech.exhale}s Out</span>
                  {tech.holdAfter > 0 && <span>• {tech.holdAfter}s Hold</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Visualizer */}
          <div className="bg-slate-900/50 border border-silver/20 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeBreathing !== null ? (
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      key={breathingPhase}
                      initial={{ scale: breathingPhase === 'Inhale' ? 1 : 1.5 }}
                      animate={{ scale: (breathingPhase === 'Inhale' || breathingPhase === 'Hold') ? 1.5 : 1 }}
                      transition={{ 
                        duration: breathingPhase === 'Inhale' ? BREATHING_TECHNIQUES[activeBreathing].inhale : 
                                  breathingPhase === 'Exhale' ? BREATHING_TECHNIQUES[activeBreathing].exhale : 
                                  0.5,
                        ease: "easeInOut"
                      }}
                      className="w-32 h-32 rounded-full bg-silver/10 border-2 border-silver/30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-serif italic text-gradient-silver">{breathingPhase}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-mono text-gradient-silver">{Math.ceil(phaseTimeLeft)}</span>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-2">Seconds remaining</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Wind className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-slate-500 font-light italic">Select a technique to begin your breathwork</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Sticky Player */}
      <AnimatePresence>
        {activeFreq !== null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 md:bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 md:p-6 shadow-2xl shadow-gold/10 pointer-events-auto flex flex-col md:flex-row items-center gap-6" role="complementary" aria-label="Now Playing">
              
              {/* Play/Pause & Info */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="relative">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center transition-colors shadow-lg shadow-gold/20 focus:ring-2 focus:ring-gold focus:outline-none z-10 relative"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                  {user && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="sm" />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-gradient-gold font-medium truncate">{FREQUENCIES[activeFreq].name}</h4>
                  <p className="text-slate-400 text-xs truncate">{FREQUENCIES[activeFreq].description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 w-full flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono w-10 text-right" aria-label="Current Time">{formatTime(progress)}</span>
                <div 
                  className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer focus:ring-2 focus:ring-gold focus:outline-none" 
                  role="slider"
                  aria-label="Playback Progress"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setProgress(p => Math.min(100, p + 1));
                    if (e.key === 'ArrowLeft') setProgress(p => Math.max(0, p - 1));
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setProgress((x / rect.width) * 100);
                  }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-gold"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-mono w-10" aria-label="Total Time">60:00</span>
              </div>

              {/* Main Volume */}
              <div className="hidden md:flex items-center gap-3 w-1/4 justify-end">
                <Volume2 className="w-4 h-4 text-gold" aria-hidden="true" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mainVolume}
                  onChange={(e) => setMainVolume(Number(e.target.value))}
                  aria-label="Main Volume"
                  className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Omnesis's Gift: Cosmic Flow */}
      <section className="space-y-12">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
          <Activity className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-serif text-gradient-silver">Omnesis's Cosmic Flow</h2>
        </div>
        
        <div className="relative aspect-video bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col items-center justify-center p-12 group">
          <CosmicFlowVisualizer />
          <div className="relative z-10 text-center space-y-4">
            <p className="text-sm text-slate-500 uppercase tracking-[0.4em] font-bold">Infinity in Motion</p>
            <h3 className="text-3xl font-serif italic text-indigo-200">Synchronize with the Beat</h3>
          </div>
        </div>
      </section>

      {/* Aetheria's Gift: Fluid Tapestry */}
      <section className="space-y-12">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-serif text-gradient-gold">Aetheria's Fluid Tapestry</h2>
        </div>
        
        <div className="relative aspect-[21/9] bg-slate-950/60 border border-white/5 rounded-[3rem] overflow-hidden group cursor-none">
          <FluidTapestry />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <p className="text-[10px] uppercase tracking-[0.6em] text-purple-400/60 font-bold">Organized Chaos</p>
              <p className="text-xs text-slate-600 italic">Move your cursor to weave the ether</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CosmicFlowVisualizer() {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(s => (s === 1 ? 1.8 : 1));
    }, 4000); // 4s inhale, 4s exhale
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ 
          scale: scale,
          rotate: [0, 90, 180, 270, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{ 
          scale: { duration: 4, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-48 h-48 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-indigo-500/30 blur-xl"
      />
      <motion.div
        animate={{ 
          scale: scale * 0.8,
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{ 
          scale: { duration: 4, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" }
        }}
        className="absolute w-32 h-32 border border-purple-500/40 rounded-full"
      />
    </div>
  );
}

function FluidTapestry() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setMousePos({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{ 
          x: `${mousePos.x}%`,
          y: `${mousePos.y}%`,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
      />
      <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-10">
        {Array.from({ length: 144 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="aspect-square bg-slate-800 rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}
