import './globals.css';
import { Inter } from 'next/font/google';
import MCPHeader from '@/components/MCPHeader';

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
        <MCPHeader />
        {children}
      </body>
    </html>
  );
}