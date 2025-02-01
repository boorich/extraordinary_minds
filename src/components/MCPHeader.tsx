'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('DE');
  
  return (
    <button 
      onClick={() => setCurrentLang(currentLang === 'DE' ? 'EN' : 'DE')}
      className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span>{currentLang}</span>
    </button>
  );
};

const MCPHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            {/* Replace with your actual logo */}
            <div className="text-xl font-semibold text-gray-900">MCP Servers</div>
          </div>

          {/* Right side elements */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MCPHeader;