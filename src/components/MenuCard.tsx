'use client';

import React from 'react';
import { MenuItem } from '@/data/menu';
import { useCart } from '@/context/CartContext';

interface MenuCardProps {
  item: MenuItem;
  showAddButton?: boolean;
}

export default function MenuCard({ item, showAddButton = true }: MenuCardProps) {
  const { addItem } = useCart();

  const tagColors: Record<string, string> = {
    beliebt: 'bg-amber-100 text-amber-800',
    vegan: 'bg-green-100 text-green-800',
    vegetarisch: 'bg-emerald-100 text-emerald-800',
    gesund: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="menu-card bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif font-bold text-lg text-gray-900">{item.name}</h3>
          <span className="text-garden-700 font-bold text-lg whitespace-nowrap">
            &euro; {item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.description}</p>
        {item.tags && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.map(tag => (
              <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-600'}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {showAddButton && (
        <button
          onClick={() => addItem(item)}
          className="mt-2 w-full bg-garden-50 hover:bg-garden-600 text-garden-700 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-garden-200 hover:border-garden-600"
        >
          + In den Warenkorb
        </button>
      )}
    </div>
  );
}
