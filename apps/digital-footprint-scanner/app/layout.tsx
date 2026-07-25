import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Footprint Scanner | Check Your Online Exposure',
  description: 'Free digital footprint scanner for South Africans. Check email breaches, phone spam risk, and device security.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA">
      <body>{children}</body>
    </html>
  );
}