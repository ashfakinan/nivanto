import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours
const LAST_ACTIVITY_KEY = 'nivanto_admin_last_activity';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  otpVerified: boolean;
  setOtpVerified: (verified: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [otpVerified, setOtpVerifiedState] = useState(false);

  const logout = useCallback(async () => {
    setOtpVerifiedState(false);
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {
      // ignore storage errors
    }
    await signOut(auth);
  }, []);

  const setOtpVerified = useCallback((verified: boolean) => {
    setOtpVerifiedState(verified);
    if (verified) {
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const lastActivityRaw = localStorage.getItem(LAST_ACTIVITY_KEY);
          if (lastActivityRaw) {
            const elapsed = Date.now() - Number(lastActivityRaw);
            if (elapsed > INACTIVITY_TIMEOUT_MS) {
              await signOut(auth);
              localStorage.removeItem(LAST_ACTIVITY_KEY);
              setUser(null);
              setOtpVerifiedState(false);
              setAuthReady(true);
              return;
            }
          }
        } catch {
          // ignore storage errors
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setOtpVerifiedState(false);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Track admin activity and enforce 24-hour inactivity expiry
  useEffect(() => {
    if (!user || !otpVerified) return;

    const recordActivity = () => {
      try {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    };

    recordActivity();

    const events: (keyof WindowEventMap)[] = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ];
    events.forEach((evt) =>
      window.addEventListener(evt, recordActivity, { passive: true })
    );

    const interval = window.setInterval(() => {
      try {
        const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || '0');
        if (last && Date.now() - last > INACTIVITY_TIMEOUT_MS) {
          void logout();
        }
      } catch {
        // ignore
      }
    }, 60_000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      window.clearInterval(interval);
    };
  }, [user, otpVerified, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        otpVerified,
        setOtpVerified,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
