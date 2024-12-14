'use client';

import React from 'react';
import { X, Twitter, MessageCircle, Github } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-slate-800 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl text-cyan-400 font-bold mb-6">Connect With Us</h2>
        
        <div className="space-y-6">
          <p className="text-slate-300 mb-6">
            Ready to join the frontier of autonomous systems? Connect with us through any of these channels:
          </p>

          <div className="space-y-4">
            {/* X (Twitter) */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <Twitter className="w-6 h-6 text-cyan-400" />
                <span className="font-medium text-white">X (Twitter)</span>
              </div>
              <div className="space-y-2 ml-10">
                <a
                  href="https://x.com/MartinMaur10165"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-slate-200 hover:text-white"
                >
                  Follow @MartinMaur10165
                </a>
                <a
                  href="https://twitter.com/messages/compose?recipient_id=MartinMaur10165&text=Hi%20Martin%2C%20I%20saw%20your%20vision%20page..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-slate-200 hover:text-white"
                >
                  Send Direct Message
                </a>
              </div>
            </div>

            {/* Telegram */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                <span className="font-medium text-white">Telegram</span>
              </div>
              <div className="ml-10">
                <a
                  href="https://t.me/cmdmcsellerie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-slate-200 hover:text-white"
                >
                  Message @cmdmcsellerie
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <Github className="w-6 h-6 text-cyan-400" />
                <span className="font-medium text-white">GitHub</span>
              </div>
              <div className="ml-10">
                <a
                  href="https://github.com/boorich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-slate-200 hover:text-white"
                >
                  Follow @boorich
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;