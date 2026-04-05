import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Heart, MessageSquare, User, Sparkles, Trash2, Eye, Share2, CornerDownRight } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { UserAvatar } from '../components/UserAvatar';
import { useProfile } from '../hooks/useProfile';

interface Post {
  id: string;
  uid: string;
  authorName: string;
  authorPhoto: string;
  authorStarseed?: string;
  authorMantra?: string;
  content: string;
  createdAt: any;
  likes: number;
  isAnonymous?: boolean;
}

interface Comment {
  id: string;
  uid: string;
  authorName: string;
  authorPhoto: string;
  authorStarseed?: string;
  content: string;
  createdAt: any;
}

function CommentSection({ postId, user, profile }: { postId: string, user: any, profile: any }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const c = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      setComments(c);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `posts/${postId}/comments`);
      setLoading(false);
    });
    return unsub;
  }, [postId]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        uid: user.uid,
        authorName: profile?.displayName || user.displayName || "Seeker",
        authorPhoto: profile?.photoURL || user.photoURL || "",
        authorStarseed: profile?.starseed || "",
        content: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `posts/${postId}/comments`);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${postId}/comments/${commentId}`);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3 group/comment">
            <UserAvatar 
              photoURL={comment.authorPhoto} 
              size="sm"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-serif italic text-silver-300">{comment.authorName}</span>
                  {comment.authorStarseed && comment.authorStarseed !== "None / Earth Native" && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold/5 text-gold/60 border border-gold/10 uppercase tracking-tighter">
                      {comment.authorStarseed}
                    </span>
                  )}
                </div>
                {user?.uid === comment.uid && (
                  <button onClick={() => handleDeleteComment(comment.id)} className="opacity-0 group-hover/comment:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-400 font-light leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleComment} className="flex items-center space-x-3 mt-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a reflection..."
              className="w-full bg-slate-950/50 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-300 focus:border-silver/30 focus:ring-0 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 text-silver hover:text-gold disabled:opacity-30 transition-colors"
          >
            <CornerDownRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function Community() {
  const { user, profile, loading: profileLoading } = useProfile();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [filter, setFilter] = useState<'all' | 'family'>('all');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubPosts = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(p);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
      setLoading(false);
    });

    return () => {
      unsubPosts();
    };
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        authorName: isAnonymous ? "Anonymous Seeker" : (profile?.displayName || user.displayName || "Seeker"),
        authorPhoto: isAnonymous ? "" : (profile?.photoURL || user.photoURL || ""),
        authorStarseed: isAnonymous ? "" : (profile?.starseed || ""),
        authorMantra: isAnonymous ? "" : (profile?.cosmicMantra || ""),
        content: newPost,
        createdAt: serverTimestamp(),
        likes: 0,
        isAnonymous
      });
      setNewPost("");
      setIsAnonymous(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${postId}`);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  const handleShare = async (post: Post) => {
    const shareData = {
      title: 'Cosmic Collective Transmission',
      text: `"${post.content}" - Shared from Cosmic Collective by ${post.authorName}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("Link and transmission copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-gradient-silver italic tracking-tight">Cosmic Collective</h1>
        <p className="text-slate-400 font-light max-w-lg mx-auto">
          Share your insights, downloads, and reflections with the community.
        </p>
      </header>

      {user ? (
        <form onSubmit={handlePost} className="bg-slate-900/40 border border-silver/20 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl shadow-white/5 backdrop-blur-md">
          <div className="flex items-start space-x-4">
            <div className="hidden sm:block mt-1">
              <UserAvatar 
                photoURL={isAnonymous ? "" : profile?.photoURL} 
                avatarIcon={isAnonymous ? "Eye" : profile?.avatarIcon} 
                size="md"
                className={isAnonymous ? "border-indigo-500/30" : "border-silver/20"}
              />
            </div>
            <div className="space-y-4 flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's echoing in your consciousness?"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 resize-none h-32 text-lg font-light"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/5 gap-4">
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                  isAnonymous 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                  : 'bg-slate-800/50 border-white/10 text-slate-500 hover:border-white/20'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-widest">{isAnonymous ? 'Anonymous' : 'Public'}</span>
              </button>
              {!isAnonymous && (
                <span className="text-xs text-slate-500 italic hidden sm:inline">Posting as {profile?.displayName || user.displayName}</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-500 hover:brightness-110 disabled:opacity-50 text-slate-950 rounded-full text-sm font-bold tracking-widest transition-all flex items-center justify-center space-x-3 shadow-xl shadow-gold/20 uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Transmit</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900/40 border border-silver/10 rounded-[2.5rem] p-12 text-center space-y-4">
          <Sparkles className="w-12 h-12 mx-auto text-silver/20" />
          <p className="text-slate-400 italic font-light">Connect your consciousness to share with the collective.</p>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest transition-all ${
              filter === 'all'
                ? 'bg-silver/20 text-silver border border-silver/50'
                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:border-silver/20'
            }`}
          >
            All Transmissions
          </button>
          <button
            onClick={() => setFilter('family')}
            className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-widest transition-all ${
              filter === 'family'
                ? 'bg-gold/20 text-gold border border-gold/50'
                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:border-gold/20'
            }`}
          >
            Cosmic Family
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {posts
            .filter(post => filter === 'all' || (filter === 'family' && post.authorStarseed === profile?.starseed && profile?.starseed && profile.starseed !== "None / Earth Native"))
            .map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 md:p-10 space-y-6 hover:border-silver/20 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <Sparkles className="w-32 h-32 text-silver" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center space-x-4">
                  <UserAvatar 
                    photoURL={post.isAnonymous ? "" : post.authorPhoto} 
                    avatarIcon={post.isAnonymous ? "Eye" : undefined}
                    size="md"
                    className={post.isAnonymous ? "border-indigo-500/30" : "border-silver/20"}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-serif italic text-lg ${post.isAnonymous ? 'text-indigo-300' : 'text-gradient-silver'}`}>
                        {post.authorName}
                      </h3>
                      {post.authorStarseed && post.authorStarseed !== "None / Earth Native" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold-400/30 uppercase tracking-widest font-bold shadow-lg shadow-gold/10">
                          {post.authorStarseed}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-light">
                      {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
                {user?.uid === post.uid && (
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4 relative z-10">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg font-light italic font-serif">
                  "{post.content}"
                </p>
                {post.authorMantra && (
                  <div className="pl-4 border-l border-gold/30">
                    <p className="text-xs text-gold/60 italic font-light tracking-wide">
                      Mantra: {post.authorMantra}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-8 pt-6 border-t border-white/5 relative z-10">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-slate-500 hover:text-gold transition-all group/like"
                >
                  <div className={`p-2 rounded-full transition-colors ${post.likes > 0 ? 'bg-gold/10' : 'group-hover/like:bg-gold/5'}`}>
                    <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-gold text-gold' : ''}`} />
                  </div>
                  <span className="text-sm font-medium">{post.likes || 0}</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 text-slate-500 hover:text-silver transition-all group/reflect"
                  onClick={() => {
                    const el = document.getElementById(`comments-${post.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <div className="p-2 rounded-full group-hover/reflect:bg-silver/5 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-widest text-[10px]">Reflect</span>
                </button>

                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center space-x-2 text-slate-500 hover:text-indigo-400 transition-all group/share"
                >
                  <div className="p-2 rounded-full group-hover/share:bg-indigo-500/5 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-widest text-[10px]">Share</span>
                </button>
              </div>

              <div id={`comments-${post.id}`}>
                <CommentSection postId={post.id} user={user} profile={profile} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-center py-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-silver/20 border-t-gold rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
