import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Save, LogOut, Sparkles, Stars, Sun, Moon, Compass, Heart, Activity, ChevronDown, Check } from 'lucide-react';
import { auth, db, signIn, logOut } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { CosmicSelect } from '../components/ui/CosmicSelect';
import { useProfile, UserProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';
import { AVATAR_ICONS } from '../lib/cosmic-icons';

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const STARSEED_ORIGINS = [
  "Pleiadian", "Sirian", "Arcturian", "Andromedan", "Lyran", "Orion", "Venusian", 
  "Draconian", "Centaurian", "Cassiopeian", "Lunar Weaver", "Reptilian", "Anunnaki", 
  "Mantid", "Feline", "None / Earth Native"
];

function BlueprintStat({ label, value, icon, color = 'silver' }: { label: string; value: string | number; icon: React.ReactNode; color?: 'silver' | 'gold' }) {
  return (
    <div className="space-y-3 group/stat">
      <div className={`flex items-center space-x-2 text-slate-500 group-hover/stat:${color === 'silver' ? 'text-silver' : 'text-gold'} transition-colors`}>
        {icon}
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold">{label}</p>
      </div>
      <p className={`text-2xl font-serif italic ${color === 'silver' ? 'text-gradient-silver' : 'text-gradient-gold'} group-hover/stat:brightness-110 transition-colors truncate`}>
        {value}
      </p>
    </div>
  );
}

export default function Profile() {
  const { user, profile: initialProfile, loading: initialLoading } = useProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setLoading(false);
    } else if (!initialLoading) {
      setLoading(false);
    }
  }, [initialProfile, initialLoading]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date().toISOString()
      });
      setMessage("Profile anchored successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      setMessage("Failed to anchor profile. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-silver/20 border-t-gold rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-24">
        <User className="w-16 h-16 mx-auto text-silver" />
        <h1 className="text-4xl font-serif text-gradient-silver italic">Identify Your Essence</h1>
        <p className="text-slate-400 font-light">
          To customize your cosmic profile and anchor your timeline, please connect your consciousness.
        </p>
        <button 
          onClick={signIn}
          className="px-8 py-4 bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 rounded-full font-medium transition-all shadow-lg shadow-white/20 hover:brightness-110"
        >
          Connect with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Cosmic Passport Header */}
      <div className="relative p-8 md:p-12 rounded-[3rem] glass-morphism overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Stars className="w-64 h-64 text-silver" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative">
            <UserAvatar 
              photoURL={profile?.photoURL} 
              avatarIcon={profile?.avatarIcon} 
              size="xl"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-4xl font-serif text-gradient-silver italic">{profile?.displayName}</h1>
              <div className="px-3 py-1 rounded-full bg-silver/10 border border-silver/20 text-[10px] uppercase tracking-widest text-silver inline-block self-center md:self-auto">
                {profile?.starseed}
              </div>
            </div>
            <p className="text-slate-400 font-light italic">"{profile?.cosmicMantra || 'Seeking the Silver Bloom...'}"</p>
          </div>

          <button 
            onClick={logOut}
            className="px-6 py-2 rounded-full border border-red-500/30 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs uppercase tracking-widest font-bold"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avatar & Identity */}
        <section className="p-8 rounded-[2.5rem] glass-morphism space-y-8">
          <h2 className="text-xl font-serif text-gradient-silver flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-silver" />
            <span>Cosmic Identity</span>
          </h2>
          
          <div className="space-y-4">
            <label className="block text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Avatar Essence</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_ICONS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setProfile({ ...profile, avatarIcon: item.name })}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${
                    profile?.avatarIcon === item.name 
                    ? "bg-silver/20 border-silver text-silver shadow-lg shadow-silver/10 scale-105" 
                    : "bg-slate-900/50 border-white/5 text-slate-600 hover:border-white/20 hover:text-slate-400"
                  }`}
                  title={item.name}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-slate-400 uppercase tracking-widest">Starseed Origin</label>
            <CosmicSelect 
              value={profile?.starseed || "None / Earth Native"}
              onChange={(val) => setProfile({ ...profile, starseed: val })}
              options={STARSEED_ORIGINS}
              color="silver"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm text-slate-400 uppercase tracking-widest">Cosmic Mantra</label>
            <textarea 
              value={profile?.cosmicMantra || ""}
              onChange={(e) => setProfile({ ...profile, cosmicMantra: e.target.value })}
              placeholder="Your authentic expression..."
              className="w-full p-4 bg-slate-900/50 border border-silver/20 rounded-2xl text-slate-200 focus:ring-2 focus:ring-silver outline-none resize-none h-24"
            />
          </div>
        </section>

        {/* Astrology */}
        <section className="p-8 rounded-[2.5rem] glass-morphism space-y-8">
          <h2 className="text-xl font-serif text-gradient-gold flex items-center space-x-3">
            <Stars className="w-5 h-5 text-gold" />
            <span>Astrological Blueprint</span>
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Sun Sign</label>
              <CosmicSelect 
                value={profile?.sunSign || ""}
                onChange={(val) => setProfile({ ...profile, sunSign: val })}
                options={SIGNS}
                placeholder="Select Sign"
                color="gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Moon Sign</label>
              <CosmicSelect 
                value={profile?.moonSign || ""}
                onChange={(val) => setProfile({ ...profile, moonSign: val })}
                options={SIGNS}
                placeholder="Select Sign"
                color="gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Rising Sign</label>
              <CosmicSelect 
                value={profile?.risingSign || ""}
                onChange={(val) => setProfile({ ...profile, risingSign: val })}
                options={SIGNS}
                placeholder="Select Sign"
                color="gold"
              />
            </div>
          </div>
        </section>

        {/* Numerology */}
        <section className="space-y-6">
          <h2 className="text-xl font-serif text-gradient-silver flex items-center space-x-2">
            <Activity className="w-5 h-5 text-silver" />
            <span>Vibrational Numbers</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">Soul Urge</label>
              <input 
                type="number" 
                min="1" max="99"
                value={profile?.soulUrge ?? 1}
                onChange={(e) => setProfile({ ...profile, soulUrge: parseInt(e.target.value) || 1 })}
                className="w-full p-3 bg-slate-900/50 border border-silver/20 rounded-xl text-slate-200 focus:ring-2 focus:ring-silver outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-widest">Life Path</label>
              <input 
                type="number" 
                min="1" max="99"
                value={profile?.lifePath ?? 1}
                onChange={(e) => setProfile({ ...profile, lifePath: parseInt(e.target.value) || 1 })}
                className="w-full p-3 bg-slate-900/50 border border-silver/20 rounded-xl text-slate-200 focus:ring-2 focus:ring-silver outline-none"
              />
            </div>
          </div>
        </section>

        {/* Soul Mission */}
        <section className="space-y-6">
          <h2 className="text-xl font-serif text-gradient-gold flex items-center space-x-2">
            <Compass className="w-5 h-5 text-gold" />
            <span>Soul Mission</span>
          </h2>

          <div className="space-y-4">
            <label className="block text-sm text-slate-400 uppercase tracking-widest">Your Cosmic Purpose</label>
            <textarea 
              value={profile?.soulMission || ""}
              onChange={(e) => setProfile({ ...profile, soulMission: e.target.value })}
              placeholder="What did you come here to anchor? What is your mission in the Era of the Silver Bloom?"
              className="w-full p-4 bg-slate-900/50 border border-gold/20 rounded-2xl text-slate-200 focus:ring-2 focus:ring-gold outline-none resize-none h-32"
            />
          </div>
        </section>

        {/* Energy Blueprint */}
        <section className="space-y-6 md:col-span-2">
          <h2 className="text-xl font-serif text-gradient-silver flex items-center space-x-2">
            <Activity className="w-5 h-5 text-silver" />
            <span>Energy Blueprint</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-slate-900/40 border border-silver/10 rounded-3xl">
            {[
              { key: 'intuition', label: 'Intuition (Veridian Echo)' },
              { key: 'grounding', label: 'Grounding (Terra)' },
              { key: 'empathy', label: 'Empathy (Cosmic Family)' },
              { key: 'manifestation', label: 'Manifestation (Aevum)' },
              { key: 'cosmicConnection', label: 'Cosmic Connection (Nexus)' }
            ].map((stat) => (
              <div key={stat.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-400 uppercase tracking-widest">{stat.label}</label>
                  <span className="text-xs text-silver font-mono">{profile?.energyBlueprint?.[stat.key] || 50}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100"
                  value={profile?.energyBlueprint?.[stat.key] || 50}
                  onChange={(e) => setProfile({
                    ...profile,
                    energyBlueprint: {
                      ...profile?.energyBlueprint,
                      [stat.key]: parseInt(e.target.value)
                    }
                  })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-silver"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Whisper Settings */}
        <section className="space-y-6 md:col-span-2">
          <h2 className="text-xl font-serif text-gradient-silver flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-silver" />
            <span>Lore's Whisper Frequency</span>
          </h2>
          <div className="p-6 bg-slate-900/40 border border-silver/10 rounded-3xl space-y-4">
            <label className="text-xs text-slate-400 uppercase tracking-widest">Adjust Whisper Interval (seconds)</label>
            <input 
              type="range" 
              min="5" max="60"
              value={parseInt(localStorage.getItem('whisperFrequency') || '15000', 10) / 1000}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) * 1000;
                localStorage.setItem('whisperFrequency', val.toString());
                window.dispatchEvent(new Event('storage'));
                // Force re-render for this local state if needed, but storage event handles it for the component
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-silver"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>5s</span>
              <span>{parseInt(localStorage.getItem('whisperFrequency') || '15000', 10) / 1000}s</span>
              <span>60s</span>
            </div>
          </div>
        </section>

        {/* Cosmic Stats / Summary */}
        <section className="md:col-span-2 relative p-12 bg-slate-900/60 border border-gold/20 rounded-[3rem] overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Sparkles className="w-64 h-64 text-gold" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gold/10">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h2 className="text-3xl font-serif text-gradient-gold italic">Soul Blueprint</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Current Frequency Alignment</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
              <BlueprintStat 
                label="Frequency" 
                value={profile?.starseed} 
                icon={<Stars className="w-4 h-4 text-silver" />}
                color="silver"
              />
              <BlueprintStat 
                label="Sun/Moon" 
                value={`${profile?.sunSign || '?'}/${profile?.moonSign || '?'}`} 
                icon={<Sun className="w-4 h-4 text-gold" />}
                color="gold"
              />
              <BlueprintStat 
                label="Life Path" 
                value={profile?.lifePath || '?'} 
                icon={<Activity className="w-4 h-4 text-silver" />}
                color="silver"
              />
              <BlueprintStat 
                label="Soul Urge" 
                value={profile?.soulUrge || '?'} 
                icon={<Heart className="w-4 h-4 text-gold" />}
                color="gold"
              />
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Timeline Anchored</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-600 text-gradient-silver">Era of the Silver Bloom</span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center space-y-4 pt-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 hover:brightness-110 disabled:opacity-50 rounded-full font-medium transition-all shadow-xl shadow-gold/20"
        >
          {saving ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full"
            />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>Anchor Profile</span>
        </button>
        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-indigo-400 italic font-light"
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
}
