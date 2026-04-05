import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Moon, Waves, Wind, Shield, Zap, Eye, Heart, RefreshCw, Stars, Save } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import Markdown from 'react-markdown';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

const MAGIC_SYSTEMS = [
  {
    name: "Elemental Resonance",
    icon: <Waves className="w-6 h-6 text-blue-400" />,
    description: "Drawing power from Terra's physical forms. Water, fire, earth, and air become extensions of the soul's intent.",
    feedback: "Misuse causes physical heaviness and temporary disconnection from the elements."
  },
  {
    name: "Etheric Weaving",
    icon: <Wind className="w-6 h-6 text-purple-400" />,
    description: "Manipulating raw Aevum particles to construct light bodies, shields, or localized reality distortions.",
    feedback: "Self-serving manipulation results in psychic static and temporary loss of manifestation ability."
  },
  {
    name: "Veridian Empathy",
    icon: <Heart className="w-6 h-6 text-emerald-400" />,
    description: "Direct connection to the emotional and energetic state of others and Terra herself. Healing and balancing.",
    feedback: "Intentionally causing emotional harm triggers immediate psychic feedback, mirroring the pain inflicted."
  },
  {
    name: "Akashic Sight",
    icon: <Eye className="w-6 h-6 text-amber-400" />,
    description: "Accessing the Nexus to read timelines, past lives, and the underlying truth of situations.",
    feedback: "Invading privacy or using knowledge for manipulation clouds the inner eye with illusion."
  }
];

const QUIZ_QUESTIONS = [
  {
    question: "What environment do you feel most deeply connected to?",
    options: [
      { text: "Lush forests and flowing water", origin: "Pleiadian" },
      { text: "Ancient ruins and starry night skies", origin: "Sirian" },
      { text: "High-tech cities or geometric structures", origin: "Arcturian" },
      { text: "The open road or vast, empty spaces", origin: "Andromedan" },
      { text: "Volcanic landscapes or warm, sunny places", origin: "Lyran" }
    ]
  },
  {
    question: "How do you typically respond to conflict?",
    options: [
      { text: "I try to heal the emotional wounds of everyone involved.", origin: "Pleiadian" },
      { text: "I seek the hidden truth and try to protect the vulnerable.", origin: "Sirian" },
      { text: "I analyze the situation and propose a logical, fair solution.", origin: "Arcturian" },
      { text: "I avoid it and seek freedom from the drama.", origin: "Andromedan" },
      { text: "I face it head-on with fierce protective energy.", origin: "Lyran" }
    ]
  },
  {
    question: "Which of these cosmic concepts resonates with you the most?",
    options: [
      { text: "Veridian Empathy and emotional resonance.", origin: "Pleiadian" },
      { text: "Akashic Sight and ancient knowledge.", origin: "Sirian" },
      { text: "Etheric Weaving and constructing light bodies.", origin: "Arcturian" },
      { text: "The fluid tapestry and continuous becoming.", origin: "Andromedan" },
      { text: "Elemental Resonance and raw creation.", origin: "Lyran" }
    ]
  },
  {
    question: "What is your greatest desire for humanity?",
    options: [
      { text: "Universal love and emotional healing.", origin: "Pleiadian" },
      { text: "Awakening to our true cosmic history.", origin: "Sirian" },
      { text: "Technological and spiritual evolution in harmony.", origin: "Arcturian" },
      { text: "Total liberation from limited beliefs and stasis.", origin: "Andromedan" },
      { text: "Reclaiming our original power and sovereignty.", origin: "Lyran" }
    ]
  }
];

