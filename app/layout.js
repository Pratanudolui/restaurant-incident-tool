import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Restaurant Incident Tool',
  description: 'AI-powered restaurant incident reporting and management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900`}>{children}</body>
    </html>
  );
}