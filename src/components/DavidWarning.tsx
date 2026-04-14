'use client';

import { useState } from 'react';
import { Bug } from '@/lib/types';

interface DavidWarningProps {
  bugs: Bug[];
}

export default function DavidWarning({ bugs }: DavidWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  const openBugs = bugs.filter((b) => b.status === 'Not Fixed').length;
  const inProgress = bugs.filter((b) => b.status === 'Under Process').length;
  const total = openBugs + inProgress;

  if (total === 0 || dismissed) return null;

  return (
    <div className="relative flex items-center gap-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 shadow-md overflow-hidden">
      {/* David avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-red-400 shadow-lg relative z-10 bg-red-100 flex items-center justify-center text-4xl">
          👨‍🦲
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-20 text-[10px]">
          {openBugs}
        </span>
      </div>

      {/* Message */}
      <div className="flex-1 relative z-10 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full bg-yellow-500">
            David Alert
          </span>
          <span className="text-xs text-red-400 font-medium">
            {openBugs} open · {inProgress} in progress
          </span>
        </div>
        <p className="text-sm font-bold text-red-700 mt-1 leading-snug">
          Jaldi fix karo warna David aa jayega! 😤
        </p>
        <p className="text-xs text-red-400 mt-0.5 hidden sm:block">
          Fix karo sabse pehle warna David personally review karne aayega 😬
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="relative z-10 flex-shrink-0 text-red-300 hover:text-red-500 transition-colors text-lg font-bold leading-none"
        title="Dismiss (bugs won't disappear though 😅)"
      >
        ×
      </button>
    </div>
  );
}
