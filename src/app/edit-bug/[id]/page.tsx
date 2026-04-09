import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { fetchBugById } from '@/services/bugService';
import BugForm from '@/components/BugForm';

interface EditBugPageProps {
  params: { id: string };
}

export default async function EditBugPage({ params }: EditBugPageProps) {
  let bug;
  try {
    bug = await fetchBugById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Bug</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update the bug details below.</p>
        </div>
      </div>

      {/* Bug ID reference — truncate on mobile */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-blue-700 font-mono truncate">
        Bug ID: {bug.id}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <BugForm bug={bug} />
      </div>
    </div>
  );
}
