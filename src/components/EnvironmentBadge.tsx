import { Environment } from '@/lib/types';

interface EnvironmentBadgeProps {
  environment: Environment;
  size?: 'sm' | 'md';
}

const config: Record<Environment, { classes: string; dot: string }> = {
  UAT:  { classes: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  Live: { classes: 'bg-rose-50 text-rose-700 border-rose-200',       dot: 'bg-rose-500'   },
  Demo: { classes: 'bg-cyan-50 text-cyan-700 border-cyan-200',       dot: 'bg-cyan-500'   },
  Test: { classes: 'bg-slate-50 text-slate-600 border-slate-200',    dot: 'bg-slate-400'  },
};

export default function EnvironmentBadge({ environment, size = 'md' }: EnvironmentBadgeProps) {
  const { classes, dot } = config[environment];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border whitespace-nowrap ${classes} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {environment}
    </span>
  );
}
