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
      actions: [
        {
          label: 'View Profile',
          url: 'https://x.com/MartinMaur10165',
          username: '@MartinMaur10165'
        },
        {
          label: 'Send Message',
          url: `https://twitter.com/messages/compose?recipient_id=MartinMaur10165&text=Hi%20Martin%2C%20I%20saw%20your%20vision%20page...`,
          username: 'Direct Message'
        }
      ]
    },
    {
      name: 'Telegram',
      icon: <MessageCircle className="w-6 h-6" />,
      actions: [
        {
          label: 'Message on Telegram',
          url: 'https://t.me/cmdmcsellerie',
          username: '@cmdmcsellerie'
        }
      ]
    },
    {
      name: 'GitHub',
      icon: <Github className="w-6 h-6" />,
      actions: [
        {
          label: 'View Profile',
          url: 'https://github.com/boorich',
          username: '@boorich'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-slate-800 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl text-cyan-400 font-bold mb-6">Connect With Us</h2>
        
        <div className="space-y-6">
          <p className="text-slate-300 mb-6">
            Ready to join the frontier of autonomous systems? Connect with us through any of these channels:
          </p>

          <div className="space-y-4">
            {socialLinks.map((platform) => (
              <div key={platform.name} className="p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-cyan-400">
                    {platform.icon}
                  </div>
                  <div className="font-medium text-white">{platform.name}</div>
                </div>
                <div className="space-y-2 ml-10">
                  {platform.actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors group"
                    >
                      <span className="text-slate-200 group-hover:text-white">
                        {action.label}
                      </span>
                      <span className="text-slate-300 text-sm">
                        {action.username}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
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