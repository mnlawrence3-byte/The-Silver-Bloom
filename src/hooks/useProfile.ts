import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  avatarIcon: string;
  starseed: string;
  cosmicMantra: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  soulUrge: number;
  lifePath: number;
  soulMission: string;
  energyBlueprint: {
    intuition: number;
    grounding: number;
    empathy: number;
    manifestation: number;
    cosmicConnection: number;
  };
  updatedAt: string;
}

export function useProfile() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const profileRef = doc(db, 'users', u.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const initialProfile: UserProfile = {
              uid: u.uid,
              displayName: u.displayName || "Seeker",
              photoURL: u.photoURL || "",
              avatarIcon: "Stars",
              sunSign: "",
              moonSign: "",
              risingSign: "",
              soulUrge: 1,
              lifePath: 1,
              starseed: "None / Earth Native",
              cosmicMantra: "",
              soulMission: "",
              energyBlueprint: {
                intuition: 50,
                grounding: 50,
                empathy: 50,
                manifestation: 50,
                cosmicConnection: 50
              },
              updatedAt: new Date().toISOString()
            };
            setProfile(initialProfile);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
          setLoading(false);
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
