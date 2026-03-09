'use client';

import React, { useState } from 'react';
import { categories, menuItems } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { useCart } from '@/context/CartContext';

export default function Bestellen() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  const currentItems = menuItems.filter(i => i.category === activeCategory);

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80)' }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Online Bestellen</h1>
          <p className="text-white/80 text-lg">Wählen Sie Ihre Lieblingsgerichte und bestellen Sie bequem online</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Categories */}
            <div className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-2">
                <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Kategorien</h3>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-garden-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1">
              {categories.filter(c => c.id === activeCategory).map(cat => (
                <div key={cat.id} className="mb-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{cat.icon} {cat.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{cat.description}</p>
                </div>
              ))}
              <div className="grid md:grid-cols-2 gap-5">
                {currentItems.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Cart Bar */}
          {totalItems > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-garden-700 hover:bg-garden-800 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 transition-all hover:scale-105"
              >
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{totalItems}</span>
                <span className="font-semibold">Warenkorb ansehen</span>
                <span className="font-bold">&euro; {totalPrice.toFixed(2)}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
