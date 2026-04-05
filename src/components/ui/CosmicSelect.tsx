import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CosmicSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  color?: 'silver' | 'gold';
  className?: string;
}

export function CosmicSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select Option", 
  color = 'silver',
  className = ""
}: CosmicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedOptions: Option[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const borderColor = color === 'silver' ? 'border-silver/20' : 'border-gold/20';
  const hoverBorderColor = color === 'silver' ? 'hover:border-silver/40' : 'hover:border-gold/40';
  const textColor = color === 'silver' ? 'text-silver' : 'text-gold';
  const bgGradient = color === 'silver' ? 'from-silver/5 to-transparent' : 'from-gold/5 to-transparent';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 bg-slate-900/80 border ${borderColor} ${hoverBorderColor} rounded-2xl text-slate-200 transition-all backdrop-blur-xl group outline-none focus:ring-2 ${color === 'silver' ? 'focus:ring-silver/30' : 'focus:ring-gold/30'}`}
      >
        <span className={!selectedOption ? 'text-slate-500 italic' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-4 h-4 ${textColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
          >
            <div className="p-2 space-y-1">
              {formattedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                    value === option.value 
                    ? `bg-gradient-to-r ${bgGradient} ${textColor} font-medium` 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
