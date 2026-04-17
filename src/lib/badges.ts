import { Bug, Assignee, ASSIGNEES } from './types';

export interface BadgeTier {
  id: string;
  label: string;
  emoji: string;
  minFixed: number;
  color: string;        // Tailwind text color
  bg: string;           // Tailwind bg color
  border: string;       // Tailwind border color
  description: string;
}

export const BADGE_TIERS: BadgeTier[] = [
  {
    id: 'legend',
    label: 'Legend',
    emoji: '👑',
    minFixed: 75,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    description: '75%+ fix ratio',
  },
  {
    id: 'expert',
    label: 'Expert',
    emoji: '💎',
    minFixed: 50,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    description: '50%+ fix ratio',
  },
  {
    id: 'pro',
    label: 'Pro Fixer',
    emoji: '🔥',
    minFixed: 25,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    description: '25%+ fix ratio',
  },
  {
    id: 'starter',
    label: 'Rising Star',
    emoji: '⭐',
    minFixed: 1,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    description: 'At least 1 fix',
  },
  {
    id: 'newcomer',
    label: 'Newcomer',
    emoji: '🌱',
    minFixed: 0,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    description: 'No fixes yet',
  },
];

export interface AssigneeStats {
  assignee: Assignee;
  fixed: number;
  devFixed: number;
  inProgress: number;
  notFixed: number;
  total: number;
  ratio: number; // fix ratio: (fixed / total) * 100, rounded to 1 decimal
  badge: BadgeTier;
  rank: number; // 1-based, among those with at least 1 bug assigned
}

/** Used in BugTable inline assignee display (raw fixed count). */
export function getBadgeForCount(fixed: number): BadgeTier {
  // Keep original count-based thresholds for inline table use
  const countTiers = [20, 10, 5, 1, 0];
  const idx = countTiers.findIndex((min) => fixed >= min);
  return BADGE_TIERS[idx] ?? BADGE_TIERS[BADGE_TIERS.length - 1];
}

/** Used on the leaderboard (ratio-based). */
export function getBadgeForRatio(ratio: number): BadgeTier {
  return BADGE_TIERS.find((t) => ratio >= t.minFixed) ?? BADGE_TIERS[BADGE_TIERS.length - 1];
}

export function computeLeaderboard(bugs: Bug[]): AssigneeStats[] {
  const stats: AssigneeStats[] = ASSIGNEES.map((assignee) => {
    // Exclude Improvement items — they are not bugs and don't count toward the leaderboard
    const mine = bugs.filter((b) => b.assignee === assignee && b.status !== 'Improvement');
    const fixed = mine.filter((b) => b.status === 'Fixed').length;
    const total = mine.length;
    const ratio = total > 0 ? Math.round((fixed / total) * 1000) / 10 : 0;
    return {
      assignee,
      fixed,
      devFixed: mine.filter((b) => b.status === 'Developer Fixed').length,
      inProgress: mine.filter((b) => b.status === 'Under Process').length,
      notFixed: mine.filter((b) => b.status === 'Not Fixed').length,
      total,
      ratio,
      badge: getBadgeForRatio(ratio),
      rank: 0,
    };
  });

  // Sort by ratio desc, then by fixed count as tiebreaker
  stats.sort((a, b) => b.ratio - a.ratio || b.fixed - a.fixed);

  // Assign ranks (only for those with at least 1 bug assigned)
  let rank = 1;
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].total === 0) {
      stats[i].rank = 0;
    } else {
      if (i > 0 && stats[i].ratio === stats[i - 1].ratio) {
        stats[i].rank = stats[i - 1].rank; // tied rank
      } else {
        stats[i].rank = rank;
      }
      rank++;
    }
  }

  return stats;
}

export const RANK_CONFIG: Record<number, { emoji: string; label: string; ring: string }> = {
  1: { emoji: '🥇', label: '1st Place', ring: 'ring-2 ring-yellow-400' },
  2: { emoji: '🥈', label: '2nd Place', ring: 'ring-2 ring-gray-400' },
  3: { emoji: '🥉', label: '3rd Place', ring: 'ring-2 ring-orange-400' },
};
