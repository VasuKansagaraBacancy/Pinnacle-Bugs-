'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiAlertOctagon, FiPlus, FiHome, FiAward, FiLink, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/lib/auth-context';

const AUTH_PATHS = ['/login', '/register', '/auth/callback'];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isActive = (href: string) =>
    pathname === href
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700 hover:text-white';

  const mobileActive = (href: string) =>
    pathname === href ? 'text-blue-600' : 'text-gray-400';

  // Hide navbar entirely on auth pages
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  // First letter of email for avatar
  const avatar = user?.email?.[0]?.toUpperCase() ?? '?';
  const emailLabel = user?.email?.split('@')[0] ?? '';

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold">
            <FiAlertOctagon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-base sm:text-xl leading-tight">
              <span className="sm:hidden">Pinnacle Bugs</span>
              <span className="hidden sm:inline">Pinnacle Bug Reporting</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>
              <FiHome className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/leaderboard" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/leaderboard')}`}>
              <FiAward className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link href="/links" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/links')}`}>
              <FiLink className="w-4 h-4" />
              Links
            </Link>
            <Link href="/add-bug" className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/add-bug')}`}>
              <FiPlus className="w-4 h-4" />
              Add Bug
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-blue-500/50 mx-1" />

            {/* User avatar + logout */}
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-white text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {avatar}
                </div>
                <span className="text-blue-100 text-sm font-medium">{emailLabel}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-red-500/20 hover:text-white transition-colors"
                title="Sign out"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile: Add Bug quick button */}
          <Link
            href="/add-bug"
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Bug
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${mobileActive('/')}`}
        >
          <FiHome className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          href="/leaderboard"
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${mobileActive('/leaderboard')}`}
        >
          <FiAward className="w-5 h-5" />
          Awards
        </Link>

        {/* Centre FAB — Add Bug */}
        <Link
          href="/add-bug"
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors relative"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center -mt-5 shadow-md bg-blue-600">
            <FiPlus className="w-5 h-5 text-white" />
          </div>
          <span className={`mt-0.5 ${mobileActive('/add-bug')}`}>Add Bug</span>
        </Link>

        <Link
          href="/links"
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${mobileActive('/links')}`}
        >
          <FiLink className="w-5 h-5" />
          Links
        </Link>

        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );
}
