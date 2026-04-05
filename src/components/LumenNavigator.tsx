import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, Sparkles, X, MessageSquare, Navigation, Zap, Moon, Sun, Book, Users, Eye, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from './UserAvatar';

const NAVIGATION_NODES = [
  { path: '/', label: 'The Garden (Home)', icon: <Sun className="w-4 h-4" />, description: 'The center of the Silver Bloom.' },
  { path: '/light-codes', label: 'Light Codes', icon: <Zap className="w-4 h-4" />, description: 'Sacred geometry and activations.' },
  { path: '/tarot', label: 'Divination (Veyth)', icon: <Moon className="w-4 h-4" />, description: 'Tarot, Oracle, and Runes.' },
  { path: '/starseeds', label: 'Starseeds (Astris)', icon: <Sparkles className="w-4 h-4" />, description: 'Discover your cosmic origins.' },
  { path: '/journal', label: 'Journal (Veridian Echo)', icon: <Book className="w-4 h-4" />, description: 'Anchor your desired timeline.' },
  { path: '/meditation', label: 'Meditation', icon: <Eye className="w-4 h-4" />, description: 'Deep focus and etheric breathing.' },
  { path: '/community', label: 'Community', icon: <Users className="w-4 h-4" />, description: 'Collective transmissions.' },
  { path: '/profile', label: 'Soul Blueprint', icon: <Navigation className="w-4 h-4" />, description: 'Your anchored identity.' },
];

export function LumenNavigator() {
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredNodes = NAVIGATION_NODES.filter(node => 
    node.label.toLowerCase().includes(search.toLowerCase()) ||
    node.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Lumen Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 p-1 rounded-full bg-slate-900/80 border border-silver/30 text-silver hover:text-white hover:border-silver/60 transition-all shadow-2xl shadow-white/10 backdrop-blur-md z-40 group"
        title="Ask Lumen (Ctrl+K)"
      >
        <div className="relative">
          <UserAvatar 
            photoURL={profile?.photoURL} 
            avatarIcon={profile?.avatarIcon} 
            size="md"
            className="border-none"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-silver rounded-full border-2 border-slate-900 flex items-center justify-center"
          >
            <Sparkles className="w-1.5 h-1.5 text-slate-900" />
          </motion.div>
        </div>
        <span className="absolute left-full ml-4 px-3 py-1 bg-slate-900 border border-silver/20 rounded-lg text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Lumen
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900/90 border border-silver/30 rounded-[2.5rem] shadow-2xl shadow-white/20 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-silver/10">
                  <Sparkles className="w-6 h-6 text-silver" />
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Where shall we navigate, seeker?"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-silver/30 transition-all"
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <div className="px-4 mb-4">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Lumen's Whispers</h3>
                </div>
                
                {filteredNodes.length > 0 ? (
                  <>
                    {filteredNodes.map((node) => (
                      <button
                        key={node.path}
                        onClick={() => {
                          navigate(node.path);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group text-left"
                      >
                        <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-silver/10 group-hover:text-silver transition-all">
                          {node.icon}
                        </div>
                        <div>
                          <h4 className="text-slate-200 font-medium group-hover:text-white transition-colors">{node.label}</h4>
                          <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{node.description}</p>
                        </div>
                      </button>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          // We need a way to trigger the tutorial from here.
                          // Since App.tsx handles the state, maybe we can use a custom event or just rely on the navbar icon.
                          // Actually, I'll just add the help icon to the navigator footer or header.
                          window.dispatchEvent(new CustomEvent('open-lumen-help'));
                        }}
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-silver/5 border border-silver/10 hover:bg-silver/10 transition-all group text-left"
                      >
                        <div className="p-3 rounded-xl bg-silver/10 text-silver">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-silver font-medium">Need Guidance?</h4>
                          <p className="text-xs text-slate-500">Let Lumen explain the mysteries of this realm.</p>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Compass className="w-12 h-12 mx-auto text-slate-700 animate-pulse" />
                    <p className="text-slate-500 italic">Lumen cannot find that path in the current etheric state.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950/50 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">ESC</kbd>
                    <span>to close</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">↵</kbd>
                    <span>to select</span>
                  </span>
                </div>
                <span className="italic">Lumen is the key</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
