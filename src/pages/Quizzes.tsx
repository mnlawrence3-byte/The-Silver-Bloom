import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft, RotateCcw, Stars, Compass, Heart, Activity } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

interface Question {
  id: number;
  question: string;
  options: { text: string; value: string }[];
}

const STARSEED_QUIZ: Question[] = [
  {
    id: 1,
    question: "When you look at the night sky, which constellation draws your gaze most intensely?",
    options: [
      { text: "The Seven Sisters (Pleiades)", value: "Pleiadian" },
      { text: "The Dog Star (Sirius)", value: "Sirian" },
      { text: "The Hunter (Orion)", value: "Orion" },
      { text: "The Great Bear (Ursa Major/Arcturus)", value: "Arcturian" }
    ]
  },
  {
    id: 2,
    question: "What is your primary soul mission on Earth?",
    options: [
      { text: "Healing and spreading unconditional love", value: "Pleiadian" },
      { text: "Building new systems and protecting nature", value: "Sirian" },
      { text: "Advancing technology and logic", value: "Andromedan" },
      { text: "Teaching wisdom and higher consciousness", value: "Arcturian" }
    ]
  },
  {
    id: 3,
    question: "Which of these elements do you feel most connected to?",
    options: [
      { text: "Air & Light", value: "Pleiadian" },
      { text: "Water & Deep Oceans", value: "Sirian" },
      { text: "Fire & Transformation", value: "Lyran" },
      { text: "Ether & Pure Thought", value: "Arcturian" }
    ]
  },
  {
    id: 4,
    question: "How do you typically experience 'downloads' or intuition?",
    options: [
      { text: "Sudden emotional waves of knowing", value: "Pleiadian" },
      { text: "Geometric patterns or technical blueprints", value: "Sirian" },
      { text: "Direct telepathic communication", value: "Arcturian" },
      { text: "Vivid dreams and astral travel", value: "Andromedan" }
    ]
  }
];

