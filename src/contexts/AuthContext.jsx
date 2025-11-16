// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userSnapUnsubRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // detach any previous profile listener
      if (userSnapUnsubRef.current) {
        try { userSnapUnsubRef.current(); } catch (e) {}
        userSnapUnsubRef.current = null;
      }

      if (user) {
        // Attach realtime listener to users/{uid}
        const ref = doc(db, "users", user.uid);
        const unsubProfile = onSnapshot(
          ref,
          (snap) => {
            if (snap.exists()) {
              setProfile(snap.data());
              // console.debug("[Auth] profile snapshot ->", snap.data());
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("[Auth] profile snapshot error", err);
            setProfile(null);
            setLoading(false);
          }
        );
        userSnapUnsubRef.current = unsubProfile;
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (userSnapUnsubRef.current) {
        try { userSnapUnsubRef.current(); } catch (e) {}
      }
    };
  }, []);

  async function signup(data) {
    // data includes role and all extra fields — unchanged behavior
    const { email, password, displayName, role } = data;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    if (displayName) {
      await firebaseUpdateProfile(user, { displayName });
    }

    const base = {
      uid: user.uid,
      displayName: displayName || "",
      email,
      role: role || "patient",
      createdAt: new Date().toISOString(),
    };

    if (role === "patient") {
      const patientFields = {
        gender: data.gender || "",
        age: data.age || "",
        phone: data.phone || "",
        address: data.address || "",
      };
      await setDoc(doc(db, "users", user.uid), { ...base, ...patientFields });
    } else if (role === "doctor") {
      const doctorFields = {
        specialization: data.specialization || "",
        qualification: data.qualification || "",
        yearsExperience: data.yearsExperience || "",
        clinic: data.clinic || "",
        phone: data.doctorPhone || data.phone || "",
      };
      await setDoc(doc(db, "users", user.uid), { ...base, ...doctorFields });
      await setDoc(doc(db, "doctors", user.uid), {
        uid: user.uid,
        displayName: displayName || "",
        ...doctorFields,
        createdAt: new Date().toISOString(),
      });
    } else {
      await setDoc(doc(db, "users", user.uid), base);
    }

    // the onSnapshot listener will pick up the new document and update `profile`
    return user;
  }

  function login({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    profile,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
