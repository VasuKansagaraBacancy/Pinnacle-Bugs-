'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiImage, FiChevronUp, FiChevronDown,
  FiChevronLeft, FiChevronRight, FiX,
} from 'react-icons/fi';
import { Bug, BugStatus, Assignee, Priority, Environment, STATUSES, ASSIGNEES, PRIORITIES, ENVIRONMENTS } from '@/lib/types';
import { updateBug } from '@/services/bugService';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import EnvironmentBadge from './EnvironmentBadge';
import InlineSelect from './InlineSelect';
import { getBadgeForCount } from '@/lib/badges';

interface BugTableProps {
  bugs: Bug[];
  allBugs: Bug[];
  onDelete: (id: string) => void;
  onUpdate: (updatedBug: Bug) => void;
  deleting: string | null;
}

interface ModalState { images: string[]; index: number; }

export default function BugTable({ bugs, allBugs, onDelete, onUpdate, deleting }: BugTableProps) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fixedByAssignee = (assignee: string) =>
    allBugs.filter((b) => b.assignee === assignee && b.status === 'Fixed').length;

  const openModal = (images: string[], index = 0) => setModal({ images, index });
  const closeModal = () => setModal(null);
  const prev = () => setModal((m) => m && { ...m, index: (m.index - 1 + m.images.length) % m.images.length });
  const next = () => setModal((m) => m && { ...m, index: (m.index + 1) % m.images.length });

  const makeUpdater = <T extends string>(bug: Bug, field: keyof Bug) =>
    async (value: T) => {
      try {
        const updated = await updateBug(bug.id, { [field]: value });
        onUpdate(updated);
        toast.success('Updated!');
      } catch {
        toast.error('Failed to update. Please try again.');
        throw new Error('update failed');
      }
    };

  if (bugs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
        <div className="text-gray-300 text-6xl mb-4">🐛</div>
        <p className="text-gray-500 text-lg font-medium">No bugs found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new bug.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Table ───────────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Horizontally scrollable on mid-size screens */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-3 py-3 font-semibold text-gray-500 w-8">#</th>
                <th className="px-3 py-3 font-semibold text-gray-500">Description</th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-28">Images</th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-40">
                  Status
                  <span className="ml-1 text-[10px] text-blue-400 font-normal">✎ editable</span>
                </th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-28">
                  Priority
                  <span className="ml-1 text-[10px] text-blue-400 font-normal">✎</span>
                </th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-28">
                  Env
                  <span className="ml-1 text-[10px] text-blue-400 font-normal">✎</span>
                </th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-32">
                  Assignee
                  <span className="ml-1 text-[10px] text-blue-400 font-normal">✎</span>
                </th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-24">Date</th>
                <th className="px-3 py-3 font-semibold text-gray-500 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bugs.map((bug, index) => (
                <tr key={bug.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>

                  <td className="px-3 py-3 max-w-[200px]">
                    <p className="text-gray-800 line-clamp-2 text-sm">{bug.description}</p>
                  </td>

                  {/* Thumbnails */}
                  <td className="px-3 py-3">
                    {bug.image_urls?.length ? (
                      <div className="flex items-center gap-1">
                        {bug.image_urls.slice(0, 2).map((url, i) => (
                          <button
                            key={i}
                            onClick={() => openModal(bug.image_urls, i)}
                            className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors group flex-shrink-0"
                          >
                            <Image src={url} alt="" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized />
                          </button>
                        ))}
                        {bug.image_urls.length > 2 && (
                          <button
                            onClick={() => openModal(bug.image_urls, 2)}
                            className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors flex-shrink-0"
                          >
                            +{bug.image_urls.length - 2}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FiImage className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    )}
                  </td>

                  {/* Inline: Status */}
                  <td className="px-3 py-3">
                    <InlineSelect<BugStatus>
                      value={bug.status}
                      options={STATUSES}
                      onSave={makeUpdater<BugStatus>(bug, 'status')}
                      renderBadge={(v) => <StatusBadge status={v} size="sm" />}
                    />
                  </td>

                  {/* Inline: Priority */}
                  <td className="px-3 py-3">
                    <InlineSelect<Priority>
                      value={bug.priority}
                      options={PRIORITIES}
                      onSave={makeUpdater<Priority>(bug, 'priority')}
                      renderBadge={(v) => <PriorityBadge priority={v} size="sm" />}
                    />
                  </td>

                  {/* Inline: Environment */}
                  <td className="px-3 py-3">
                    <InlineSelect<Environment>
                      value={bug.environment}
                      options={ENVIRONMENTS}
                      onSave={makeUpdater<Environment>(bug, 'environment')}
                      renderBadge={(v) => <EnvironmentBadge environment={v} size="sm" />}
                    />
                  </td>

                  {/* Inline: Assignee */}
                  <td className="px-3 py-3">
                    <InlineSelect<Assignee>
                      value={bug.assignee}
                      options={ASSIGNEES}
                      onSave={makeUpdater<Assignee>(bug, 'assignee')}
                      renderBadge={(v) => (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {v[0]}
                          </span>
                          <span className="text-xs text-gray-700">{v}</span>
                          <span className="text-xs leading-none" title={getBadgeForCount(fixedByAssignee(v)).label}>
                            {getBadgeForCount(fixedByAssignee(v)).emoji}
                          </span>
                        </span>
                      )}
                    />
                  </td>

                  <td className="px-3 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {format(new Date(bug.date), 'MMM d, yyyy')}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/edit-bug/${bug.id}`}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit all fields"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => onDelete(bug.id)}
                        disabled={deleting === bug.id}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete bug"
                      >
                        {deleting === bug.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin block" />
                        ) : (
                          <FiTrash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {bugs.map((bug) => (
          <div key={bug.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              className="flex items-start gap-3 p-4 cursor-pointer"
              onClick={() => setExpandedRow(expandedRow === bug.id ? null : bug.id)}
            >
              {bug.image_urls?.length ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image src={bug.image_urls[0]} alt="Bug" fill className="object-cover" unoptimized />
                  {bug.image_urls.length > 1 && (
                    <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 rounded-tl">
                      +{bug.image_urls.length - 1}
                    </span>
                  )}
                </div>
              ) : null}

              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm font-medium line-clamp-2">{bug.description}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <StatusBadge status={bug.status} size="sm" />
                  <PriorityBadge priority={bug.priority} size="sm" />
                  <EnvironmentBadge environment={bug.environment} size="sm" />
                </div>
              </div>
              {expandedRow === bug.id
                ? <FiChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                : <FiChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
            </div>

            {expandedRow === bug.id && (
              <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                {/* Extra thumbnails */}
                {bug.image_urls?.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {bug.image_urls.map((url, i) => (
                      <button key={i} onClick={() => openModal(bug.image_urls, i)}
                        className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={url} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline selects on mobile */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">Status</p>
                    <InlineSelect<BugStatus>
                      value={bug.status}
                      options={STATUSES}
                      onSave={makeUpdater<BugStatus>(bug, 'status')}
                      renderBadge={(v) => <StatusBadge status={v} size="sm" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">Priority</p>
                    <InlineSelect<Priority>
                      value={bug.priority}
                      options={PRIORITIES}
                      onSave={makeUpdater<Priority>(bug, 'priority')}
                      renderBadge={(v) => <PriorityBadge priority={v} size="sm" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">Environment</p>
                    <InlineSelect<Environment>
                      value={bug.environment}
                      options={ENVIRONMENTS}
                      onSave={makeUpdater<Environment>(bug, 'environment')}
                      renderBadge={(v) => <EnvironmentBadge environment={v} size="sm" />}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">Assignee</p>
                    <InlineSelect<Assignee>
                      value={bug.assignee}
                      options={ASSIGNEES}
                      onSave={makeUpdater<Assignee>(bug, 'assignee')}
                      renderBadge={(v) => (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                            {v[0]}
                          </span>
                          <span className="text-xs">{v}</span>
                          <span className="text-xs">{getBadgeForCount(fixedByAssignee(v)).emoji}</span>
                        </span>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-400">
                    {format(new Date(bug.date), 'MMM d, yyyy')}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/edit-bug/${bug.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => onDelete(bug.id)}
                      disabled={deleting === bug.id}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Lightbox ────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-1 text-sm">
              <FiX className="w-4 h-4" /> Close
            </button>
            <div className="absolute -top-10 left-0 text-white text-sm">
              {modal.index + 1} / {modal.images.length}
            </div>
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image src={modal.images[modal.index]} alt="" fill className="rounded-xl object-contain" unoptimized />
            </div>
            {modal.images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
                  <FiChevronRight className="w-5 h-5" />
                </button>
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {modal.images.map((url, i) => (
                    <button key={i} onClick={() => setModal({ ...modal, index: i })}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === modal.index ? 'border-blue-400' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <Image src={url} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
