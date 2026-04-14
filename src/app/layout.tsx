import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pinnacle Bug Reporting',
  description: 'Track, manage, and resolve bugs with ease',
  icons: {
    icon: '/icon',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          {/* pb-20 on mobile to clear the bottom tab bar */}
          <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl pb-24 sm:pb-8">
            {children}
          </main>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: '90vw',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />
      </body>
    </html>
  );
}
