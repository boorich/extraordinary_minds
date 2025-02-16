'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-slate-900/90 border-b border-cyan-400/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <Link 
              href="/" 
              className="flex items-center text-cyan-300 hover:text-cyan-200"
            >
              MCP Servers
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link
              href="/rfq"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                pathname === '/rfq'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-gray-300 hover:text-cyan-300 hover:border-cyan-300/50'
              }`}
            >
              RFQ Generator
            </Link>
            
            {/* Add more navigation items here as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
}