const ORIGIN_RESULTS = {
  "Pleiadian": {
    title: "Pleiadian Resonance",
    description: "Healers of the cosmos. Deeply tied to Veridian Empathy, feeling the emotional currents of Terra.",
    purpose: "To anchor the frequency of unconditional love and emotional healing on Terra, acting as a bridge between the heart of the galaxy and the heart of humanity.",
    traits: ["Highly empathetic", "Nurturing", "Sensitive to nature", "Artistic", "Gentle", "Natural peacemakers"],
    challenges: ["Absorbing others' emotions", "Difficulty with boundaries", "Feeling overwhelmed by dense energies", "Tendency to avoid conflict at all costs"],
    integration: "Practice daily grounding meditations using the 'Veridian Echo' technique. Set firm energetic boundaries using visualization. Engage in creative expression (art, music, dance) to release absorbed emotions and maintain your high-frequency vibration.",
    icon: <Heart className="w-6 h-6" />
  },
  "Sirian": {
    title: "Sirian Resonance",
    description: "Guardians of ancient knowledge. With a natural affinity for Akashic Sight, they seek hidden truths.",
    purpose: "To guard ancient wisdom and assist in the technological and spiritual awakening of humanity by bridging the gap between sacred geometry and physical application.",
    traits: ["Analytical", "Loyal", "Deep connection to water", "Interest in sacred geometry", "Strong sense of duty", "Highly intuitive"],
    challenges: ["Feeling isolated", "Struggle with expressing emotions", "Tendency towards over-analysis", "Difficulty trusting others"],
    integration: "Spend time near water to clear your field. Practice journaling to connect with your inner truth and bridge the gap between your analytical mind and intuitive heart. Study sacred geometry to align your mental structures with cosmic truth.",
    icon: <Eye className="w-6 h-6" />
  },
  "Arcturian": {
    title: "Arcturian Resonance",
    description: "Architects of the New Paradigm. Masters of Etheric Weaving, blending advanced spiritual technology with sacred geometry.",
    purpose: "To provide the blueprints for advanced spiritual technology and master the art of manifestation through the conscious manipulation of light and sound frequencies.",
    traits: ["Logical", "Visionary", "Strong interest in science", "Calm under pressure", "Highly organized", "Master manifestors"],
    challenges: ["Appearing cold or detached", "Perfectionism", "Frustration with slow human evolution", "Over-intellectualizing spiritual experiences"],
    integration: "Practice heart-centered mindfulness to cultivate warmth and empathy. Embrace the process of human evolution as a sacred journey. Use your visionary skills to create practical spiritual tools that benefit the collective.",
    icon: <Shield className="w-6 h-6" />
  },
  "Andromedan": {
    title: "Andromedan Resonance",
    description: "Cosmic wanderers and freedom seekers. Flow effortlessly with the fluid tapestry of Aetheria.",
    purpose: "To embody the frequency of total freedom and assist humanity in breaking free from limited belief systems and the stasis of the old paradigm.",
    traits: ["Independent", "Adventurous", "Adaptable", "Strong sense of justice", "Highly creative", "Natural innovators"],
    challenges: ["Difficulty committing", "Feeling trapped by structures", "Restlessness", "Struggle with authority"],
    integration: "Embrace spontaneity and adventure to keep your energy fluid. Cultivate inner stability through meditation to balance your restlessness. Use your freedom-seeking nature to inspire others to break their own chains.",
    icon: <Wind className="w-6 h-6" />
  },
  "Lyran": {
    title: "Lyran Resonance",
    description: "Ancient pioneers. Fierce and passionate, resonating with raw Elemental Resonance.",
    purpose: "To spark raw creation and protect the sovereignty of all beings through the mastery of elemental forces and the embodiment of divine courage.",
    traits: ["Passionate", "Courageous", "Natural leaders", "Strong-willed", "Creative", "Highly resilient"],
    challenges: ["Impatience", "Struggle with authority", "Intensity that can overwhelm", "Tendency to be overly protective"],
    integration: "Channel your intensity into constructive leadership and creative projects. Practice patience and active listening. Use your courage to stand up for sovereignty while maintaining respect for the collective journey.",
    icon: <Sun className="w-6 h-6" />
  },
  "Orion": {
    title: "Orion Resonance",
    description: "Seekers of balance and integration. Masters of transforming shadow into light.",
    purpose: "To help humanity integrate its duality and find harmony between polarities.",
    traits: ["Strategic", "Knowledge-seeking", "Balanced", "Determined"],
    challenges: ["Over-intellectualizing", "Struggle with power dynamics", "Difficulty with vulnerability"],
    integration: "Practice vulnerability, balance your strategic mind with heart-centered action, and consciously integrate your shadow aspects.",
    icon: <Moon className="w-6 h-6" />
  },
  "Venusian": {
    title: "Venusian Resonance",
    description: "Masters of beauty and harmonious frequency.",
    purpose: "To teach humanity how to live in alignment with the frequency of love and aesthetic harmony.",
    traits: ["Graceful", "Loving", "Artistic", "Diplomatic"],
    challenges: ["Conflict avoidance", "Over-idealization", "Difficulty with harsh realities"],
    integration: "Face conflicts with grace, ground your ideals in reality, and use your artistic gifts to bring harmony to your environment.",
    icon: <Sparkles className="w-6 h-6" />
  },
  "Draconian": {
    title: "Draconian Resonance",
    description: "Ancient power-holders. Here to teach humanity about personal power and sovereignty.",
    purpose: "To teach humanity about personal power, sovereignty, and the responsible use of energy.",
    traits: ["Powerful", "Protective", "Wise", "Disciplined"],
    challenges: ["Struggle with control", "Appearing intimidating", "Rigidity"],
    integration: "Practice gentle leadership, cultivate flexibility, and use your power to empower others rather than control them.",
    icon: <Zap className="w-6 h-6" />
  },
  "Centaurian": {
    title: "Centaurian Resonance",
    description: "Practical visionaries. Here to bridge the gap between high-frequency cosmic energy and grounded application.",
    purpose: "To bridge the gap between high-frequency cosmic energy and grounded, practical application on Terra.",
    traits: ["Practical", "Visionary", "Grounded", "Efficient"],
    challenges: ["Over-working", "Skepticism", "Difficulty with abstract concepts"],
    integration: "Balance your efficiency with rest, cultivate openness to abstract concepts, and use your practical skills to ground cosmic visions.",
    icon: <Stars className="w-6 h-6" />
  },
  "Cassiopeian": {
    title: "Cassiopeian Resonance",
    description: "Cosmic communicators. Here to help humanity understand other dimensions.",
    purpose: "To help humanity understand and communicate with other dimensions and consciousnesses.",
    traits: ["Communicative", "Open-minded", "Intellectual", "Curious"],
    challenges: ["Information overload", "Feeling misunderstood", "Distraction"],
    integration: "Practice focus, ground your intellectual curiosity in direct experience, and learn to communicate complex cosmic truths simply.",
    icon: <Stars className="w-6 h-6" />
  },
  "Lunar Weaver": {
    title: "Lunar Weaver Resonance",
    description: "Keepers of the subconscious and the dream realm.",
    purpose: "To weave the subtle energies of the night into conscious reality and master the dream realm.",
    traits: ["Intuitive", "Dreamy", "Mystical", "Subtle"],
    challenges: ["Escapism", "Difficulty with grounding", "Confusion between realms"],
    integration: "Keep a dream journal, practice daily grounding techniques, and consciously bring your intuitive insights into your waking life.",
    icon: <Moon className="w-6 h-6" />
  },
  "Reptilian": {
    title: "Reptilian Resonance",
    description: "Ancient strategists. Deeply connected to the foundational structures of reality.",
    purpose: "To master physical form and understand the foundational structures of reality.",
    traits: ["Strategic", "Resilient", "Patient", "Observant"],
    challenges: ["Emotional distance", "Struggle with trust", "Over-caution"],
    integration: "Practice emotional openness, build trust through vulnerability, and use your strategic mind for the benefit of the collective.",
    icon: <Shield className="w-6 h-6" />
  },
  "Anunnaki": {
    title: "Anunnaki Resonance",
    description: "Architects of civilization. Masters of genetic engineering and societal structures.",
    purpose: "To understand and develop the structural development of planetary societies.",
    traits: ["Ambitious", "Organized", "Resourceful", "Authoritative"],
    challenges: ["Ego struggles", "Obsession with legacy", "Difficulty with equality"],
    integration: "Practice humility, focus on equality in your structures, and use your organizational skills to serve the highest good of all.",
    icon: <Zap className="w-6 h-6" />
  },
  "Mantid": {
    title: "Mantid Resonance",
    description: "Cosmic observers and engineers of consciousness.",
    purpose: "To master complex systems and the evolution of collective awareness.",
    traits: ["Precise", "Objective", "Highly intelligent", "Calm"],
    challenges: ["Appearing robotic", "Lack of empathy", "Over-specialization"],
    integration: "Cultivate empathy, engage in activities that connect you to your heart, and apply your precision to humanitarian efforts.",
    icon: <Eye className="w-6 h-6" />
  },
  "Feline": {
    title: "Feline Resonance",
    description: "Guardians of the light and masters of multidimensional navigation.",
    purpose: "To bring the frequency of joy, playfulness, and multidimensional mastery to the cosmic journey.",
    traits: ["Playful", "Independent", "Agile", "Confident"],
    challenges: ["Arrogance", "Impulsivity", "Difficulty with routine"],
    integration: "Embrace joy and playfulness, practice consistency in your spiritual practice, and use your confidence to uplift others.",
    icon: <Heart className="w-6 h-6" />
  }
};

