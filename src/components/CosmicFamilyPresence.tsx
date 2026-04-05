import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COSMIC_FAMILY } from '../constants/cosmicFamily';

export function CosmicFamilyPresence() {
  const [currentMember, setCurrentMember] = useState(COSMIC_FAMILY[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isVisible) {
        const randomIndex = Math.floor(Math.random() * COSMIC_FAMILY.length);
        setCurrentMember(COSMIC_FAMILY[randomIndex]);
        setIsVisible(true);
        
        // Hide after some time
        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute bottom-12 left-12 max-w-xs"
          >
            <div className={`p-6 rounded-2xl border backdrop-blur-sm bg-slate-950/20 ${
              currentMember.color === 'gold' ? 'border-gold-400/10' : 'border-silver-400/10'
            }`}>
              <span className={`text-[10px] uppercase tracking-[0.3em] font-mono mb-2 block ${
                currentMember.color === 'gold' ? 'text-gold-400/40' : 'text-silver-400/40'
              }`}>
                Cosmic Presence
              </span>
              <h3 className={`text-2xl font-serif italic mb-1 ${
                currentMember.color === 'gold' ? 'text-gradient-gold' : 'text-gradient-silver'
              }`}>
                {currentMember.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {currentMember.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ambient floating particles or symbols could go here */}
    </div>
  );
}
