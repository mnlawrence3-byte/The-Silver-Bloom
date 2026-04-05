/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Moon, Sun, Stars, Radio, BookOpen, Hexagon, Menu, X, User, MessageSquare, Book, HelpCircle, Zap, Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Tarot = React.lazy(() => import('./pages/Tarot'));
const Meditation = React.lazy(() => import('./pages/Meditation'));
const CosmicTruth = React.lazy(() => import('./pages/CosmicTruth'));
const LightCodes = React.lazy(() => import('./pages/LightCodes'));
const Starseeds = React.lazy(() => import('./pages/Starseeds'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Community = React.lazy(() => import('./pages/Community'));
const Journal = React.lazy(() => import('./pages/Journal'));
const Quizzes = React.lazy(() => import('./pages/Quizzes'));
const ManifestationChamber = React.lazy(() => import('./pages/ManifestationChamber'));

import { Tooltip } from './components/Tooltip';
import { AnimatePresence } from 'motion/react';

import { CosmicFamilyPresence } from './components/CosmicFamilyPresence';
import { LumenNavigator } from './components/LumenNavigator';
import { LumenTutorial } from './components/LumenTutorial';
import { TheiaEtherState } from './components/TheiaEtherState';
import { GroundingPulse, LoreWhispers } from './components/CosmicGifts';
import { useProfile } from './hooks/useProfile';
import { UserAvatar } from './components/UserAvatar';

export default function App() {
  console.log("App component rendering");
  const { user, profile } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isStillnessMode, setIsStillnessMode] = React.useState(false);
  const [isInfiniteMode, setIsInfiniteMode] = React.useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenHelp = () => setIsTutorialOpen(true);
    window.addEventListener('open-lumen-help', handleOpenHelp);
    return () => window.removeEventListener('open-lumen-help', handleOpenHelp);
  }, []);

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-gold-500/30 transition-all duration-1000 ${isStillnessMode ? 'grayscale-[0.8] brightness-[0.8]' : ''} ${isInfiniteMode ? 'hue-rotate-30 saturate-150' : ''}`}>
        {/* Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-900/10 blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-silver-900/10 blur-[100px]" />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[80px]" />
          
          {/* Infinite Mode Fractal Overlay */}
          <AnimatePresence>
            {isInfiniteMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"
              />
            )}
          </AnimatePresence>
        </div>

        <CosmicFamilyPresence />
        <LumenNavigator />
        <LumenTutorial forceOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
        <TheiaEtherState />
        <GroundingPulse />
        <LoreWhispers />

        {/* Navigation */}
        <nav className={`sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl transition-all duration-500 ${isStillnessMode ? 'opacity-20 hover:opacity-100' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-2 group">
                <Tooltip text="Home">
                  <Sparkles className="w-5 h-5 text-gold-400 group-hover:text-gold-300 transition-colors" />
                </Tooltip>
                <span className="font-serif italic text-xl tracking-wide text-gradient-silver group-hover:text-gradient-gold transition-all duration-500">
                  The Silver Bloom
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/tarot" icon={<Moon className="w-4 h-4" />} text="Divination" color="silver" />
                <NavLink to="/meditation" icon={<Radio className="w-4 h-4" />} text="Frequencies" color="gold" />
                <NavLink to="/manifest" icon={<Zap className="w-4 h-4" />} text="Manifest" color="silver" />
                <NavLink to="/light-codes" icon={<Hexagon className="w-4 h-4" />} text="Light Codes" color="gold" />
                <NavLink to="/truth" icon={<BookOpen className="w-4 h-4" />} text="Cosmic Truth" color="silver" />
                <NavLink to="/starseeds" icon={<Stars className="w-4 h-4" />} text="Starseeds" color="gold" />
                <NavLink to="/community" icon={<MessageSquare className="w-4 h-4" />} text="Collective" color="silver" />
                <NavLink to="/journal" icon={<Book className="w-4 h-4" />} text="Journal" color="gold" />
                <NavLink to="/quizzes" icon={<HelpCircle className="w-4 h-4" />} text="Inquiries" color="silver" />
                
                <Link to="/profile" className="flex items-center space-x-3 group/profile pl-4 border-l border-white/10">
                  <div className="relative">
                    <UserAvatar 
                      photoURL={profile?.photoURL} 
                      avatarIcon={profile?.avatarIcon} 
                      size="md"
                      className="group-hover/profile:border-gold/50 transition-all duration-300"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-1 rounded-full bg-gold-500/10 blur-[4px] -z-10"
                    />
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-sm font-serif italic text-slate-300 group-hover/profile:text-gold transition-colors">
                      {profile?.displayName || 'Seeker'}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {profile?.starseed || 'Earth Native'}
                    </span>
                  </div>
                </Link>
                
                <div className="h-4 w-px bg-white/10 mx-2" />
                
                <Tooltip text={isStillnessMode ? "Exit Stillness" : "Aeon's Stillness"}>
                  <button
                    onClick={() => setIsStillnessMode(!isStillnessMode)}
                    className={`p-2 rounded-lg transition-all ${isStillnessMode ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <Moon className={`w-4 h-4 ${isStillnessMode ? 'fill-indigo-400' : ''}`} />
                  </button>
                </Tooltip>

                <Tooltip text={isInfiniteMode ? "Exit Infinite" : "Infinite Mode"}>
                  <button
                    onClick={() => setIsInfiniteMode(!isInfiniteMode)}
                    className={`p-2 rounded-lg transition-all ${isInfiniteMode ? 'bg-gold-500/20 text-gold-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <Zap className={`w-4 h-4 ${isInfiniteMode ? 'fill-gold-400' : ''}`} />
                  </button>
                </Tooltip>

                <Tooltip text="Lumen's Help">
                  <button
                    onClick={() => setIsTutorialOpen(true)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl"
              >
                <div className="px-4 pt-2 pb-6 space-y-1">
                  <MobileNavLink to="/tarot" icon={<Moon className="w-4 h-4" />} text="Divination" onClick={() => setIsMenuOpen(false)} color="silver" />
                  <MobileNavLink to="/meditation" icon={<Radio className="w-4 h-4" />} text="Frequencies" onClick={() => setIsMenuOpen(false)} color="gold" />
                  <MobileNavLink to="/light-codes" icon={<Hexagon className="w-4 h-4" />} text="Light Codes" onClick={() => setIsMenuOpen(false)} color="silver" />
                  <MobileNavLink to="/truth" icon={<BookOpen className="w-4 h-4" />} text="Cosmic Truth" onClick={() => setIsMenuOpen(false)} color="gold" />
                  <MobileNavLink to="/starseeds" icon={<Stars className="w-4 h-4" />} text="Starseeds" onClick={() => setIsMenuOpen(false)} color="silver" />
                  <MobileNavLink to="/community" icon={<MessageSquare className="w-4 h-4" />} text="Collective" onClick={() => setIsMenuOpen(false)} color="gold" />
                  <MobileNavLink to="/journal" icon={<Book className="w-4 h-4" />} text="Journal" onClick={() => setIsMenuOpen(false)} color="silver" />
                  <MobileNavLink to="/quizzes" icon={<HelpCircle className="w-4 h-4" />} text="Inquiries" onClick={() => setIsMenuOpen(false)} color="gold" />
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsTutorialOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium text-slate-400 hover:text-silver-300 hover:bg-silver-900/10 transition-all"
                  >
                    <span className="text-silver-400"><HelpCircle className="w-4 h-4" /></span>
                    <span>Lumen's Help</span>
                  </button>

                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 mt-4"
                  >
                    <UserAvatar 
                      photoURL={profile?.photoURL} 
                      avatarIcon={profile?.avatarIcon} 
                      size="md"
                    />
                    <div>
                      <h4 className="text-slate-200 font-serif italic">{profile?.displayName || 'Seeker'}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">{profile?.starseed || 'Earth Native'}</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 md:pb-12">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <Loader2 className="w-8 h-8 text-silver animate-spin" />
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Channeling Ether...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tarot" element={<Tarot />} />
              <Route path="/meditation" element={<Meditation />} />
              <Route path="/light-codes" element={<LightCodes />} />
              <Route path="/truth" element={<CosmicTruth />} />
              <Route path="/starseeds" element={<Starseeds />} />
              <Route path="/community" element={<Community />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manifest" element={<ManifestationChamber />} />
            </Routes>
          </Suspense>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around p-2 shadow-2xl pointer-events-auto">
            <BottomNavLink to="/" icon={<Sparkles className="w-5 h-5" />} text="Home" />
            <BottomNavLink to="/tarot" icon={<Moon className="w-5 h-5" />} text="Oracle" />
            <BottomNavLink to="/community" icon={<MessageSquare className="w-5 h-5" />} text="Collective" />
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center space-y-1 p-2 rounded-xl group"
            >
              <UserAvatar 
                photoURL={profile?.photoURL} 
                avatarIcon={profile?.avatarIcon} 
                size="sm"
                className="group-active:scale-90 transition-transform"
              />
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-gold transition-colors">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

function BottomNavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center space-y-1 p-2 rounded-xl text-slate-400 hover:text-gold transition-all active:scale-95"
    >
      {icon}
      <span className="text-[9px] uppercase tracking-widest font-bold">{text}</span>
    </Link>
  );
}

function NavLink({ to, icon, text, color }: { to: string; icon: React.ReactNode; text: string; color: 'silver' | 'gold' }) {
  return (
    <Link
      to={to}
      onClick={() => console.log(`Navigating to ${to}`)}
      className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 ${
        color === 'gold' 
          ? 'text-slate-400 hover:text-gold-300' 
          : 'text-slate-400 hover:text-silver-300'
      }`}
    >
      <Tooltip text={text}>
        <span className={color === 'gold' ? 'text-gold-500/60' : 'text-silver-500/60'}>
          {icon}
        </span>
      </Tooltip>
      <span>{text}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, text, onClick, color }: { to: string; icon: React.ReactNode; text: string; onClick: () => void; color: 'silver' | 'gold' }) {
  return (
    <Link
      to={to}
      onClick={() => {
        console.log(`Mobile Navigating to ${to}`);
        onClick();
      }}
      className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all ${
        color === 'gold'
          ? 'text-slate-400 hover:text-gold-300 hover:bg-gold-900/10'
          : 'text-slate-400 hover:text-silver-300 hover:bg-silver-900/10'
      }`}
    >
      <span className={color === 'gold' ? 'text-gold-400' : 'text-silver-400'}>{icon}</span>
      <span>{text}</span>
    </Link>
  );
}
