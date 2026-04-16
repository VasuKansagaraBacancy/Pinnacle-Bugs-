'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertOctagon, FiMail, FiLock, FiAlertCircle, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/lib/auth-context';

/* ── Dripping blood drops along the top ─────────────── */
const DRIPS = [
  { left: '5%',  delay: '0s',   width: 3, height: 55, dropSize: 6 },
  { left: '12%', delay: '0.6s', width: 4, height: 70, dropSize: 8 },
  { left: '21%', delay: '1.2s', width: 2, height: 40, dropSize: 5 },
  { left: '34%', delay: '0.3s', width: 4, height: 65, dropSize: 7 },
  { left: '46%', delay: '1.8s', width: 3, height: 50, dropSize: 6 },
  { left: '58%', delay: '0.9s', width: 5, height: 75, dropSize: 9 },
  { left: '69%', delay: '0.4s', width: 3, height: 45, dropSize: 6 },
  { left: '79%', delay: '1.5s', width: 4, height: 60, dropSize: 7 },
  { left: '88%', delay: '0.7s', width: 2, height: 38, dropSize: 5 },
  { left: '94%', delay: '1.1s', width: 3, height: 55, dropSize: 6 },
];

/* ── Big floating ghost silhouettes ─────────────────── */
function GhostSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor">
      <path d="M50 0 C22 0 5 20 5 50 L5 120 L20 105 L35 120 L50 105 L65 120 L80 105 L95 120 L95 50 C95 20 78 0 50 0Z" />
      <circle cx="35" cy="45" r="7" fill="#000" />
      <circle cx="65" cy="45" r="7" fill="#000" />
    </svg>
  );
}

/* ── Spider web SVG in corners ───────────────────────── */
function SpiderWeb({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-48 h-48 text-red-900/40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Radial lines */}
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <line
          key={deg}
          x1="0" y1="0"
          x2={Math.cos((deg * Math.PI) / 180) * 200}
          y2={Math.sin((deg * Math.PI) / 180) * 200}
        />
      ))}
      {/* Arcs */}
      {[30, 60, 90, 120, 160].map((r) => (
        <path key={r} d={`M ${r} 0 Q ${r * 0.7} ${r * 0.7} 0 ${r}`} />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a0000 0%, #0d0000 50%, #000000 100%)' }}
    >
      {/* ── Blood drips along top ───────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-700 z-20">
        {DRIPS.map((d, i) => (
          <div key={i} className="absolute top-0" style={{ left: d.left }}>
            <div
              className="horror-drip bg-red-700 rounded-b-full"
              style={{
                width: d.width,
                animationDelay: d.delay,
                animationDuration: `${2 + i * 0.3}s`,
                animationIterationCount: 'infinite',
              }}
            />
            <div
              className="horror-drip-drop bg-red-700 rounded-full mx-auto"
              style={{
                width: d.dropSize,
                height: d.dropSize,
                marginTop: d.height - 10,
                animationDelay: `calc(${d.delay} + 2s)`,
                animationIterationCount: 'infinite',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Fog layers ─────────────────────────────────── */}
      <div
        className="horror-fog1 absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '35%',
          background: 'linear-gradient(to top, rgba(80,0,0,0.22) 0%, transparent 100%)',
          filter: 'blur(18px)',
        }}
      />
      <div
        className="horror-fog2 absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '25%',
          background: 'linear-gradient(to top, rgba(120,0,0,0.15) 0%, transparent 100%)',
          filter: 'blur(24px)',
        }}
      />

      {/* ── Floating ghosts ────────────────────────────── */}
      <GhostSVG className="horror-ghost1 absolute left-[6%] top-[15%] w-32 h-32 text-red-900/10 pointer-events-none" />
      <GhostSVG className="horror-ghost2 absolute right-[8%] top-[20%] w-24 h-24 text-red-900/8 pointer-events-none" />
      <GhostSVG className="horror-ghost1 absolute left-[60%] bottom-[12%] w-20 h-20 text-red-900/6 pointer-events-none" />

      {/* ── Spider webs in corners ──────────────────────── */}
      <div className="absolute top-0 left-0 pointer-events-none z-10"><SpiderWeb /></div>
      <div className="absolute top-0 right-0 pointer-events-none z-10"><SpiderWeb flip /></div>

      {/* ── Spinning pentagram/circle glow ─────────────── */}
      <div
        className="horror-spin absolute pointer-events-none opacity-5"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid #ef4444',
          boxShadow: '0 0 40px 10px #7f1d1d inset',
        }}
      />

      {/* ── Red ambient glow spots ──────────────────────── */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none horror-pulse"
        style={{ background: 'radial-gradient(circle, rgba(127,0,0,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full pointer-events-none horror-pulse"
        style={{ background: 'radial-gradient(circle, rgba(127,0,0,0.12) 0%, transparent 70%)', animationDelay: '1.2s' }} />

      {/* ── Login card ──────────────────────────────────── */}
      <div className="relative z-30 w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-7 horror-flicker">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 horror-eye-glow"
            style={{ background: 'linear-gradient(135deg, #7f1d1d, #450a0a)' }}
          >
            <FiAlertOctagon className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-100 tracking-wide drop-shadow-lg">
            Pinnacle Bug Reporting
          </h1>
          <p className="text-red-400/70 text-sm mt-1">Enter if you dare… @bacancy.com only</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border border-red-900/60 shadow-2xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(160deg, rgba(20,0,0,0.97) 0%, rgba(10,0,0,0.99) 100%)',
            boxShadow: '0 0 60px rgba(127,0,0,0.25), 0 25px 50px rgba(0,0,0,0.8)',
          }}
        >
          <h2 className="text-lg font-bold text-red-100 mb-6 horror-flicker">Welcome back… 👁️</h2>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/60 border border-red-700/60 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-red-300/80 mb-1.5">Work Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@bacancy.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-red-100 placeholder-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 border border-red-900/50"
                  style={{ background: 'rgba(40,0,0,0.6)' }}
                />
              </div>
              <p className="text-[11px] text-red-900 mt-1">Only @bacancy.com souls are permitted</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-red-300/80 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-red-100 placeholder-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 border border-red-900/50"
                  style={{ background: 'rgba(40,0,0,0.6)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 font-bold rounded-xl text-sm transition-all mt-2 disabled:opacity-50 text-white border border-red-800"
              style={{
                background: 'linear-gradient(135deg, #7f1d1d, #450a0a)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(185,28,28,0.4)',
              }}
            >
              {loading
                ? <><FiLoader className="w-4 h-4 animate-spin" /> Entering the darkness...</>
                : '🩸 Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-red-900 mt-6">
            No account yet?{' '}
            <Link href="/register" className="text-red-500 font-semibold hover:text-red-300 transition-colors">
              Register your soul
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
