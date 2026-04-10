'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { Bug, BugStatus, Assignee, Priority, Environment } from '@/lib/types';
import { fetchBugs, deleteBug } from '@/services/bugService';
import BugTable from '@/components/BugTable';
import FilterBar, { FilterState, defaultFilters } from '@/components/FilterBar';
import StatsCards from '@/components/StatsCards';

export default function DashboardPage() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const loadBugs = useCallback(async () => {
    setLoading(true);
    try {
      setBugs(await fetchBugs());
    } catch {
      toast.error('Failed to load bugs. Check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBugs(); }, [loadBugs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bug? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteBug(id);
      setBugs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Bug deleted successfully.');
    } catch {
      toast.error('Failed to delete the bug. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Inline update: replace the updated bug in local state
  const handleUpdate = useCallback((updated: Bug) => {
    setBugs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const filtered = bugs
    .filter((b) => filters.status      === 'All' || b.status      === (filters.status      as BugStatus))
    .filter((b) => filters.assignee    === 'All' || b.assignee    === (filters.assignee    as Assignee))
    .filter((b) => filters.priority    === 'All' || b.priority    === (filters.priority    as Priority))
    .filter((b) => filters.environment === 'All' || b.environment === (filters.environment as Environment))
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return filters.sortOrder === 'desc' ? db - da : da - db;
    });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bug Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
            Track and manage all reported bugs in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadBugs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/add-bug"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Bug
          </Link>
        </div>
      </div>

      {!loading && <StatsCards bugs={bugs} />}

      {!loading && bugs.length > 0 && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={bugs.length}
          filtered={filtered.length}
        />
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading bugs...</p>
        </div>
      ) : (
        <BugTable
          bugs={filtered}
          allBugs={bugs}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          deleting={deleting}
        />
      )}
    </div>
  );
}
