'use client';

import { CardSectionProps, CardItem } from '@/types';

export const CardSection: React.FC<CardSectionProps> = ({ title, items, variant = "default" }) => {
  return (
    <div className="mb-8 md:mb-12">
      {title && <h3 className="text-2xl md:text-3xl pirate-font text-cyan-400 mb-4 md:mb-6 glow">{title}</h3>}
      <div className="grid gap-4">
        {variant === "crew" ? (
          <ul className="space-y-4" role="list">
            {items.map((item, index) => (
              <li 
                key={index} 
                className="bg-slate-800/80 p-4 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm text-sm md:text-base"
              >
                {item.toString()}
              </li>
            ))}
          </ul>
        ) : (
          items.map((item, index) => {
            const cardItem = item as CardItem;
            return (
              <div 
                key={index} 
                className="bg-slate-800/80 p-4 md:p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm"
              >
                <h4 className="font-bold text-base md:text-lg mb-2 title-font text-cyan-200">{cardItem.title}</h4>
                <div className="text-sm md:text-base text-slate-300 whitespace-pre-line">{cardItem.description}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};