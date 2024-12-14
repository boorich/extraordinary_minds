'use client';

import { CardSectionProps } from '@/types';
import { CardItem } from '@/types';

export const CardSection: React.FC<CardSectionProps> = ({ title, items, variant = "default" }) => (
  <div className="mb-12">
    {title && <h3 className="text-3xl pirate-font text-cyan-400 mb-6 glow">{title}</h3>}
    <div className="grid gap-4">
      {variant === "crew" ? (
        <ul className="space-y-4" role="list">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="bg-slate-800/80 p-4 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        items.map((item, index) => {
          const cardItem = item as CardItem;
          return (
            <div 
              key={index} 
              className="bg-slate-800/80 p-6 rounded-lg border border-cyan-400 hover:border-cyan-300 transition-colors backdrop-blur-sm"
            >
              <h4 className="font-bold text-lg mb-2 title-font text-cyan-200">{cardItem.title}</h4>
              <p className="text-slate-300">{cardItem.description}</p>
            </div>
          );
        })
      )}
    </div>
  </div>
);