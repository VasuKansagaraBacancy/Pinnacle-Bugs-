'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiRefreshCw, FiAward } from 'react-icons/fi';
import { fetchBugs } from '@/services/bugService';
import { computeLeaderboard, AssigneeStats, BADGE_TIERS, RANK_CONFIG } from '@/lib/badges';
import { Bug } from '@/lib/types';

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}

function PodiumCard({ stats, bugs }: { stats: AssigneeStats; bugs: Bug[] }) {
  const rank = RANK_CONFIG[stats.rank];
  const podiumHeight = stats.rank === 1 ? 'h-24' : stats.rank === 2 ? 'h-16' : 'h-10';
  const cardScale = stats.rank === 1 ? 'scale-105' : '';

  return (
    <div className={`flex flex-col items-center gap-2 ${cardScale} transition-transform`}>
      {/* Avatar */}
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ${rank?.ring ?? ''}`}
        >
          {stats.assignee[0]}
        </div>
        {rank && (
          <span className="absolute -top-2 -right-2 text-2xl leading-none">{rank.emoji}</span>
        )}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xl leading-none">
          {stats.badge.emoji}
        </span>
      </div>

      <div className="text-center">
        <p className="font-bold text-gray-800 text-sm">{stats.assignee}</p>
        <p className="text-xs text-gray-500">{stats.fixed} fixed</p>
      </div>

      {/* Podium block */}
      <div
        className={`w-20 ${podiumHeight} rounded-t-lg flex items-center justify-center font-bold text-white text-lg shadow-md ${
          stats.rank === 1
            ? 'bg-gradient-to-b from-yellow-400 to-yellow-500'
            : stats.rank === 2
            ? 'bg-gradient-to-b from-gray-300 to-gray-400'
            : 'bg-gradient-to-b from-orange-300 to-orange-400'
        }`}
      >
        {stats.rank}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBugs(await fetchBugs());
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const leaderboard = computeLeaderboard(bugs);
  const top3 = leaderboard.filter((s) => s.rank >= 1 && s.rank <= 3);
  const rest = leaderboard.filter((s) => s.rank > 3 || s.rank === 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiAward className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Top bug fixers ranked by QA-verified fixes.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading leaderboard...</p>
        </div>
      ) : (
        <>
          {/* ── Podium (top 3) ─────────────────────────────────── */}
          {top3.length > 0 && (
            <div className="bg-gradient-to-b from-blue-800 to-blue-600 rounded-2xl p-6 sm:p-8">
              <p className="text-center text-blue-200 text-sm font-medium mb-6 tracking-wide uppercase">
                Hall of Fame
              </p>
              <div className="flex items-end justify-center gap-4 sm:gap-8">
                {/* Reorder: 2nd, 1st, 3rd for visual podium */}
                {[
                  top3.find((s) => s.rank === 2),
                  top3.find((s) => s.rank === 1),
                  top3.find((s) => s.rank === 3),
                ]
                  .filter(Boolean)
                  .map((s) => (
                    <PodiumCard key={s!.assignee} stats={s!} bugs={bugs} />
                  ))}
              </div>
            </div>
          )}

          {/* ── Full Ranking Table ─────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Full Rankings</h2>
              <span className="text-xs text-gray-400">{leaderboard.length} members</span>
            </div>

            <div className="divide-y divide-gray-100">
              {leaderboard.map((stats, idx) => {
                const rankInfo = RANK_CONFIG[stats.rank];
                return (
                  <div
                    key={stats.assignee}
                    className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 ${
                      idx === 0 ? 'bg-yellow-50/60' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {rankInfo ? (
                        <span className="text-2xl">{rankInfo.emoji}</span>
                      ) : (
                        <span className="text-sm font-bold text-gray-400">
                          {stats.rank > 0 ? `#${stats.rank}` : '—'}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                      {stats.assignee[0]}
                    </div>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{stats.assignee}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${stats.badge.bg} ${stats.badge.color} ${stats.badge.border}`}
                        >
                          {stats.badge.emoji} {stats.badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{stats.badge.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                      <StatPill label="Fixed" value={stats.fixed} color="text-green-600" />
                      <StatPill label="Dev Done" value={stats.devFixed} color="text-blue-600" />
                      <StatPill label="WIP" value={stats.inProgress} color="text-yellow-600" />
                      <StatPill label="Open" value={stats.notFixed} color="text-red-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Badge Legend ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <h2 className="font-bold text-gray-800 mb-4">Badge Tiers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGE_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${tier.bg} ${tier.border}`}
                >
                  <span className="text-2xl flex-shrink-0">{tier.emoji}</span>
                  <div>
                    <p className={`font-semibold text-sm ${tier.color}`}>{tier.label}</p>
                    <p className="text-xs text-gray-500">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
