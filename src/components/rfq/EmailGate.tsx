import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface EmailGateProps {
  onVerify: (email: string) => void;
}

export function EmailGate({ onVerify }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onVerify(email);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Mail className="h-6 w-6 text-blue-500" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-2">Welcome to RFQ Template Generator</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your business email to start generating professional RFQ templates
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Business Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@company.com"
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Generating
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}