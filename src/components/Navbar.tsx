'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAlertOctagon, FiPlus, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white';

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <FiAlertOctagon className="w-6 h-6" />
            <span>Pinnacle Bug Reporting</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
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
        </div>
      </div>
    </nav>
  );
}
