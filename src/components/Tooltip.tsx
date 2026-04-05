import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      role="group"
      aria-label={text}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            aria-hidden={!isVisible}
            className="absolute bottom-full mb-2 whitespace-nowrap px-3 py-1.5 bg-black/90 text-silver text-xs font-medium rounded-md shadow-xl border border-silver/30 z-50 pointer-events-none"
          >
            {text}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
