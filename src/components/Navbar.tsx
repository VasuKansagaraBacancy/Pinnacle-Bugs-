'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAlertOctagon, FiPlus, FiHome, FiAward, FiLink } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700 hover:text-white';

  const mobileActive = (href: string) =>
    pathname === href ? 'text-blue-600' : 'text-gray-400';

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
      </div>
    </nav>
  );
}
