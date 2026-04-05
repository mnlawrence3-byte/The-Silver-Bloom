import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Plus, Save, Trash2, Calendar, Sparkles, ChevronLeft, ChevronRight, Edit3, Eye, User } from 'lucide-react';
import Markdown from 'react-markdown';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from '../components/UserAvatar';

interface JournalEntry {
  id: string;
  uid: string;
  title: string;
  content: string;
  createdAt: any;
  updatedAt: any;
}

export default function Journal() {
  const { user, profile, loading: profileLoading } = useProfile();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditorMobile, setShowEditorMobile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'journals'), 
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubEntries = onSnapshot(q, (snapshot) => {
        console.log("Journal snapshot received, count:", snapshot.size);
        const e = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
        console.log("Entries:", e);
        setEntries(e);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching journal entries:", error);
        handleFirestoreError(error, OperationType.GET, 'journals');
        setLoading(false);
      });
      return () => unsubEntries();
    } else if (!profileLoading) {
      setLoading(false);
    }
  }, [user, profileLoading]);

  const handleNew = () => {
    setActiveEntry(null);
    setTitle("");
    setContent("");
    setShowEditorMobile(true);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    
    const journalData = {
      uid: user.uid,
      title: title || "Untitled Reflection",
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log("Attempting to save journal entry:", journalData);

    try {
      if (activeEntry) {
        await updateDoc(doc(db, 'journals', activeEntry.id), {
          title: title || "Untitled Reflection",
          content,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'journals'), journalData);
        setActiveEntry({
          id: docRef.id,
          uid: user.uid,
          title: title || "Untitled Reflection",
          content,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      handleFirestoreError(error, activeEntry ? OperationType.UPDATE : OperationType.CREATE, activeEntry ? `journals/${activeEntry.id}` : 'journals');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'journals', id));
      if (activeEntry?.id === id) handleNew();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `journals/${id}`);
    }
  };

  const selectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setShowEditorMobile(true);
    setIsEditing(false);
  };

  const filteredEntries = entries.filter(entry => {
    const match = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });
  console.log("Filtered entries:", filteredEntries);

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
        <Book className="w-16 h-16 mx-auto text-silver" />
        <h1 className="text-4xl font-serif text-gradient-silver italic">Veridian Echo: Sacred Space</h1>
        <p className="text-slate-400 font-light">
          Your journal is a private sanctuary for your inner journey. Listen to the Veridian Echo to anchor your desired timeline. Please connect your consciousness to begin.
        </p>
      </div>
    );
  }

  // ... (inside the return statement)

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-150px)] flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className={`w-full md:w-96 flex flex-col space-y-6 ${showEditorMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center space-x-4 p-4 glass-morphism rounded-3xl border border-white/5">
          <UserAvatar 
            photoURL={profile?.photoURL} 
            avatarIcon={profile?.avatarIcon} 
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-serif italic text-gradient-silver truncate">{profile?.displayName || user.displayName}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{profile?.starseed || "Seeker"}</p>
          </div>
        </div>

        <button
          onClick={handleNew}
          className="w-full flex items-center justify-center space-x-3 p-5 bg-gradient-to-r from-silver/20 to-silver/10 hover:from-silver/30 hover:to-silver/20 text-silver rounded-3xl border border-silver/20 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium tracking-wide">New Reflection</span>
        </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-slate-900/40 border border-white/5 rounded-2xl text-slate-200 focus:ring-2 focus:ring-silver outline-none"
          />
          <Sparkles className="absolute left-4 top-4 w-5 h-5 text-silver/50" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 space-y-4 opacity-40">
              <Book className="w-12 h-12 mx-auto" />
              <p className="text-sm italic">No reflections found in the ether...</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => selectEntry(entry)}
                className={`w-full p-5 rounded-3xl border text-left transition-all ${
                  activeEntry?.id === entry.id 
                  ? "bg-silver/10 border-silver shadow-lg shadow-silver/10" 
                  : "bg-slate-900/40 border-white/5 hover:border-white/10"
                }`}
              >
                <h3 className={`font-serif italic text-lg truncate ${activeEntry?.id === entry.id ? 'text-silver' : 'text-slate-200'}`}>{entry.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1 font-light">{entry.content}</p>
                <div className="flex items-center space-x-2 mt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Editor */}
      <main className={`flex-1 bg-slate-900/40 border border-gold/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col space-y-6 md:space-y-8 shadow-2xl shadow-gold/5 ${!showEditorMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowEditorMobile(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Reflection..."
                className="bg-transparent border-none focus:ring-0 text-2xl md:text-4xl font-serif text-gradient-gold italic placeholder:text-slate-700 w-full"
              />
            ) : (
              <h2 className="text-2xl md:text-4xl font-serif text-gradient-gold italic truncate">
                {title || "Untitled Reflection"}
              </h2>
            )}
          </div>
          <div className="flex items-center justify-end space-x-4">
            {activeEntry && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-3 transition-colors rounded-full ${isEditing ? 'text-gold bg-gold/10' : 'text-slate-600 hover:text-silver hover:bg-white/5'}`}
                  title={isEditing ? "View Mode" : "Edit Mode"}
                >
                  {isEditing ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => handleDelete(activeEntry.id)}
                  className="p-3 text-slate-600 hover:text-red-400 transition-colors rounded-full hover:bg-red-950/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-300 to-amber-500 hover:brightness-110 disabled:opacity-50 text-slate-950 rounded-full font-medium transition-all shadow-lg shadow-gold/20"
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
                <span>{activeEntry ? "Anchor" : "Save"}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What downloads are you receiving?..."
              className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-300 leading-relaxed placeholder:text-slate-700 resize-none text-lg md:text-xl font-light"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg md:text-xl font-light italic font-serif">
              <Markdown>{content || "*No content anchored yet...*"}</Markdown>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between pt-6 border-t border-white/5 gap-4">
          <div className="flex items-center space-x-3 text-[10px] md:text-xs text-slate-500 italic">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>Veridian Echo: Your sacred reflections are anchored in the ether.</span>
          </div>
          <p className="text-[10px] md:text-xs text-slate-600 uppercase tracking-widest text-right">
            {content.length} characters
          </p>
        </div>
      </main>
    </div>
  );
}
