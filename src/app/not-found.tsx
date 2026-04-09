import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
      <div className="text-7xl">🔍</div>
      <h2 className="text-2xl font-bold text-gray-800">Bug Not Found</h2>
      <p className="text-gray-500">The bug you&apos;re looking for doesn&apos;t exist or was deleted.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
