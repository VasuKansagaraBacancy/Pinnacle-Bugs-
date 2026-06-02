export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiArrowLeft, FiEdit2, FiCalendar, FiUser, FiMail, FiLock, FiShield, FiHash, FiClock } from 'react-icons/fi';
import { fetchBugById } from '@/services/bugService';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import EnvironmentBadge from '@/components/EnvironmentBadge';

interface BugDetailPageProps {
  params: { id: string };
}

export default async function BugDetailPage({ params }: BugDetailPageProps) {
  let bug;
  try {
    bug = await fetchBugById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bug Detail</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-mono truncate">ID: {bug.id}</p>
        </div>
        <Link
          href={`/edit-bug/${bug.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          <FiEdit2 className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={bug.status} />
        <PriorityBadge priority={bug.priority} />
        <EnvironmentBadge environment={bug.environment} />
        {bug.ticket_number ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-mono font-semibold border border-indigo-200">
            <FiHash className="w-3.5 h-3.5" /> {bug.ticket_number}
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm font-medium">
            General Bug
          </span>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Description</h2>
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{bug.description}</p>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Credentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FiMail className="w-4 h-4 text-blue-600" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
              <p className="text-sm text-gray-800 font-medium break-all">{bug.credential_email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <FiLock className="w-4 h-4 text-amber-600" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Password</p>
              <p className="text-sm text-gray-800 font-mono break-all">{bug.credential_password}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <FiShield className="w-4 h-4 text-purple-600" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Role</p>
              <p className="text-sm text-gray-800 font-medium">{bug.credential_role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-start gap-2">
            <FiUser className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Assignee</p>
              <p className="text-sm text-gray-800 font-semibold">{bug.assignee}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Date</p>
              <p className="text-sm text-gray-800 font-semibold">{format(new Date(bug.date), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FiClock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Created</p>
              <p className="text-sm text-gray-800 font-semibold">{format(new Date(bug.created_at), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FiClock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Updated</p>
              <p className="text-sm text-gray-800 font-semibold">{format(new Date(bug.updated_at), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {bug.image_urls?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Screenshots <span className="text-gray-300 font-normal">({bug.image_urls.length})</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {bug.image_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors flex-shrink-0 group"
              >
                <Image src={url} alt={`Screenshot ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back */}
      <div className="pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
