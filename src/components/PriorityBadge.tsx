import { Priority } from '@/lib/types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

const config: Record<Priority, { icon: string; classes: string }> = {
  High:   { icon: '🔴', classes: 'bg-red-50 text-red-700 border-red-200' },
  Medium: { icon: '🟡', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  Low:    { icon: '🟢', classes: 'bg-green-50 text-green-700 border-green-200' },
};

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const { icon, classes } = config[priority];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium border whitespace-nowrap ${classes} ${sizeClass}`}>
      <span className="text-[10px] leading-none">{icon}</span>
      {priority}
    </span>
  );
}
