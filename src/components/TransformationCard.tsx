import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TransformationCardProps {
  title: string;
  description: string;
}

const TransformationCard = ({ title, description }: TransformationCardProps) => {
  // Split description into separate recommendations
  const recommendations = description.split('\n\n');

  return (
    <Card className="group bg-white/5 border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4">{title}</h3>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            const [status, ...contentParts] = recommendation.split('] ');
            const content = contentParts.join('] '); // Rejoin in case there are other brackets
            const isAvailable = status.includes('[Available');
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                      isAvailable 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {status.replace('[', '').replace(']', '')}
                  </span>
                  <div className="flex-1">
                    <div className="text-gray-200 font-medium">{content.split(':')[0]}</div>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {content.split(':')[1]?.trim()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransformationCard;