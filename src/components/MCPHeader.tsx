'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('DE');
  
  return (
    <button 
      onClick={() => setCurrentLang(currentLang === 'DE' ? 'EN' : 'DE')}
      className="flex items-center px-3 py-1 text-sm font-medium text-gray-100 hover:text-white transition-colors"
    >
      <span>{currentLang}</span>
    </button>
  );
};

const MCPHeader = () => {
  const pathname = usePathname();

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b border-blue-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white tracking-tight">MCP</span>
              <span className="text-xl text-gray-300 font-light tracking-tight">Servers</span>
              <span className="text-gray-400 px-2">|</span>
              <span className="text-sm text-gray-300 hidden sm:block">Tools for experts</span>
            </Link>
          </div>

          {/* Navigation Links & Language Switcher */}
          <div className="flex items-center space-x-8">
            <Link
              href="/rfq"
              className={`text-sm ${
                pathname === '/rfq'
                  ? 'text-cyan-300'
                  : 'text-gray-300 hover:text-cyan-300'
              } transition-colors`}
            >
              RFQ Generator
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MCPHeader;