import { BugStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: BugStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<BugStatus, { label: string; classes: string; dot: string }> = {
  'Not Fixed': {
    label: 'Not Fixed',
    classes: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  'Under Process': {
    label: 'Under Process',
    classes: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
  },
  Fixed: {
    label: 'Fixed',
    classes: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
