import React from 'react';
import { X, Twitter, MessageCircle, Github } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: <Twitter className="w-6 h-6" />,
      url: 'https://x.com/MartinMaur10165',
      username: '@MartinMaur10165'
    },
    {
      name: 'Telegram',
      icon: <MessageCircle className="w-6 h-6" />,
      url: 'https://t.me/cmdmcsellerie',
      username: '@cmdmcsellerie'
    },
    {
      name: 'GitHub',
      icon: <Github className="w-6 h-6" />,
      url: 'https://github.com/boorich',
      username: '@boorich'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl text-cyan-400 font-bold mb-6">Connect With Us</h2>
        
        <div className="space-y-6">
          <p className="text-slate-300 mb-6">
            Ready to join the frontier of autonomous systems? Connect with us through any of these channels:
          </p>

          <div className="space-y-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group"
              >
                <div className="text-cyan-400 group-hover:text-cyan-300">
                  {link.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{link.name}</div>
                  <div className="text-slate-300 text-sm">{link.username}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-slate-300 text-sm">
              For direct inquiries: manifest@autonomousfrontier.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;