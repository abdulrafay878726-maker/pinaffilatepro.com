"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { firebaseAuth, type AuthUser } from "@/lib/firebaseAuth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const firebaseUser = await firebaseAuth.signIn(email, password, rememberMe);
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
    });
  };

  const register = async (fullName: string, email: string, password: string) => {
    const firebaseUser = await firebaseAuth.signUp(email, password, fullName);
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
    });
  };

  const logout = async () => {
    await firebaseAuth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await firebaseAuth.resetPassword(email);
  };

  const resendVerification = async () => {
    await firebaseAuth.resendVerification();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
