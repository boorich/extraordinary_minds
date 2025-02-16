import './globals.css';
import { Inter } from 'next/font/google';
import TopNav from '@/components/navigation/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Model Context Protocol Servers',
  description: 'Connecting Your Experts with AI and Company Resources',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopNav />
        {children}
      </body>
    </html>
  );
}