'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAlertOctagon, FiPlus, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700 hover:text-white';

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
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}
            >
              <FiHome className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/add-bug"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/add-bug')}`}
            >
              <FiPlus className="w-4 h-4" />
              Add Bug
            </Link>
          </div>

          {/* Mobile: Add Bug button only */}
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
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
            pathname === '/' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <FiHome className={`w-5 h-5 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} />
          Dashboard
        </Link>
        <Link
          href="/add-bug"
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
            pathname === '/add-bug' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center -mt-4 shadow-md ${
            pathname === '/add-bug' ? 'bg-blue-600' : 'bg-blue-600'
          }`}>
            <FiPlus className="w-5 h-5 text-white" />
          </div>
          <span className="mt-0.5">Add Bug</span>
        </Link>
      </div>
    </nav>
  );
}