const SOUL_MISSION_QUIZ: Question[] = [
  {
    id: 1,
    question: "What brings you the most profound sense of joy?",
    options: [
      { text: "Creating something new from nothing", value: "Creator" },
      { text: "Helping others heal and find peace", value: "Healer" },
      { text: "Sharing knowledge and wisdom", value: "Teacher" },
      { text: "Protecting the vulnerable and the Earth", value: "Guardian" }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to contribute to the collective?",
    options: [
      { text: "Through direct action and physical work", value: "Guardian" },
      { text: "By offering emotional support and empathy", value: "Healer" },
      { text: "By developing new ideas and theories", value: "Creator" },
      { text: "By guiding others on their spiritual path", value: "Teacher" }
    ]
  },
  {
    id: 3,
    question: "What is your greatest soul challenge in this life?",
    options: [
      { text: "Overcoming self-doubt and finding your voice", value: "Teacher" },
      { text: "Learning to let go of control and flow", value: "Creator" },
      { text: "Balancing your own needs with others'", value: "Healer" },
      { text: "Finding the courage to stand for truth", value: "Guardian" }
    ]
  }
];

const LOVE_FREQUENCY_QUIZ: Question[] = [
  {
    id: 1,
    question: "How do you most naturally express your affection?",
    options: [
      { text: "Through words of affirmation and praise", value: "Harmonic" },
      { text: "By spending focused, quality time together", value: "Resonant" },
      { text: "Through physical touch and closeness", value: "Elemental" },
      { text: "By performing thoughtful acts of service", value: "Devotional" }
    ]
  },
  {
    id: 2,
    question: "What quality do you value most in a soul connection?",
    options: [
      { text: "Unwavering loyalty and trust", value: "Devotional" },
      { text: "Deep understanding and empathy", value: "Harmonic" },
      { text: "Raw passion and intensity", value: "Elemental" },
      { text: "A shared vision for the future", value: "Resonant" }
    ]
  },
  {
    id: 3,
    question: "What is your ideal way to bond with a loved one?",
    options: [
      { text: "Stargazing and discussing the universe", value: "Resonant" },
      { text: "Having a deep, soul-baring conversation", value: "Harmonic" },
      { text: "Working on a creative project together", value: "Elemental" },
      { text: "A quiet walk in nature, side by side", value: "Devotional" }
    ]
  }
];

const ENERGY_BLUEPRINT_QUIZ: Question[] = [
  {
    id: 1,
    question: "How do you typically feel after being in a large crowd?",
    options: [
      { text: "Completely drained and needing solitude", value: "Sensitive" },
      { text: "Energized and inspired by the collective", value: "Radiant" },
      { text: "Mostly neutral, but slightly tired", value: "Grounding" },
      { text: "Overwhelmed by the mix of emotions", value: "Empathic" }
    ]
  },
  {
    id: 2,
    question: "What is your most effective way to recharge your energy?",
    options: [
      { text: "Deep meditation and silence", value: "Sensitive" },
      { text: "Long hours of restorative sleep", value: "Grounding" },
      { text: "Vigorous exercise or movement", value: "Radiant" },
      { text: "Spending time in nature or by water", value: "Empathic" }
    ]
  },
  {
    id: 3,
    question: "How often do you feel 'out of sync' with your physical body?",
    options: [
      { text: "Rarely, I feel very grounded", value: "Grounding" },
      { text: "Occasionally, during times of stress", value: "Radiant" },
      { text: "Frequently, I often feel 'floaty'", value: "Sensitive" },
      { text: "Always, I feel more like a spirit", value: "Empathic" }
    ]
  }
];

const QUIZZES_DATA: Record<string, { title: string, questions: Question[] }> = {
  STARSEED_QUIZ: { title: "Starseed Origin", questions: STARSEED_QUIZ },
  SOUL_MISSION_QUIZ: { title: "Soul Mission", questions: SOUL_MISSION_QUIZ },
  LOVE_FREQUENCY_QUIZ: { title: "Love Frequency", questions: LOVE_FREQUENCY_QUIZ },
  ENERGY_BLUEPRINT_QUIZ: { title: "Energy Blueprint", questions: ENERGY_BLUEPRINT_QUIZ }
};

export default function Quizzes() {
  const { user, profile } = useProfile();
  const [selectedQuizKey, setSelectedQuizKey] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const activeQuiz = selectedQuizKey ? QUIZZES_DATA[selectedQuizKey] : null;

  const handleAnswer = (value: string) => {
    if (!activeQuiz) return;
    const newAnswers = { ...answers, [activeQuiz.questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < activeQuiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, string>) => {
    const counts: Record<string, number> = {};
    Object.values(finalAnswers).forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    setResult(sorted[0][0]);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setSelectedQuizKey(null);
  };

  const startQuiz = (key: string) => {
    setSelectedQuizKey(key);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header className="text-center space-y-4">
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
        <h1 className="text-5xl font-serif text-silver-200 italic tracking-tight">Cosmic Inquiries</h1>
        <p className="text-slate-400 font-light max-w-lg mx-auto">
          Discover your origins and align with your soul's blueprint through these guided reflections.
        </p>
      </header>

      <div className="bg-black/40 border border-silver/20 rounded-3xl p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden shadow-lg shadow-silver/5">
        <AnimatePresence>
          {!selectedQuizKey ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-silver/5 rounded-full flex items-center justify-center mx-auto border border-silver/20">
                <Compass className="w-10 h-10 text-silver" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-silver-200 italic">Choose Your Inquiry</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Select a path of exploration to begin your journey inward.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: <Stars className="w-5 h-5" />, title: "Starseed Origin", key: "STARSEED_QUIZ" },
                  { icon: <Compass className="w-5 h-5" />, title: "Soul Mission", key: "SOUL_MISSION_QUIZ" },
                  { icon: <Heart className="w-5 h-5" />, title: "Love Frequency", key: "LOVE_FREQUENCY_QUIZ" },
                  { icon: <Activity className="w-5 h-5" />, title: "Energy Blueprint", key: "ENERGY_BLUEPRINT_QUIZ" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => startQuiz(item.key)}
                    className="p-6 rounded-2xl border border-silver/10 bg-black/20 hover:bg-silver/5 hover:border-silver/30 text-left transition-all group flex items-center space-x-4"
                  >
                    <div className="p-3 rounded-xl bg-silver/5 text-silver group-hover:text-gold transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-slate-300 group-hover:text-white font-medium">{item.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : !result ? (
            <motion.div
              key={`${selectedQuizKey}-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 relative z-10"
            >
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-silver-300 font-medium">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setSelectedQuizKey(null)} className="hover:text-gold transition-colors">
                    <ChevronLeft className="w-3 h-3 inline mr-1" />
                    Back
                  </button>
                  <span className="text-silver/30">|</span>
                  <span>{activeQuiz?.title}</span>
                </div>
                <span>Inquiry {currentStep + 1} of {activeQuiz?.questions.length}</span>
              </div>

              <div className="flex space-x-1">
                {activeQuiz?.questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-1 rounded-full transition-all ${i <= currentStep ? 'bg-gradient-silver' : 'bg-silver/10'}`} 
                  />
                ))}
              </div>

              <h2 className="text-3xl font-serif text-white italic leading-snug drop-shadow-sm">
                {activeQuiz?.questions[currentStep].question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeQuiz?.questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.value)}
                    className="p-6 rounded-2xl border border-silver/10 bg-black/20 hover:bg-silver/5 hover:border-silver/30 text-left text-slate-300 transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white group-hover:text-gold-300 transition-colors">{option.text}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/30 shadow-lg shadow-gold/10">
                  <UserAvatar photoURL={profile?.photoURL} avatarIcon={profile?.avatarIcon} size="lg" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/20 blur-xl rounded-full -z-10"
                />
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Your Cosmic Alignment</p>
                <h2 className="text-5xl font-serif text-white italic drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">{result}</h2>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your resonance aligns most strongly with the {result} frequency. This alignment suggests a soul mission focused on anchoring higher light and wisdom into the physical realm.
                </p>
              </div>
              <div className="flex justify-center space-x-4 pt-8">
                <button
                  onClick={resetQuiz}
                  className="flex items-center space-x-2 px-8 py-3 bg-silver/10 hover:bg-silver/20 text-silver border border-silver/30 rounded-full text-sm font-medium transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New Inquiry</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-500 hover:opacity-90 text-slate-950 rounded-full text-sm font-medium transition-all shadow-lg shadow-gold/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save to Profile</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Compass className="w-6 h-6" />, title: "Soul Mission", key: "SOUL_MISSION_QUIZ", desc: "Discover your primary purpose in this incarnation." },
          { icon: <Heart className="w-6 h-6" />, title: "Love Frequency", key: "LOVE_FREQUENCY_QUIZ", desc: "Identify your soul's unique way of expressing love." },
          { icon: <Activity className="w-6 h-6" />, title: "Energy Blueprint", key: "ENERGY_BLUEPRINT_QUIZ", desc: "Understand your energetic body and how to clear it." }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => startQuiz(item.key)}
            className="p-8 bg-slate-900/40 border border-white/5 hover:border-silver/50 rounded-3xl space-y-4 text-left transition-all group shadow-lg hover:shadow-silver/5"
          >
            <div className="p-4 rounded-2xl bg-silver/5 text-silver group-hover:bg-silver/10 group-hover:text-gold transition-all duration-500 w-fit">
              {item.icon}
            </div>
            <h3 className="text-slate-200 font-serif italic text-xl group-hover:text-gold transition-colors">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-light">{item.desc}</p>
            <span className="inline-block text-[10px] uppercase tracking-widest text-silver group-hover:text-gold transition-colors mt-2">Start Inquiry</span>
          </button>
        ))}
      </div>
    </div>
  );
}
