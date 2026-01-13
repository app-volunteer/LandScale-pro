
import React, { useState, useEffect } from "react";
import FirebaseLoginUI from "./components/FirebaseLoginUI";
import ProjectPage from "./components/ProjectPage";
import Landing from "./components/Landing";
import { FirebaseUser } from "./types";
import { auth } from "./firebase";
import { onAuthStateChanged } from "@firebase/auth";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => setUser(null));
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user) {
    return <ProjectPage user={user} onLogout={handleLogout} />;
  }

  if (showLogin) {
    return <FirebaseLoginUI onAuthSuccess={(u) => setUser(u)} onBack={() => setShowLogin(false)} />;
  }

  return <Landing onGetStarted={() => setShowLogin(true)} />;
}
