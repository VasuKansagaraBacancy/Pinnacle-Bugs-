'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertOctagon, FiMail, FiLock, FiAlertCircle, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/lib/auth-context';

const DRIPS = [
  { left: '6%',  h: 55, dur: '3.2s', delay: '0s'   },
  { left: '16%', h: 80, dur: '4.1s', delay: '0.7s'  },
  { left: '27%', h: 40, dur: '3.6s', delay: '1.4s'  },
  { left: '38%', h: 100, dur: '5s',   delay: '0.3s'  },
  { left: '50%', h: 65, dur: '3.9s', delay: '1.8s'  },
  { left: '61%', h: 45, dur: '4.4s', delay: '0.9s'  },
  { left: '73%', h: 88, dur: '3.3s', delay: '2.1s'  },
  { left: '84%', h: 60, dur: '4.8s', delay: '0.5s'  },
  { left: '93%', h: 72, dur: '3.7s', delay: '1.2s'  },
];

const DOTS = [
  { top: '18%', left: '12%', size: 4, delay: '0s'   },
  { top: '35%', left: '88%', size: 3, delay: '1s'   },
  { top: '55%', left: '7%',  size: 5, delay: '2s'   },
  { top: '70%', left: '92%', size: 3, delay: '0.5s' },
  { top: '82%', left: '20%', size: 4, delay: '1.5s' },
  { top: '25%', left: '75%', size: 3, delay: '2.5s' },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.replace('/');
    }
  };

  return (
    <>
      {/* ── Full-screen horror backdrop ── */}
      <div className="fixed inset-0 overflow-hidden" style={{ background: '#060406', zIndex: 0 }}>

        {/* Central red radial glow from bottom */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 85%, rgba(139,0,0,0.5) 0%, rgba(80,0,0,0.18) 50%, transparent 75%)',
        }} />
        {/* Top subtle glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 35% at 50% 15%, rgba(100,0,0,0.1) 0%, transparent 60%)',
        }} />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }} />

        {/* Spider web — top left */}
        <svg className="absolute top-0 left-0 w-56 h-56 opacity-30" viewBox="0 0 220 220" fill="none">
          <path d="M0 0 L90 65 L60 110 L120 165" stroke="#8b0000" strokeWidth="1.3" />
          <path d="M60 110 L28 135 L60 160" stroke="#8b0000" strokeWidth="1" />
          <path d="M90 65 L115 50 L102 88" stroke="#8b0000" strokeWidth="0.9" />
          <path d="M0 45 L68 72" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M0 90 L50 100" stroke="#8b0000" strokeWidth="0.6" />
          <path d="M35 0 L72 60" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M68 0 L88 55" stroke="#8b0000" strokeWidth="0.5" />
          <path d="M18 18 Q50 35 80 22" stroke="#4a0000" strokeWidth="0.5" fill="none" />
          <path d="M8 42 Q55 58 98 42" stroke="#4a0000" strokeWidth="0.5" fill="none" />
          <path d="M3 70 Q58 84 105 68" stroke="#4a0000" strokeWidth="0.4" fill="none" />
          <path d="M1 100 Q55 112 105 96" stroke="#4a0000" strokeWidth="0.4" fill="none" />
        </svg>

        {/* Spider web — top right (mirrored) */}
        <svg className="absolute top-0 right-0 w-48 h-48 opacity-20" viewBox="0 0 220 220" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M0 0 L90 65 L60 110 L120 165" stroke="#8b0000" strokeWidth="1.3" />
          <path d="M60 110 L28 135 L60 160" stroke="#8b0000" strokeWidth="1" />
          <path d="M90 65 L115 50 L102 88" stroke="#8b0000" strokeWidth="0.9" />
          <path d="M0 45 L68 72" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M35 0 L72 60" stroke="#8b0000" strokeWidth="0.7" />
          <path d="M18 18 Q50 35 80 22" stroke="#4a0000" strokeWidth="0.5" fill="none" />
          <path d="M8 42 Q55 58 98 42" stroke="#4a0000" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Blood drips from top */}
        {DRIPS.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: d.left,
              width: '3px',
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

        {/* Floating blood dots */}
        {DOTS.map((dot, i) => (
          <div
            key={i}
            className="horror-dot absolute rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
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
              style={{
                background: 'linear-gradient(135deg, #3d0000, #1a0000)',
                border: '1.5px solid #6b0000',
              }}
            >
              <FiAlertOctagon className="w-8 h-8" style={{ color: '#ff4040' }} />
            </div>
            <h1
              className="text-2xl font-bold mb-2 horror-flicker"
              style={{ color: '#f0e0e0', letterSpacing: '0.01em' }}
            >
              Pinnacle Bug Reporting
            </h1>
            <p style={{ color: '#7a4a4a', fontSize: '0.875rem' }}>
              Enter if you dare... @bacancy.com only
            </p>
          </div>

          {/* Card */}
          <div className="horror-card p-7">
            <h2 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: '#d0b0b0' }}>
              Welcome back...
              <span style={{ fontSize: '1rem' }}>👁</span>
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
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full horror-btn flex items-center justify-center gap-2 py-3 text-sm mt-2"
              >
                {loading ? (
                  <><FiLoader className="w-4 h-4 animate-spin" /> Entering the void...</>
                ) : (
                  <><span>🩸</span> Sign In</>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#6a3a3a' }}>
              No account yet?{' '}
              <Link href="/register" className="font-bold hover:underline" style={{ color: '#dc143c' }}>
                Register your soul
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
