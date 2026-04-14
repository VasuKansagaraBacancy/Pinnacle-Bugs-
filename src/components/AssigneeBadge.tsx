import { getBadgeForCount } from '@/lib/badges';

interface AssigneeBadgeProps {
  assignee: string;
  fixedCount: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function AssigneeBadge({
  assignee,
  fixedCount,
  showLabel = false,
  size = 'md',
}: AssigneeBadgeProps) {
  const badge = getBadgeForCount(fixedCount);
  const avatarSize = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${avatarSize} rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0`}
      >
        {assignee[0]}
      </span>
      <span className="font-medium">{assignee}</span>
      <span
        title={`${badge.label} — ${badge.description}`}
        className="text-base leading-none cursor-default"
      >
        {badge.emoji}
      </span>
      {showLabel && (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.color} ${badge.border}`}
        >
          {badge.label}
        </span>
      )}
    </span>
  );
}