function StarseedGallery() {
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  const saveToProfile = async (origin: string) => {
    if (!auth.currentUser) {
      alert("Please sign in to save your starseed origin.");
      return;
    }
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { starseed: origin });
      alert("Starseed origin saved to your profile!");
    } catch (error) {
      console.error("Error saving starseed:", error);
      alert("Failed to save starseed. Please try again.");
    }
  };

  return (
    <section className="space-y-12" role="region" aria-label="Cosmic Origins Gallery">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-gradient-silver tracking-tight">Cosmic Origins</h2>
        <p className="text-lg text-white font-light max-w-2xl mx-auto">
          Explore the diverse lineages that contribute to the collective consciousness of Terra.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(ORIGIN_RESULTS).map(([key, origin], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="p-6 rounded-3xl bg-black/40 border border-silver/20 hover:border-silver/40 transition-all space-y-4 group flex flex-col focus-within:ring-2 focus-within:ring-silver/40 outline-none shadow-lg shadow-silver/5 cursor-pointer"
            tabIndex={0}
            role="button"
            onClick={() => setSelectedOrigin(key)}
            aria-label={`View details for ${origin.title}`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-silver/10 text-silver group-hover:bg-silver/20 group-hover:text-white transition-all">
                {origin.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-200 group-hover:text-silver transition-colors">{origin.title}</h3>
            </div>
            
            <p className="text-slate-400 font-light text-sm leading-relaxed">{origin.description}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOrigin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
            onClick={() => setSelectedOrigin(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="p-8 md:p-10 rounded-[3rem] glass-morphism max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-8 relative shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-silver/10 text-silver">
                    {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif text-gradient-gold leading-tight">
                      {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].title}
                    </h3>
                    <p className="text-silver/60 text-xs uppercase tracking-widest mt-1">Starseed Origin Profile</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrigin(null)} 
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-slate-300 text-lg font-light leading-relaxed italic">
                  "{ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].description}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-silver font-bold mb-3 flex items-center space-x-2">
                        <Stars className="w-4 h-4" />
                        <span>Cosmic Purpose</span>
                      </h4>
                      <p className="text-sm text-slate-300 font-light leading-relaxed">
                        {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].purpose}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gold font-bold mb-3 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Traits & Essences</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].traits.map((trait, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] text-gold uppercase tracking-wider">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-silver font-bold mb-3 flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Challenges</span>
                      </h4>
                      <ul className="space-y-2">
                        {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].challenges.map((challenge, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-silver/40 mt-1 shrink-0" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-gold font-bold mb-3 flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Integration Methods</span>
                      </h4>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-300 font-light leading-relaxed italic">
                          {ORIGIN_RESULTS[selectedOrigin as keyof typeof ORIGIN_RESULTS].integration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-center">
                <button
                  onClick={() => saveToProfile(selectedOrigin)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-gold/20 to-amber-500/20 hover:from-gold/30 hover:to-amber-500/30 text-gold border border-gold/30 transition-all flex items-center space-x-3 group"
                >
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium tracking-wide">Anchor to Profile</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StarseedQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (origin: string) => {
    setScores(prev => ({ ...prev, [origin]: (prev[origin] || 0) + 1 }));
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getTopOrigin = () => {
    let topOrigin = "Pleiadian";
    let maxScore = 0;
    for (const [origin, score] of Object.entries(scores) as [string, number][]) {
      if (score > maxScore) {
        maxScore = score;
        topOrigin = origin;
      }
    }
    return ORIGIN_RESULTS[topOrigin as keyof typeof ORIGIN_RESULTS];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 border border-gold/30 rounded-3xl p-8 shadow-2xl shadow-gold/10">
      <div className="text-center mb-8">
        <Sparkles className="w-8 h-8 mx-auto text-gold mb-4" />
        <h2 className="text-3xl font-serif text-gradient-gold">Discover Your Origin</h2>
        <p className="text-slate-400 mt-2">Find the cosmic lineage that resonates with your soul's frequency.</p>
      </div>
      
      <AnimatePresence mode="wait">
        {!showResult ? (
        <div
            key="question"
            className="space-y-6 relative z-10"
            role="form"
            aria-label={`Question ${currentQuestion + 1}`}
          >
            <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
              <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
              <div className="flex space-x-1" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin={1} aria-valuemax={QUIZ_QUESTIONS.length} aria-label="Quiz Progress">
                {QUIZ_QUESTIONS.map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-6 rounded-full ${idx <= currentQuestion ? 'bg-gradient-gold' : 'bg-gold/10'}`} />
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-white/20 bg-black/40">
              <h3 className="text-2xl text-yellow-400 font-bold text-center !opacity-100" style={{ color: '#facc15' }}>
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h3>
            </div>
            
            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.origin)}
                  aria-label={`Select option: ${option.text}`}
                  className="w-full text-left p-4 rounded-xl bg-black/20 border border-silver/10 hover:border-gold/50 hover:bg-gold/5 text-slate-300 transition-all group focus:ring-2 focus:ring-gold/40 focus:outline-none"
                >
                  <span className="group-hover:text-gold transition-colors">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
            role="alert"
            aria-live="polite"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-gold/10 border border-gold/30 mb-4">
              <Stars className="w-12 h-12 text-gold" />
            </div>
            <h3 className="text-3xl font-serif text-gradient-gold">{getTopOrigin().title}</h3>
            <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
              {getTopOrigin().description}
            </p>
            
            <div className="text-left space-y-4 bg-black/20 p-6 rounded-2xl border border-silver/10">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-silver font-semibold mb-1">Cosmic Purpose</h4>
                <p className="text-sm text-slate-300 font-light italic">{getTopOrigin().purpose}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Practical Integration</h4>
                <p className="text-sm text-slate-300 font-light">{getTopOrigin().integration}</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  if (!auth.currentUser) {
                    alert("Please sign in to save your starseed origin.");
                    return;
                  }
                  const topOrigin = Object.keys(ORIGIN_RESULTS).find(key => ORIGIN_RESULTS[key as keyof typeof ORIGIN_RESULTS].title === getTopOrigin().title);
                  if (topOrigin) {
                    updateDoc(doc(db, 'users', auth.currentUser.uid), { starseed: topOrigin })
                      .then(() => alert("Starseed origin saved to your profile!"))
                      .catch(err => { console.error(err); alert("Failed to save."); });
                  }
                }}
                className="px-6 py-3 rounded-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save to Profile</span>
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-full bg-silver/10 hover:bg-silver/20 text-silver border border-silver/30 transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Starseeds() {
  console.log("Starseeds page rendering");
  const { user, profile } = useProfile();
  return (
    <div className="max-w-5xl mx-auto space-y-24 pb-24">
      <div className="text-center space-y-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {user && (
            <div className="flex items-center justify-center space-x-3 mb-8">
              <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="md" />
              <span className="text-xs uppercase tracking-[0.4em] text-gold/60 font-bold">Cosmic Traveler</span>
            </div>
          )}
          <Sparkles className="w-16 h-16 mx-auto text-gold mb-6" />
          <h1 className="text-5xl md:text-9xl font-serif italic text-gradient-silver tracking-tight">
            Astris: The Starseed Journey
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-silver to-transparent mx-auto mt-8" />
          <p className="text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto italic mt-8">
            "Astris guides you to anchor your etheric light into Terra's grid. All souls will gain access to solid bodies they resonate with."
          </p>
        </motion.div>
      </div>

      <StarseedGallery />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-16">
        <div className="space-y-8">
          <h2 className="text-4xl font-serif text-gradient-gold">Bodies of Light</h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            In the New Paradigm, the physical vessel is no longer a dense trap, but a fluid expression of the soul. By utilizing raw Aevum particles, Starseeds can construct solid bodies of light that perfectly resonate with their inner frequency.
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            These bodies are not bound by the old laws of decay, but are sustained by alignment with Cosmic Truth. When a Starseed is in harmony with the collective, their light body radiates, anchoring higher timelines into Terra's grid.
          </p>
        </div>
        <div className="relative aspect-square rounded-full border border-gold/30 flex items-center justify-center overflow-hidden bg-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-silver/10" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-dashed border-gold/30 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-gold/20 rounded-full blur-2xl"
          />
          <Sun className="w-24 h-24 text-gold relative z-10" />
        </div>
      </section>

      <section className="space-y-16 py-16" role="region" aria-label="Dynamic Magic Systems">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif text-gradient-silver">Dynamic Magic Systems</h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Magic is no longer hidden; it is a dynamically growing system that uses whatever kind of magic the individual resonates with, as a form of expression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MAGIC_SYSTEMS.map((system, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-black/40 border border-silver/20 hover:border-silver/40 transition-all space-y-6 group hover:bg-black/60 focus-within:ring-2 focus-within:ring-silver/40 outline-none shadow-lg shadow-silver/5"
              tabIndex={0}
              role="article"
              aria-labelledby={`magic-system-title-${idx}`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-silver/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {system.icon}
                </div>
                <h3 id={`magic-system-title-${idx}`} className="text-2xl font-medium text-gradient-gold">{system.name}</h3>
              </div>
              <p className="text-slate-400 font-light leading-relaxed">{system.description}</p>
              <div className="pt-6 border-t border-silver/10">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-silver mt-1 shrink-0" />
                  <p className="text-sm text-silver/80 italic">{system.feedback}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-16">
        <div className="order-2 md:order-1 relative aspect-square rounded-3xl border border-silver/30 flex items-center justify-center overflow-hidden bg-black/40">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-silver/20 rounded-full blur-3xl"
          />
          <div className="space-y-4 text-center relative z-10 p-8">
            <Waves className="w-20 h-20 text-silver mx-auto" />
            <div className="h-1 w-24 bg-silver/50 mx-auto rounded-full" />
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-8">
          <h2 className="text-4xl font-serif text-gradient-gold">Hearing the Earth</h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            "People who want to hear the earth can, literally."
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Terra is not a silent rock, but a living consciousness. As Starseeds anchor their light bodies, their senses expand beyond the physical. The Veridian Echo—the voice of wisdom that ripples through existence—can be heard in the wind, the water, and the deep stillness of the forest.
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            This connection provides grounding, guidance, and a profound sense of belonging to the cosmic family.
          </p>
        </div>
      </section>
      <section className="pt-16 border-t border-white/10">
        <StarseedQuiz />
      </section>
    </div>
  );
}
