import { Bug } from '@/lib/types';

interface StatsCardsProps {
  bugs: Bug[];
}

export default function StatsCards({ bugs }: StatsCardsProps) {
  const total = bugs.length;
  const notFixed = bugs.filter((b) => b.status === 'Not Fixed').length;
  const inProgress = bugs.filter((b) => b.status === 'Under Process').length;
  const devFixed = bugs.filter((b) => b.status === 'Developer Fixed').length;
  const fixed = bugs.filter((b) => b.status === 'Fixed').length;

  const cards = [
    {
      label: 'Total Bugs',
      value: total,
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: '🐛',
    },
    {
      label: 'Not Fixed',
      value: notFixed,
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: '🔴',
    },
    {
      label: 'Under Process',
      value: inProgress,
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: '🟡',
    },
    {
      label: 'Developer Fixed',
      value: devFixed,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: '🔵',
    },
    {
      label: 'Fixed',
      value: fixed,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '✅',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-4 flex items-center gap-3`}
        >
          <span className="text-2xl">{card.icon}</span>
          <div>
            <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
