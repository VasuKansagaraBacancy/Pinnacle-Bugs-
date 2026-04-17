import { Bug, BugStatus } from '@/lib/types';

interface StatsCardsProps {
  bugs: Bug[];
  activeStatus: BugStatus | 'All';
  onFilter: (status: BugStatus | 'All') => void;
}

export default function StatsCards({ bugs, activeStatus, onFilter }: StatsCardsProps) {
  // Improvements are tracked separately and excluded from bug counts
  const bugsOnly = bugs.filter((b) => b.status !== 'Improvement');
  const total      = bugsOnly.length;
  const notFixed   = bugsOnly.filter((b) => b.status === 'Not Fixed').length;
  const inProgress = bugsOnly.filter((b) => b.status === 'Under Process').length;
  const devFixed   = bugsOnly.filter((b) => b.status === 'Developer Fixed').length;
  const fixed      = bugsOnly.filter((b) => b.status === 'Fixed').length;
  const readyForQA = bugsOnly.filter((b) => b.status === 'Ready for QA').length;
  const improvements = bugs.filter((b) => b.status === 'Improvement').length;

  const cards: { label: string; value: number; status: BugStatus | 'All'; bg: string; text: string; border: string; ring: string; icon: string }[] = [
    { label: 'Total',         value: total,        status: 'All',             bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-200',  ring: 'ring-gray-400',   icon: '🐛' },
    { label: 'Not Fixed',     value: notFixed,     status: 'Not Fixed',       bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',   ring: 'ring-red-500',    icon: '🔴' },
    { label: 'Under Process', value: inProgress,   status: 'Under Process',   bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200',ring: 'ring-yellow-500', icon: '🟡' },
    { label: 'Dev Fixed',     value: devFixed,     status: 'Developer Fixed', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',  ring: 'ring-blue-500',   icon: '🔵' },
    { label: 'Ready for QA',  value: readyForQA,   status: 'Ready for QA',    bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',ring: 'ring-purple-500', icon: '🟣' },
    { label: 'Fixed',         value: fixed,        status: 'Fixed',           bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200', ring: 'ring-green-500',  icon: '✅' },
    { label: 'Improvement',   value: improvements, status: 'Improvement',     bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',  ring: 'ring-teal-500',   icon: '✨' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
      {cards.map((card) => {
        const isActive = activeStatus === card.status;
        return (
          <button
            key={card.label}
            onClick={() => onFilter(isActive ? 'All' : card.status)}
            className={`${card.bg} ${card.border} border rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 w-full text-left transition-all
              ${isActive ? `ring-2 ${card.ring} shadow-md scale-[1.03]` : 'hover:shadow-sm hover:scale-[1.01]'}`}
          >
            <span className="text-xl sm:text-2xl">{card.icon}</span>
            <div className="min-w-0">
              <p className={`text-xl sm:text-2xl font-bold leading-none ${card.text}`}>{card.value}</p>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 truncate">{card.label}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
