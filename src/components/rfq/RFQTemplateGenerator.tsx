import React, { useState } from 'react';
import { useRFQStore } from '@/lib/store/rfqStore';
import { useChat } from '@/lib/hooks/useChat';
import { ChatMessage } from '@/components/rfq/ChatMessage';
import { ValidationAlerts } from '@/components/rfq/ValidationAlerts';
import { EmailGate } from '@/components/rfq/EmailGate';

export default function RFQTemplateGenerator() {
  const [email, setEmail] = useState<string>('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { messages, requirements, insights } = useRFQStore();
  const { sendMessage, isLoading } = useChat();

  const handleSendMessage = async (message: string) => {
    if (!isEmailVerified) return;
    await sendMessage(message);
  };

  if (!isEmailVerified) {
    return <EmailGate onVerify={(email) => {
      setEmail(email);
      setIsEmailVerified(true);
    }} />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col space-y-4 h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your RFQ requirements..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {/* Handle send */}}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>

      {insights.length > 0 && (
        <ValidationAlerts insights={insights} />
      )}
    </div>
  );
}