import React from 'react';
import { Insight } from '@/lib/store/rfqStore';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ValidationAlertsProps {
  insights: Insight[];
}

export function ValidationAlerts({ insights }: ValidationAlertsProps) {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getColor = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div className="space-y-2">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`flex items-start p-4 border rounded-lg ${getColor(insight.type)}`}
        >
          <div className="flex-shrink-0">{getIcon(insight.type)}</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">{insight.message}</h3>
            {insight.details && (
              <p className="mt-1 text-sm text-gray-600">{insight.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}