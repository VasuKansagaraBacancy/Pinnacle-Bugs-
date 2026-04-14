import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import BugForm from '@/components/BugForm';

export default function AddBugPage() {
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Report a Bug</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Fill in the details below to log a new bug.
          </p>
        </div>
      </div>

      {/* Form Card — flush on mobile, card on sm+ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <BugForm />
      </div>
    </div>
  );
}
