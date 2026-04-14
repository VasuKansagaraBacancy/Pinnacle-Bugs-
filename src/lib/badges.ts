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
    minFixed: 20,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    description: 'Fixed 20+ bugs',
  },
  {
    id: 'expert',
    label: 'Expert',
    emoji: '💎',
    minFixed: 10,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    description: 'Fixed 10+ bugs',
  },
  {
    id: 'pro',
    label: 'Pro Fixer',
    emoji: '🔥',
    minFixed: 5,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    description: 'Fixed 5+ bugs',
  },
  {
    id: 'starter',
    label: 'Rising Star',
    emoji: '⭐',
    minFixed: 1,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    description: 'Fixed 1+ bugs',
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
  badge: BadgeTier;
  rank: number; // 1-based, among those with fixed > 0
}

export function getBadgeForCount(fixed: number): BadgeTier {
  return BADGE_TIERS.find((t) => fixed >= t.minFixed) ?? BADGE_TIERS[BADGE_TIERS.length - 1];
}

export function computeLeaderboard(bugs: Bug[]): AssigneeStats[] {
  const stats: AssigneeStats[] = ASSIGNEES.map((assignee) => {
    const mine = bugs.filter((b) => b.assignee === assignee);
    const fixed = mine.filter((b) => b.status === 'Fixed').length;
    return {
      assignee,
      fixed,
      devFixed: mine.filter((b) => b.status === 'Developer Fixed').length,
      inProgress: mine.filter((b) => b.status === 'Under Process').length,
      notFixed: mine.filter((b) => b.status === 'Not Fixed').length,
      total: mine.length,
      badge: getBadgeForCount(fixed),
      rank: 0,
    };
  });

  // Sort by fixed desc, then by total bugs assigned desc as tiebreaker
  stats.sort((a, b) => b.fixed - a.fixed || b.total - a.total);

  // Assign ranks (only for those who fixed at least 1)
  let rank = 1;
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].fixed === 0) {
      stats[i].rank = 0;
    } else {
      if (i > 0 && stats[i].fixed === stats[i - 1].fixed) {
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
