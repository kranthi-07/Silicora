import type { Metadata } from 'next';
import './globals.css';
import { ThemeSync } from '@/components/theme/theme-sync';

export const metadata: Metadata = {
  title: 'Silicora — Spatial Electronics & Semiconductor Workstation',
  description:
    'Explore electronic systems from the inside out through interactive 3D components, sub-surface die cutaways, real-time SPICE simulation, and practical circuit design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark w-full" suppressHydrationWarning>
      <body className="min-h-screen w-full antialiased transition-colors duration-200">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
