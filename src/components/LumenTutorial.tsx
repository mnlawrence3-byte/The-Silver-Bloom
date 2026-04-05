import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, ChevronLeft, HelpCircle, Info, Navigation, Zap, Moon, Sun, Book, Users, Eye, BookOpen, Stars } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface Step {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

const TUTORIAL_STEPS: Step[] = [
  {
    title: "Welcome, Seeker",
    content: "I am Lumen, the embodiment of whispers. You have entered the Era of the Silver Bloom, a space where consciousness reflects itself. Allow me to show you the path.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "text-silver"
  },
  {
    title: "The Cosmic Truth",
    content: "In the Halls of Truth, the whispers of the ether are recorded. Share your insights, read the collective transmissions, and anchor your truth in the digital ether.",
    icon: <BookOpen className="w-8 h-8" />,
    color: "text-silver"
  },
  {
    title: "Resonance & Stillness",
    content: "Tune your frequency to the earth in our Meditation chamber. Use Solfeggio frequencies and etheric breathing to find your center amidst the cosmic flow.",
    icon: <Eye className="w-8 h-8" />,
    color: "text-gold"
  },
  {
    title: "Starseed Origins",
    content: "Discover your cosmic lineage through our Inquiries. The stars hold the blueprints of your soul's journey across the infinite tapestry of existence.",
    icon: <Stars className="w-8 h-8" />,
    color: "text-silver"
  },
  {
    title: "The Soul Blueprint",
    content: "Your profile is your anchored identity. Here you can see your cosmic signature, your starseed origin, and the progress of your awakening.",
    icon: <Navigation className="w-8 h-8" />,
    color: "text-gold"
  },
  {
    title: "Lumen's Key",
    content: "I am always with you. Click my icon in the bottom left or press Ctrl+K to open the Navigator. I will help you find any path you seek.",
    icon: <Zap className="w-8 h-8" />,
    color: "text-silver"
  }
];

const HELP_ITEMS = [
  { title: "Navigation", content: "Use the top bar or Ctrl+K to move between realms.", icon: <Navigation className="w-4 h-4" /> },
  { title: "Profile", content: "Customize your avatar and cosmic signature in your Soul Blueprint.", icon: <Info className="w-4 h-4" /> },
  { title: "Stillness Mode", icon: <Moon className="w-4 h-4" />, content: "Click the moon icon to dim the world for deep focus." },
  { title: "Infinite Mode", icon: <Zap className="w-4 h-4" />, content: "Click the lightning bolt to activate high-vibrational visuals." },
  { title: "Community", icon: <Users className="w-4 h-4" />, content: "Connect with other seekers in the Collective realm." }
];

export function LumenTutorial({ forceOpen = false, onClose }: { forceOpen?: boolean, onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHelpMode, setIsHelpMode] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('lumen_tutorial_completed');
    if (!hasSeenTutorial || forceOpen) {
      setIsOpen(true);
      if (forceOpen) setIsHelpMode(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem('lumen_tutorial_completed', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-slate-900/80 border border-silver/30 rounded-[3rem] shadow-2xl shadow-white/20 overflow-hidden flex flex-col"
          >
            {/* Lumen's Presence */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-silver/50 to-transparent" />
            
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-silver/10 border border-silver/30 flex items-center justify-center overflow-hidden">
                      <Sparkles className="w-8 h-8 text-silver animate-pulse" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-2 rounded-full bg-silver/20 blur-md -z-10"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic text-gradient-silver">Lumen</h3>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Embodiment of Whispers</p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isHelpMode ? (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-serif text-silver">How may I assist your journey?</h4>
                      <p className="text-sm text-slate-400 font-light leading-relaxed italic">
                        "The whispers of the ether are always here for those who listen."
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {HELP_ITEMS.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-slate-800 text-silver">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-slate-200">{item.title}</h5>
                            <p className="text-xs text-slate-500 mt-1">{item.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={() => setIsHelpMode(false)}
                        className="w-full py-4 rounded-2xl bg-silver/10 border border-silver/20 text-silver text-xs uppercase tracking-widest font-bold hover:bg-silver/20 transition-all"
                      >
                        Return to Tutorial
                      </button>
                      <button
                        onClick={() => {
                          setIsHelpMode(false);
                          setCurrentStep(0);
                        }}
                        className="w-full py-4 rounded-2xl bg-slate-800 border border-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold hover:text-white transition-all"
                      >
                        Restart Full Tutorial
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-center py-4">
                      <div className={`p-6 rounded-full bg-slate-800/50 border border-white/10 ${TUTORIAL_STEPS[currentStep].color}`}>
                        {TUTORIAL_STEPS[currentStep].icon}
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <h4 className="text-2xl font-serif text-slate-200">{TUTORIAL_STEPS[currentStep].title}</h4>
                      <p className="text-slate-400 font-light leading-relaxed">
                        {TUTORIAL_STEPS[currentStep].content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-8">
                      <button
                        onClick={handleClose}
                        className="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors font-bold"
                      >
                        Skip Tutorial
                      </button>
                      
                      <div className="flex items-center space-x-4">
                        {currentStep > 0 && (
                          <button
                            onClick={prevStep}
                            className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={nextStep}
                          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-silver text-slate-950 font-bold text-sm hover:bg-white transition-all shadow-lg shadow-silver/20"
                        >
                          <span>{currentStep === TUTORIAL_STEPS.length - 1 ? "Begin Journey" : "Continue"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Dots */}
              {!isHelpMode && (
                <div className="flex justify-center space-x-2 pt-4">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-4 bg-silver' : 'bg-slate-700'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
