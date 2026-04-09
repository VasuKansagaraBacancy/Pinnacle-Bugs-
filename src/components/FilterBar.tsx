'use client';

import { useState } from 'react';
import { BugStatus, STATUSES, Assignee, ASSIGNEES } from '@/lib/types';
import { FiFilter, FiUser, FiCalendar, FiX, FiChevronDown } from 'react-icons/fi';

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
  const [open, setOpen] = useState(false);
  const hasActiveFilters = filters.status !== 'All' || filters.assignee !== 'All';

  const reset = () =>
    onChange({ status: 'All', assignee: 'All', sortOrder: filters.sortOrder });

  const activeCount = (filters.status !== 'All' ? 1 : 0) + (filters.assignee !== 'All' ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Mobile toggle header ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="sm:hidden w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {filtered}/{total} bugs
          </span>
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* ── Filter controls ──────────────────────────────────── */}
      {/* Mobile: collapsible; Desktop: always visible inline */}
      <div
        className={`
          sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:p-4
          ${open ? 'block border-t border-gray-100 p-4 space-y-3' : 'hidden sm:flex'}
        `}
      >
        {/* Status */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as BugStatus | 'All' })}
            className="flex-1 sm:flex-none text-sm border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filters.assignee}
            onChange={(e) => onChange({ ...filters, assignee: e.target.value as Assignee | 'All' })}
            className="flex-1 sm:flex-none text-sm border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Assignees</option>
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filters.sortOrder}
            onChange={(e) => onChange({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
            className="flex-1 sm:flex-none text-sm border border-gray-200 rounded-lg px-3 py-2 sm:py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Reset + count row on mobile */}
        <div className="flex items-center justify-between sm:contents">
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Clear filters
            </button>
          )}
          {/* Count — desktop only (mobile shows it in the toggle header) */}
          <div className="hidden sm:block sm:ml-auto text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered}</span> of{' '}
            <span className="font-semibold text-gray-800">{total}</span> bugs
          </div>
        </div>
      </div>
    </div>
  );
}
