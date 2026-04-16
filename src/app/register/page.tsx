'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertOctagon, FiMail, FiLock, FiAlertCircle, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/lib/auth-context';

const DRIPS = [
  { left: '4%',  h: 70,  dur: '3.5s', delay: '0s'   },
  { left: '14%', h: 50,  dur: '4.2s', delay: '0.6s'  },
  { left: '26%', h: 90,  dur: '3.8s', delay: '1.3s'  },
  { left: '37%', h: 55,  dur: '5.1s', delay: '0.2s'  },
  { left: '49%', h: 75,  dur: '3.4s', delay: '1.9s'  },
  { left: '60%', h: 40,  dur: '4.6s', delay: '0.8s'  },
  { left: '71%', h: 95,  dur: '3.1s', delay: '2.2s'  },
  { left: '82%', h: 65,  dur: '4.9s', delay: '0.4s'  },
  { left: '92%', h: 80,  dur: '3.6s', delay: '1.1s'  },
];

const DOTS = [
  { top: '20%', left: '10%', size: 4, delay: '0.2s' },
  { top: '40%', left: '90%', size: 3, delay: '1.1s' },
  { top: '60%', left: '5%',  size: 5, delay: '2.1s' },
  { top: '75%', left: '93%', size: 3, delay: '0.7s' },
  { top: '85%', left: '22%', size: 4, delay: '1.6s' },
  { top: '30%', left: '78%', size: 3, delay: '2.8s' },
];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.needsConfirmation) {
      setNeedsConfirmation(true);
      setLoading(false);
    } else {
      router.replace('/');
    }
  };

  /* ── Confirmation screen ── */
  if (needsConfirmation) {
    return (
      <>
        <div className="fixed inset-0" style={{ background: '#060406', zIndex: 0 }}>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 85%, rgba(139,0,0,0.4) 0%, transparent 70%)',
          }} />
        </div>
        <div className="relative min-h-screen flex items-center justify-center py-8 px-4" style={{ zIndex: 10 }}>
          <div className="w-full max-w-md text-center horror-card p-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 horror-eye-glow"
              style={{ background: 'linear-gradient(135deg, #2a0000, #0e0008)', border: '1.5px solid #6b0000' }}
            >
              <span style={{ fontSize: '1.75rem' }}>📜</span>
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: '#f0e0e0' }}>
              Check Your Inbox
            </h2>
            <p className="text-sm mb-6" style={{ color: '#7a4a4a' }}>
              A dark scroll was dispatched to{' '}
              <span className="font-semibold" style={{ color: '#c08080' }}>{email}</span>.
              <br />Click the link within to activate your soul.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 text-sm font-bold rounded-xl horror-btn"
            >
              🩸 Return to the Gate
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Full-screen horror backdrop ── */}
      <div className="fixed inset-0 overflow-hidden" style={{ background: '#060406', zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 85%, rgba(139,0,0,0.5) 0%, rgba(80,0,0,0.18) 50%, transparent 75%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }} />

        {/* Spider web — top left */}
        <svg className="absolute top-0 left-0 w-56 h-56 opacity-30" viewBox="0 0 220 220" fill="none">
          <path d="M0 0 L90 65 L60 110 L120 165" stroke="#8b0000" strokeWidth="1.3" />
          <path d="M60 110 L28 135 L60 160" stroke="#8b0000" strokeWidth="1" />
          <path d="M90 65 L115 50 L102 88" stroke="#8b0000" strokeWidth="0.9" />
          <path d="M0 45 L68 72" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M35 0 L72 60" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M18 18 Q50 35 80 22" stroke="#4a0000" strokeWidth="0.5" fill="none" />
          <path d="M8 42 Q55 58 98 42" stroke="#4a0000" strokeWidth="0.5" fill="none" />
          <path d="M3 70 Q58 84 105 68" stroke="#4a0000" strokeWidth="0.4" fill="none" />
        </svg>

        {/* Spider web — top right */}
        <svg className="absolute top-0 right-0 w-48 h-48 opacity-20" viewBox="0 0 220 220" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M0 0 L90 65 L60 110 L120 165" stroke="#8b0000" strokeWidth="1.3" />
          <path d="M60 110 L28 135 L60 160" stroke="#8b0000" strokeWidth="1" />
          <path d="M90 65 L115 50 L102 88" stroke="#8b0000" strokeWidth="0.9" />
          <path d="M0 45 L68 72" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M18 18 Q50 35 80 22" stroke="#4a0000" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Blood drips */}
        {DRIPS.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', top: 0, left: d.left, width: '3px',
              borderRadius: '0 0 3px 3px',
              background: 'linear-gradient(to bottom, #6b0000, #cc0000)',
              animationName: 'drip',
              animationDuration: d.dur,
              animationDelay: d.delay,
              animationTimingFunction: 'ease-in',
              animationIterationCount: 'infinite',
              height: `${d.h}px`,
            }}
          />
        ))}

        {/* Floating dots */}
        {DOTS.map((dot, i) => (
          <div
            key={i}
            className="horror-dot absolute rounded-full"
            style={{
              top: dot.top, left: dot.left,
              width: dot.size, height: dot.size,
              background: '#dc143c',
              animationDelay: dot.delay,
              boxShadow: '0 0 5px rgba(220,20,60,0.7)',
            }}
          />
        ))}
      </div>

      {/* ── Page content ── */}
      <div className="relative min-h-screen flex items-center justify-center py-8 px-4" style={{ zIndex: 10 }}>
        <div className="w-full max-w-md">

          {/* Brand header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 horror-heartbeat horror-eye-glow"
              style={{ background: 'linear-gradient(135deg, #3d0000, #1a0000)', border: '1.5px solid #6b0000' }}
            >
              <FiAlertOctagon className="w-8 h-8" style={{ color: '#ff4040' }} />
            </div>
            <h1 className="text-2xl font-bold mb-2 horror-flicker" style={{ color: '#f0e0e0' }}>
              Pinnacle Bug Reporting
            </h1>
            <p style={{ color: '#7a4a4a', fontSize: '0.875rem' }}>
              Bind your soul... @bacancy.com only
            </p>
          </div>

          {/* Card */}
          <div className="horror-card p-7">
            <h2 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#d0b0b0' }}>
              Summon your account
              <span style={{ fontSize: '1rem' }}>🕯</span>
            </h2>

            {error && (
              <div
                className="flex items-start gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: 'rgba(139,0,0,0.25)', border: '1px solid #6b0000', color: '#ff8080' }}
              >
                <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9a6060' }}>
                  Work Email
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: '#7a2020' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@bacancy.com"
                    required
                    className="horror-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
                <p className="text-[11px] mt-1" style={{ color: '#5a2a2a' }}>
                  Only @bacancy.com souls are permitted
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9a6060' }}>
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: '#7a2020' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="horror-input"
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#7a2020' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#9a6060' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: '#7a2020' }}
                  />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="horror-input"
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#7a2020' }}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full horror-btn flex items-center justify-center gap-2 py-3 text-sm mt-2"
              >
                {loading ? (
                  <><FiLoader className="w-4 h-4 animate-spin" /> Summoning...</>
                ) : (
                  <><span>🩸</span> Create Account</>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#6a3a3a' }}>
              Already cursed?{' '}
              <Link href="/login" className="font-bold hover:underline" style={{ color: '#dc143c' }}>
                Enter the darkness
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
