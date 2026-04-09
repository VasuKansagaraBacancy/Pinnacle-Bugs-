'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FiSave, FiX } from 'react-icons/fi';
import { Bug, CreateBugPayload, BugStatus, Assignee, STATUSES, ASSIGNEES } from '@/lib/types';
import { createBug, updateBug, uploadBugImages, deleteBugImages } from '@/services/bugService';
import ImageUpload from './ImageUpload';

interface BugFormProps {
  bug?: Bug;
}

export default function BugForm({ bug }: BugFormProps) {
  const router = useRouter();
  const isEdit = !!bug;

  const [form, setForm] = useState({
    description: bug?.description ?? '',
    status: (bug?.status ?? 'Not Fixed') as BugStatus,
    assignee: (bug?.assignee ?? 'Alpesh') as Assignee,
    date: bug?.date ?? format(new Date(), 'yyyy-MM-dd'),
  });

  // newFiles  → files the user just picked (not yet uploaded)
  // keptUrls  → existing URLs the user kept (didn't remove)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptUrls, setKeptUrls] = useState<string[]>(bug?.image_urls ?? []);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleImagesChange = useCallback((files: File[], kept: string[]) => {
    setNewFiles(files);
    setKeptUrls(kept);
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Upload any newly added files
      const uploadedUrls = newFiles.length ? await uploadBugImages(newFiles) : [];

      // In edit mode, delete any images the user removed
      if (isEdit) {
        const removedUrls = (bug.image_urls ?? []).filter((u) => !keptUrls.includes(u));
        if (removedUrls.length) await deleteBugImages(removedUrls);
      }

      const finalUrls = [...keptUrls, ...uploadedUrls];

      const payload: CreateBugPayload = {
        description: form.description.trim(),
        status: form.status,
        assignee: form.assignee,
        date: form.date,
        image_urls: finalUrls,
      };

      if (isEdit) {
        await updateBug(bug.id, payload);
        toast.success('Bug updated successfully!');
      } else {
        await createBug(payload);
        toast.success('Bug reported successfully!');
      }

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          placeholder="Describe the bug in detail..."
          disabled={loading}
          className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Multi-Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Screenshots / Images{' '}
          <span className="text-gray-400 font-normal">(optional, up to 10)</span>
        </label>
        <ImageUpload
          existingUrls={bug?.image_urls ?? []}
          onChange={handleImagesChange}
          disabled={loading}
          maxImages={10}
        />
      </div>

      {/* Status + Assignee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Assignee <span className="text-red-500">*</span>
          </label>
          <select
            value={form.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange('date', e.target.value)}
          disabled={loading}
          className={`w-full sm:w-48 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
          }`}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEdit ? 'Saving...' : 'Submitting...'}
            </>
          ) : (
            <>
              <FiSave className="w-4 h-4" />
              {isEdit ? 'Save Changes' : 'Report Bug'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <FiX className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}
