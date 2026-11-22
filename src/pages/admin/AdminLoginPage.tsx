import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  linkWithPhoneNumber,
  reauthenticateWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import { AlertCircle, KeyRound, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { NivantoLogoLockup } from '../../components/NivantoLogo';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';

const ADMIN_PHONE_NUMBER = '+8801720266825';
const MAX_PASSWORD_ATTEMPTS = 5;
const PASSWORD_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_ATTEMPTS = 3;
const OTP_LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes
const OTP_EXPIRY_SECONDS = 60;

const PW_LOCKOUT_KEY = 'nivanto_admin_pw_lockout';
const OTP_LOCKOUT_KEY = 'nivanto_admin_otp_lockout';

function formatCountdown(msRemaining: number): string {
  const totalSec = Math.max(0, Math.ceil(msRemaining / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, otpVerified, setOtpVerified } = useAuth();

  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [failedPasswordAttempts, setFailedPasswordAttempts] = useState(0);
  const [failedOtpAttempts, setFailedOtpAttempts] = useState(0);

  const [pwLockoutUntil, setPwLockoutUntil] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(PW_LOCKOUT_KEY) || '0');
      return saved > Date.now() ? saved : 0;
    } catch {
      return 0;
    }
  });

  const [otpLockoutUntil, setOtpLockoutUntil] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(OTP_LOCKOUT_KEY) || '0');
      return saved > Date.now() ? saved : 0;
    } catch {
      return 0;
    }
  });

  const [now, setNow] = useState(Date.now());
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  // Redirect if already authenticated AND 2FA OTP verified
  useEffect(() => {
    if (user && otpVerified) {
      navigate('/inan1422008admin/dashboard', { replace: true });
    }
  }, [user, otpVerified, navigate]);

  // Global 1-second ticker for lockouts and OTP expiry countdown
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (pwLockoutUntil && current >= pwLockoutUntil) {
        setPwLockoutUntil(0);
        setFailedPasswordAttempts(0);
        try {
          localStorage.removeItem(PW_LOCKOUT_KEY);
        } catch {
          // ignore
        }
      }

      if (otpLockoutUntil && current >= otpLockoutUntil) {
        setOtpLockoutUntil(0);
        setFailedOtpAttempts(0);
        try {
          localStorage.removeItem(OTP_LOCKOUT_KEY);
        } catch {
          // ignore
        }
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [pwLockoutUntil, otpLockoutUntil]);

  // OTP 60s expiry countdown
  useEffect(() => {
    if (step !== 'otp' || otpSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setOtpSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, otpSecondsLeft]);

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
        } catch {
          // ignore
        }
        recaptchaRef.current = null;
      }
    };
  }, []);

  const getRecaptchaVerifier = (): RecaptchaVerifier => {
    if (recaptchaRef.current) {
      try {
        recaptchaRef.current.clear();
      } catch {
        // ignore
      }
    }
    const container = recaptchaContainerRef.current;
    if (!container) {
      throw new Error('reCAPTCHA container unavailable.');
    }
    const verifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
    });
    recaptchaRef.current = verifier;
    return verifier;
  };

  const sendOtpToAdminPhone = async (signedInUser: User) => {
    const verifier = getRecaptchaVerifier();
    const hasPhoneLinked = signedInUser.providerData.some(
      (p) => p.providerId === 'phone'
    );

    let confirmation: ConfirmationResult;
    if (hasPhoneLinked) {
      confirmation = await reauthenticateWithPhoneNumber(
        signedInUser,
        ADMIN_PHONE_NUMBER,
        verifier
      );
    } else {
      try {
        confirmation = await linkWithPhoneNumber(
          signedInUser,
          ADMIN_PHONE_NUMBER,
          verifier
        );
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        if (code === 'auth/provider-already-linked') {
          confirmation = await reauthenticateWithPhoneNumber(
            signedInUser,
            ADMIN_PHONE_NUMBER,
            verifier
          );
        } else if (code === 'auth/credential-already-in-use') {
          confirmation = await signInWithPhoneNumber(
            auth,
            ADMIN_PHONE_NUMBER,
            verifier
          );
        } else {
          throw err;
        }
      }
    }

    confirmationRef.current = confirmation;
    setOtpSecondsLeft(OTP_EXPIRY_SECONDS);
    setOtpCode('');
    setStep('otp');
    setInfoMessage(`A 6-digit verification code was sent to ${ADMIN_PHONE_NUMBER}.`);
  };

  const isPasswordLocked = pwLockoutUntil > now;
  const isOtpLocked = otpLockoutUntil > now;
  const isAnyLockout = isPasswordLocked || isOtpLocked;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (isAnyLockout) return;

    if (!email.trim() || !password) {
      setErrorMessage('Enter both your admin email and password.');
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      setFailedPasswordAttempts(0);

      // Step 2: Trigger Firebase Phone OTP 2FA
      try {
        await sendOtpToAdminPhone(cred.user);
      } catch (otpErr: unknown) {
        await signOut(auth);
        const code = (otpErr as { code?: string })?.code || '';
        const msg =
          otpErr instanceof Error ? otpErr.message : 'Unable to send Phone OTP.';
        if (
          code === 'auth/operation-not-allowed' ||
          code === 'auth/billing-not-enabled'
        ) {
          setErrorMessage(
            'Phone Authentication is not enabled in Firebase Console yet. Enable Email/Password and Phone Sign-in in Firebase Console → Authentication → Sign-in method (or configure +8801720266825 as a test phone number).'
          );
        } else {
          setErrorMessage(`2FA OTP error: ${msg}`);
        }
      }
    } catch (err: unknown) {
      const nextFails = failedPasswordAttempts + 1;
      setFailedPasswordAttempts(nextFails);

      if (nextFails >= MAX_PASSWORD_ATTEMPTS) {
        const until = Date.now() + PASSWORD_LOCKOUT_MS;
        setPwLockoutUntil(until);
        try {
          localStorage.setItem(PW_LOCKOUT_KEY, String(until));
        } catch {
          // ignore
        }
        setErrorMessage(
          'Too many failed login attempts. Login is disabled for 15 minutes.'
        );
      } else {
        const remaining = MAX_PASSWORD_ATTEMPTS - nextFails;
        const code = (err as { code?: string })?.code || '';
        const detail =
          code === 'auth/operation-not-allowed'
            ? 'Email/Password sign-in is disabled in Firebase Console. '
            : '';
        setErrorMessage(
          `${detail}Invalid credentials. ${remaining} ${
            remaining === 1 ? 'attempt' : 'attempts'
          } remaining.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isOtpLocked) return;

    if (otpSecondsLeft <= 0) {
      setErrorMessage('This verification code has expired. Please request a new code.');
      return;
    }

    if (!confirmationRef.current) {
      setErrorMessage('Verification session expired. Please sign in again.');
      setStep('password');
      return;
    }

    const cleanedCode = otpCode.replace(/\D/g, '');
    if (cleanedCode.length !== 6) {
      setErrorMessage('Enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await confirmationRef.current.confirm(cleanedCode);
      setFailedOtpAttempts(0);
      setOtpVerified(true);
      navigate('/inan1422008admin/dashboard', { replace: true });
    } catch {
      const nextOtpFails = failedOtpAttempts + 1;
      setFailedOtpAttempts(nextOtpFails);

      if (nextOtpFails >= MAX_OTP_ATTEMPTS) {
        const until = Date.now() + OTP_LOCKOUT_MS;
        setOtpLockoutUntil(until);
        try {
          localStorage.setItem(OTP_LOCKOUT_KEY, String(until));
        } catch {
          // ignore
        }
        await signOut(auth);
        setOtpVerified(false);
        setStep('password');
        setErrorMessage(
          '3 failed OTP attempts. Full security lockout active for 30 minutes.'
        );
      } else {
        const remaining = MAX_OTP_ATTEMPTS - nextOtpFails;
        setErrorMessage(
          `Incorrect verification code. ${remaining} ${
            remaining === 1 ? 'attempt' : 'attempts'
          } remaining before lockout.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpSecondsLeft > 0 || isOtpLocked || !auth.currentUser) return;
    setErrorMessage('');
    setInfoMessage('');
    setLoading(true);
    try {
      await sendOtpToAdminPhone(auth.currentUser);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C2440] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[24px] bg-white border border-[#E5E1D8] p-8 sm:p-10 space-y-7 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="flex justify-center pb-2">
            <NivantoLogoLockup variant="primary" size="md" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[#1C2440]">
            {step === 'password' ? 'Admin Access' : 'Two-Factor Verification'}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {step === 'password'
              ? 'Authorized Nivanto operators only.'
              : `Enter the 6-digit OTP sent to ${ADMIN_PHONE_NUMBER}`}
          </p>
        </div>

        {/* Active Lockout Banner */}
        {isOtpLocked ? (
          <div
            role="alert"
            className="rounded-[16px] bg-[#DC2626]/10 border border-[#DC2626]/25 p-5 text-center space-y-2"
          >
            <Lock className="w-6 h-6 text-[#DC2626] mx-auto" />
            <p className="font-display font-bold text-sm text-[#DC2626]">
              30-Minute Security Lockout Active
            </p>
            <p className="text-xs text-[#6B7280]">
              Too many failed OTP attempts. Try again in{' '}
              <span className="font-mono font-bold text-[#1C2440] tabular-nums">
                {formatCountdown(otpLockoutUntil - now)}
              </span>
            </p>
          </div>
        ) : isPasswordLocked ? (
          <div
            role="alert"
            className="rounded-[16px] bg-[#DC2626]/10 border border-[#DC2626]/25 p-5 text-center space-y-2"
          >
            <Lock className="w-6 h-6 text-[#DC2626] mx-auto" />
            <p className="font-display font-bold text-sm text-[#DC2626]">
              Login Temporarily Disabled
            </p>
            <p className="text-xs text-[#6B7280]">
              5 failed login attempts reached. Try again in{' '}
              <span className="font-mono font-bold text-[#1C2440] tabular-nums">
                {formatCountdown(pwLockoutUntil - now)}
              </span>
            </p>
          </div>
        ) : null}

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[#1C2440] mb-1.5"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                disabled={isAnyLockout || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nivanto.com"
                className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] focus:outline-none focus:border-[#2B5FAA] disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#1C2440] mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                disabled={isAnyLockout || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm text-[#1C2440] focus:outline-none focus:border-[#2B5FAA] disabled:opacity-50"
              />
            </div>

            {failedPasswordAttempts > 0 && !isPasswordLocked && (
              <p className="text-xs font-semibold text-[#E8900A] tabular-nums">
                {MAX_PASSWORD_ATTEMPTS - failedPasswordAttempts} attempts remaining
              </p>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 text-xs text-[#DC2626] bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-[12px] p-3.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAnyLockout || loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Verifying...' : 'Continue to 2FA'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4" noValidate>
            {infoMessage && (
              <p className="text-xs text-[#2B5FAA] bg-[#2B5FAA]/8 border border-[#2B5FAA]/20 rounded-[12px] p-3">
                {infoMessage}
              </p>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-otp"
                  className="block text-xs font-semibold text-[#1C2440]"
                >
                  6-Digit Verification Code
                </label>
                <span className="text-xs font-mono font-semibold text-[#6B7280] tabular-nums">
                  {otpSecondsLeft > 0 ? `${otpSecondsLeft}s` : 'Expired'}
                </span>
              </div>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                disabled={isOtpLocked || loading}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-3.5 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-center font-mono text-xl tracking-[0.4em] text-[#1C2440] focus:outline-none focus:border-[#2B5FAA] disabled:opacity-50"
              />
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 text-xs text-[#DC2626] bg-[#DC2626]/5 border border-[#DC2626]/20 rounded-[12px] p-3.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isOtpLocked || loading || otpSecondsLeft <= 0}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Confirming Code...' : 'Verify & Open Dashboard'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={async () => {
                  await signOut(auth);
                  setStep('password');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className="text-xs text-[#6B7280] hover:text-[#1C2440]"
              >
                Back to login
              </button>

              <button
                type="button"
                disabled={otpSecondsLeft > 0 || loading || isOtpLocked}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2B5FAA] disabled:text-[#6B7280]/50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {otpSecondsLeft > 0 ? `Resend in ${otpSecondsLeft}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Invisible reCAPTCHA mount target */}
        <div ref={recaptchaContainerRef} id="recaptcha-container" />
      </div>
    </div>
  );
}
