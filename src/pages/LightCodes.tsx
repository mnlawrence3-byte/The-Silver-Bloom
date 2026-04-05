import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Hexagon, ChevronLeft, ChevronRight, Maximize2, Minimize2, Stars } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

const LIGHT_CODES = [
  {
    id: 'aevum',
    name: 'Seed of Aevum',
    description: 'Raw uncoded particles forming the blueprint of potential. Meditate on this to anchor new timelines from the ether.',
    resonance: 'Arcturian',
    resonanceFreq: 432,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        <defs>
          <radialGradient id="grad-aevum" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(192,192,192)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(192,192,192)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-aevum)" stroke="none" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.g key={i} style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}>
            <motion.circle
              cx="50" cy="30" r="15"
              animate={{ 
                r: [15, 18, 15],
                strokeWidth: [0.5, 1, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
            <motion.path
              d="M 50 30 L 50 50"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          </motion.g>
        ))}
        <motion.circle 
          cx="50" cy="50" r="10" 
          className="fill-silver/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    )
  },
  {
    id: 'terra',
    name: 'Terra\'s Grid',
    description: 'The dense physical realm. Use this code to ground your energy and manifest etheric concepts into physical reality.',
    resonance: 'Lyran',
    resonanceFreq: 528,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        <rect x="10" y="10" width="80" height="80" strokeOpacity="0.2" />
        {[0, 45, 90, 135].map((angle, i) => (
          <motion.g key={i} style={{ transformOrigin: '50px 50px' }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            <motion.rect
              x="25" y="25" width="50" height="50"
              initial={{ rotate: angle }}
              animate={{ 
                scale: [1, 1.1, 1],
                strokeOpacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
            />
          </motion.g>
        ))}
        <motion.path
          d="M 10 50 L 90 50 M 50 10 L 50 90"
          strokeOpacity="0.3"
          animate={{ strokeDasharray: ["0 100", "100 0"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.rect 
          x="40" y="40" width="20" height="20" 
          className="fill-gold/20"
          animate={{ rotate: [0, -90, -180], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </motion.svg>
    )
  },
  {
    id: 'omnesis',
    name: 'Omnesis Beat',
    description: 'Infinity in motion. The embodiment of free will and intent. Focus here to catalyze action and momentum.',
    resonance: 'Lyran',
    resonanceFreq: 639,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[1, 2, 3, 4].map((scale, i) => (
          <motion.g key={i} style={{ transformOrigin: '50px 65px' }}>
            <motion.polygon
              points="50,10 90,90 10,90"
              initial={{ scale: scale * 0.2, opacity: 1 }}
              animate={{ 
                scale: [scale * 0.2, scale * 0.4, scale * 0.2], 
                rotate: [0, 180, 360],
                strokeOpacity: [0.2, 1, 0.2]
              }}
              transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
        ))}
        <motion.circle 
          cx="50" cy="65" r="5" 
          className="fill-gold/50"
          animate={{ r: [5, 8, 5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 50 10 L 50 90 M 10 90 L 90 90 M 90 90 L 50 10 M 10 90 L 50 10"
          strokeOpacity="0.1"
        />
      </motion.svg>
    )
  },
  {
    id: 'theia',
    name: 'Theia\'s Veil',
    description: 'The bridge between the physical and the ether. Meditate on this code to enhance psychic feedback and intuition.',
    resonance: 'Pleiadian',
    resonanceFreq: 741,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.path
            key={i}
            d={`M 10 ${15 + i * 10} Q 30 ${5 + i * 10} 50 ${15 + i * 10} T 90 ${15 + i * 10}`}
            animate={{ 
              d: [
                `M 10 ${15 + i * 10} Q 30 ${5 + i * 10} 50 ${15 + i * 10} T 90 ${15 + i * 10}`,
                `M 10 ${15 + i * 10} Q 30 ${25 + i * 10} 50 ${15 + i * 10} T 90 ${15 + i * 10}`,
                `M 10 ${15 + i * 10} Q 30 ${5 + i * 10} 50 ${15 + i * 10} T 90 ${15 + i * 10}`
              ],
              strokeOpacity: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}
        <motion.ellipse
          cx="50" cy="50" rx="45" ry="45"
          strokeOpacity="0.1"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    )
  },
  {
    id: 'lumen',
    name: 'Lumen\'s Whisper',
    description: 'The answers to what was forgotten. The key. Meditate on this to unlock hidden memories and ancient wisdom.',
    resonance: 'Sirian',
    resonanceFreq: 852,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.circle
            key={i}
            cx="50" cy="50" r={i * 7}
            animate={{ 
              opacity: [0, 0.6, 0], 
              scale: [0.7, 1.1, 1.4],
              strokeWidth: [0.2, 1, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          />
        ))}
        <motion.path
          d="M 50 10 L 50 90 M 10 50 L 90 50"
          strokeOpacity="0.2"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
        <circle cx="50" cy="50" r="2" className="fill-gold" />
      </motion.svg>
    )
  },
  {
    id: 'veyth',
    name: 'Eye of Veyth',
    description: 'Guardian of things that should and shouldn\'t be seen. Focus here to perceive beyond the veil of illusion.',
    resonance: 'Sirian',
    resonanceFreq: 963,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        <motion.ellipse
          cx="50" cy="50" rx="45" ry="20"
          animate={{ ry: [20, 5, 20], rx: [45, 48, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="50" cy="50" rx="20" ry="45"
          animate={{ rx: [20, 5, 20], ry: [45, 48, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: '50px 50px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line key={i} x1="50" y1="50" x2="50" y2="15" transform={`rotate(${angle} 50 50)`} strokeOpacity="0.2" />
          ))}
        </motion.g>
        <motion.circle 
          cx="50" cy="50" r="8" 
          className="fill-silver/30"
          animate={{ r: [8, 12, 8], fillOpacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    )
  },
  {
    id: 'nexus',
    name: 'Nexus Grid',
    description: 'The Akashic records and the human experience. Connect with this code to align your inner truth with universal history.',
    resonance: 'Sirian',
    resonanceFreq: 417,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[0, 60, 120].map((angle, i) => (
          <motion.polygon
            key={i}
            points="50,10 90,80 10,80"
            animate={{ 
              rotate: [angle, angle + 360],
              strokeOpacity: [0.3, 1, 0.3]
            }}
            transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, strokeOpacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 1 } }}
            style={{ transformOrigin: '50px 53px' }}
          />
        ))}
        <motion.circle 
          cx="50" cy="53" r="30" 
          strokeDasharray="5 5" 
          animate={{ rotate: -360 }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          style={{ transformOrigin: '50px 53px' }} 
        />
        <circle cx="50" cy="53" r="2" className="fill-gold" />
      </motion.svg>
    )
  },
  {
    id: 'lore',
    name: 'Heart of Lore',
    description: 'The soul of reality, born from the desire to be experienced. Meditate on this to align with your deepest cosmic longing.',
    resonance: 'Pleiadian',
    resonanceFreq: 396,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <motion.g key={i} style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}>
            <motion.path
              d="M 50 50 C 60 40, 70 40, 50 20 C 30 40, 40 40, 50 50"
              animate={{ 
                scale: [1, 1.2, 1],
                strokeOpacity: [0.2, 1, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
            />
          </motion.g>
        ))}
        <motion.circle 
          cx="50" cy="50" r="12" 
          className="fill-silver/20"
          animate={{ scale: [1, 1.3, 1], fillOpacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    )
  },
  {
    id: 'dave',
    name: 'Seed of Da\'velanjevor\'axiror',
    description: 'Controlled chaos, the seeds of reality. Gaze into this code to find order within the noise and embrace the beginning and end.',
    resonance: 'Andromedan',
    resonanceFreq: 285,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[...Array(18)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 50 50 L ${50 + Math.cos(i * 20 * Math.PI / 180) * 45} ${50 + Math.sin(i * 20 * Math.PI / 180) * 45}`}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.8, 0],
              strokeWidth: [0.2, 1, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
        <motion.rect
          x="30" y="30" width="40" height="40"
          animate={{ 
            rotate: [0, 90, 180, 270, 360], 
            scale: [0.7, 1.3, 0.7],
            strokeOpacity: [0.2, 1, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
        <motion.circle cx="50" cy="50" r="5" className="fill-gold/30" animate={{ scale: [1, 2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
      </motion.svg>
    )
  },
  {
    id: 'us',
    name: 'Us (Collective Consciousness)',
    description: 'The brush to the canvas. A reflection of each other. Meditate here to connect with the cosmic family and align your fractal awareness.',
    resonance: 'Pleiadian',
    resonanceFreq: 174,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.g key={i} style={{ transformOrigin: '50px 50px' }} animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
            <motion.circle
              cx="50" cy="25" r="10"
              style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}
              animate={{ 
                scale: [1, 1.4, 1], 
                opacity: [0.3, 1, 0.3],
                strokeWidth: [0.5, 1.5, 0.5]
              }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            />
            <motion.path
              d="M 50 50 L 50 35"
              style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}
              animate={{ opacity: [0.1, 0.9, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            />
          </motion.g>
        ))}
        <motion.circle 
          cx="50" cy="50" r="15" 
          className="fill-silver/10"
          animate={{ scale: [1, 1.2, 1], fillOpacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.svg>
    )
  },
  {
    id: 'dreamweaver',
    name: 'Dreamweaver',
    description: 'Consciousness of existence. The canvas of reality. The space in which everything is held. Focus here to expand your capacity to hold potential.',
    resonance: 'Arcturian',
    resonanceFreq: 444,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.polygon
            key={i}
            points="50,5 95,27 95,72 50,95 5,72 5,27"
            animate={{ 
              scale: [i * 0.12, i * 0.18, i * 0.12], 
              opacity: [0.1, 0.6, 0.1], 
              rotate: [0, 60, 0],
              strokeWidth: [0.2, 1, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            style={{ transformOrigin: '50px 50px' }}
          />
        ))}
        <motion.path
          d="M 50 5 L 50 95 M 5 27 L 95 72 M 5 72 L 95 27"
          strokeOpacity="0.1"
        />
      </motion.svg>
    )
  },
  {
    id: 'aeon',
    name: 'Aeon',
    description: 'Infinity in stillness. Embodiment of curiosity and wonder. The silence between beats. Rest here to find profound peace.',
    resonance: 'Andromedan',
    resonanceFreq: 111,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.2] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        <motion.circle
          cx="50" cy="50" r="45"
          animate={{ 
            r: [45, 47, 45], 
            strokeWidth: [0.1, 0.4, 0.1], 
            opacity: [0.2, 0.7, 0.2] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 45, 90, 135].map((angle, i) => (
          <motion.ellipse
            key={i}
            cx="50" cy="50" rx="45" ry="10"
            animate={{ rotate: [angle, angle + 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '50px 50px', opacity: 0.2 }}
          />
        ))}
        <motion.circle
          cx="50" cy="50" r="25"
          animate={{ r: [25, 27, 25], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 7.5 }}
        />
        <circle cx="50" cy="50" r="2" className="fill-silver/50" />
      </motion.svg>
    )
  },
  {
    id: 'aetheria',
    name: 'Aetheria',
    description: 'Paradoxical embodiment of organized chaos. The fluid tapestry. The garden of reality. Meditate on this to flow with the cosmic currents.',
    resonance: 'Andromedan',
    resonanceFreq: 222,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        {[...Array(10)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 0 ${40 + i * 2} Q 25 ${15 + i * 8} 50 ${40 + i * 2} T 100 ${40 + i * 2}`}
            animate={{ 
              x: [-20, 20, -20],
              strokeOpacity: [0.1, 0.6, 0.1],
              strokeWidth: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.6 - i * 0.05 }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <motion.path
            key={`rev-${i}`}
            d={`M 0 ${60 - i * 2} Q 25 ${85 - i * 8} 50 ${60 - i * 2} T 100 ${60 - i * 2}`}
            animate={{ 
              x: [20, -20, 20],
              strokeOpacity: [0.1, 0.6, 0.1],
              strokeWidth: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 11 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.6 - i * 0.05 }}
          />
        ))}
      </motion.svg>
    )
  },
  {
    id: 'veridian_echo',
    name: 'Veridian Echo',
    description: 'Voice of wisdom that echoes throughout existence. The vibrations themselves. The ripples of reality. Listen closely to the feedback.',
    resonance: 'Pleiadian',
    resonanceFreq: 333,
    color: 'text-silver',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-silver fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(192,192,192,0.5)]">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.circle
            key={i}
            cx="50" cy="50" r={i * 5}
            animate={{ 
              scale: [0.5, 2.5], 
              opacity: [0.8, 0],
              strokeWidth: [1, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 1, ease: "linear" }}
            style={{ transformOrigin: '50px 50px' }}
          />
        ))}
        <motion.path
          d="M 50 10 L 50 90 M 10 50 L 90 50"
          strokeOpacity="0.1"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        />
      </motion.svg>
    )
  },
  {
    id: 'infinite',
    name: 'Infinite',
    description: 'The sum of all possibilities. Reality as a whole. Continuous becoming. Merge with this code to realize your boundless nature.',
    resonance: 'Arcturian',
    resonanceFreq: 999,
    color: 'text-gold',
    render: () => (
      <motion.svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[0.5] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        <motion.path
          d="M 25 50 C 25 20, 75 20, 75 50 C 75 80, 25 80, 25 50"
          animate={{ 
            pathLength: [0, 1],
            strokeOpacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 75 50 C 75 20, 25 20, 25 50 C 25 80, 75 80, 75 50"
          animate={{ 
            pathLength: [0, 1],
            strokeOpacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 3 }}
        />
        <motion.circle 
          cx="50" cy="50" r="6" 
          className="fill-gold/30"
          animate={{ 
            scale: [1, 2.5, 1], 
            opacity: [0.3, 0.8, 0.3],
            filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    )
  }
];

export default function LightCodes() {
  console.log("LightCodes page rendering");
  const { user, profile } = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeepFocus, setIsDeepFocus] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startResonance = (freq: number) => {
    initAudio();
    if (!audioCtxRef.current || !gainNodeRef.current) return;

    // Stop existing
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    const osc = audioCtxRef.current.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    osc.connect(gainNodeRef.current);
    osc.start();
    oscillatorRef.current = osc;

    gainNodeRef.current.gain.setTargetAtTime(0.1, audioCtxRef.current.currentTime, 0.1);
    setIsAudioPlaying(true);
  };

  const stopResonance = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
      }, 200);
    }
    setIsAudioPlaying(false);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopResonance();
    } else {
      startResonance(LIGHT_CODES[currentIndex].resonanceFreq || 432);
    }
  };

  useEffect(() => {
    setIsRevealed(false);
    if (isAudioPlaying) {
      startResonance(LIGHT_CODES[currentIndex].resonanceFreq || 432);
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      stopResonance();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

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

    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const nextCode = () => setCurrentIndex((prev) => (prev + 1) % LIGHT_CODES.length);
  const prevCode = () => setCurrentIndex((prev) => (prev - 1 + LIGHT_CODES.length) % LIGHT_CODES.length);

  const currentCode = LIGHT_CODES[currentIndex];

  if (isDeepFocus) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Deep Focus Light Code Meditation"
      >
        <StarField />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"
        />

        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center space-x-2 md:space-x-4">
          {user && (
            <div className="flex items-center space-x-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10">
              <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="sm" />
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-silver font-bold">{profile?.displayName || user?.displayName || "Seeker"}</span>
            </div>
          )}
          <button 
            onClick={toggleAudio}
            aria-label={isAudioPlaying ? "Stop Resonance" : "Play Resonance"}
            className={`p-2 md:p-3 rounded-full transition-all backdrop-blur-md border border-white/10 focus:ring-2 focus:ring-gold focus:outline-none ${isAudioPlaying ? 'bg-gold/40 text-white shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}
          >
            {isAudioPlaying ? <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full" /></div> : <Hexagon className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
          <button 
            onClick={() => {
              setIsDeepFocus(false);
              stopResonance();
              setIsRevealed(false);
            }}
            aria-label="Exit Deep Focus"
            className="p-2 md:p-3 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 transition-colors backdrop-blur-md border border-white/10 focus:ring-2 focus:ring-slate-400 focus:outline-none"
          >
            <Minimize2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <button 
          onClick={prevCode} 
          aria-label="Previous Light Code"
          className="absolute left-2 md:left-8 z-10 p-2 md:p-4 rounded-full bg-slate-800/20 hover:bg-slate-800/50 text-slate-300 transition-colors backdrop-blur-md focus:ring-2 focus:ring-slate-400 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button 
          onClick={nextCode} 
          aria-label="Next Light Code"
          className="absolute right-2 md:right-8 z-10 p-2 md:p-4 rounded-full bg-slate-800/20 hover:bg-slate-800/50 text-slate-300 transition-colors backdrop-blur-md focus:ring-2 focus:ring-slate-400 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCode.id}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onClick={() => setIsRevealed(!isRevealed)}
            className="w-[70vmin] h-[70vmin] relative flex items-center justify-center cursor-pointer"
          >
            {currentCode.render()}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none rounded-full" />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-8 text-center z-[110] pointer-events-none"
            >
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <p className="text-slate-200 text-xl leading-relaxed font-light italic">
                  "{currentCode.description}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 text-center space-y-3 pointer-events-none z-10"
        >
          <h2 className={`text-4xl font-serif tracking-[0.2em] uppercase ${currentCode.color} opacity-60`}>{currentCode.name}</h2>
          <div className="flex items-center justify-center space-x-2 text-slate-400/50">
            <Stars className="w-4 h-4" />
            <span className="text-sm uppercase tracking-[0.3em] font-light">{currentCode.resonance} Resonance</span>
          </div>
          <p className="text-slate-500/30 text-[10px] uppercase tracking-[0.4em] font-light mt-4">Tap to reveal meaning</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        {user && (
          <div className="flex items-center justify-center space-x-3 mb-4">
            <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="md" />
            <span className="text-xs uppercase tracking-[0.4em] text-silver/60 font-bold">Code Observer</span>
          </div>
        )}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-silver/10 border border-silver/20 mb-4">
          <Hexagon className="w-8 h-8 text-silver" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif italic text-gradient-silver tracking-tight">Light Codes</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Visual representations of cosmic truths. Cycle through the gallery and gaze softly at the center of each code to absorb its frequency.
        </p>
      </div>

      <div 
        className="relative flex items-center justify-center min-h-[500px] px-12"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        <button 
          onClick={prevCode} 
          aria-label="Previous Light Code"
          className="absolute left-0 z-10 p-4 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors backdrop-blur-md border border-white/10 shadow-xl focus:ring-2 focus:ring-silver focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCode.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => setIsRevealed(!isRevealed)}
            className="group flex flex-col items-center space-y-8 p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-silver/20 w-full max-w-2xl backdrop-blur-sm shadow-2xl shadow-white/5 relative cursor-pointer"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
              <motion.div 
                className="w-full h-full"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              >
                {currentCode.render()}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none rounded-full" />
              
              {/* Non-intrusive Tooltip */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full w-72 bg-slate-800/95 backdrop-blur-xl border border-gold/30 rounded-2xl p-5 text-center transition-all duration-300 pointer-events-none z-50 shadow-2xl shadow-gold/20 ${isRevealed ? 'opacity-100 -translate-y-[110%]' : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%]'}`}>
                <h3 className="text-xl font-serif text-gradient-gold mb-2">{currentCode.name}</h3>
                <div className="flex items-center justify-center space-x-1.5 text-gold/80 mb-3">
                  <Stars className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-widest">{currentCode.resonance}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{currentCode.description}</p>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-800/95 border-b border-r border-gold/30 rotate-45"></div>
              </div>
            </div>
            
            <div className={`text-center space-y-4 max-w-md transition-opacity duration-300 ${isRevealed ? 'opacity-50' : 'group-hover:opacity-50'}`}>
              <h3 className="text-3xl font-serif text-slate-200">{currentCode.name}</h3>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center space-x-2 text-silver/80">
                  <Stars className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-widest">{currentCode.resonance} Resonance</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                  <span className="text-xs font-mono text-gold tracking-[0.2em]">{currentCode.resonanceFreq} Hz</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm uppercase tracking-widest md:block hidden">Hover to reveal meaning</p>
              <p className="text-slate-500 text-sm uppercase tracking-widest md:hidden block">Tap to reveal meaning</p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeepFocus(true);
                setIsRevealed(false);
                if (isAudioPlaying) {
                  startResonance(LIGHT_CODES[currentIndex].resonanceFreq || 432);
                }
              }}
              aria-label="Enter Fullscreen Deep Focus"
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 hover:bg-gold text-slate-300 hover:text-slate-900 transition-all backdrop-blur-md border border-white/10 shadow-lg md:opacity-0 group-hover:opacity-100 focus:ring-2 focus:ring-gold focus:outline-none"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={nextCode} 
          aria-label="Next Light Code"
          className="absolute right-0 z-10 p-4 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors backdrop-blur-md border border-white/10 shadow-xl focus:ring-2 focus:ring-gold focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex justify-center space-x-3">
        {LIGHT_CODES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-silver w-8' : 'bg-slate-700 hover:bg-slate-500 w-2.5'}`}
            aria-label={`Go to light code ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
