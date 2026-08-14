import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }

      if (firebaseUser) {
        setUser(firebaseUser);
        // Stay loading until the FIRST snapshot of the user doc actually arrives
        unsubProfile = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
            setRole(snap.data().role || "");
          } else {
            setProfile(null);
            setRole("");
          }
          setLoading(false);
        }, () => {
          // permission error or similar — don't get stuck loading forever
          setProfile(null);
          setRole("");
          setLoading(false);
        });
      } else {
        setUser(null);
        setProfile(null);
        setRole("");
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}