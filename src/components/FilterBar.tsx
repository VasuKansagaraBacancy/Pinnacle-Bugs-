'use client';

import { BugStatus, STATUSES, Assignee, ASSIGNEES } from '@/lib/types';
import { FiFilter, FiUser, FiCalendar, FiX } from 'react-icons/fi';

export interface FilterState {
  status: BugStatus | 'All';
  assignee: Assignee | 'All';
  sortOrder: 'desc' | 'asc';
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  total: number;
  filtered: number;
}

export default function FilterBar({ filters, onChange, total, filtered }: FilterBarProps) {
  const hasActiveFilters = filters.status !== 'All' || filters.assignee !== 'All';

  const reset = () =>
    onChange({ status: 'All', assignee: 'All', sortOrder: filters.sortOrder });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
      {/* Status filter */}
      <div className="flex items-center gap-2">
        <FiFilter className="w-4 h-4 text-gray-400" />
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as BugStatus | 'All' })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee filter */}
      <div className="flex items-center gap-2">
        <FiUser className="w-4 h-4 text-gray-400" />
        <select
          value={filters.assignee}
          onChange={(e) => onChange({ ...filters, assignee: e.target.value as Assignee | 'All' })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Assignees</option>
          {ASSIGNEES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-gray-400" />
        <select
          value={filters.sortOrder}
          onChange={(e) => onChange({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={reset}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <FiX className="w-4 h-4" />
          Clear filters
        </button>
      )}

      {/* Count */}
      <div className="ml-auto text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-800">{filtered}</span> of{' '}
        <span className="font-semibold text-gray-800">{total}</span> bugs
      </div>
    </div>
  );
}
