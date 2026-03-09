'use client';

import React, { useState } from 'react';
import { categories, menuItems } from '@/data/menu';
import MenuCard from '@/components/MenuCard';

export default function Speisekarte() {
  const [activeCategory, setActiveCategory] = useState('alle');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'alle' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)' }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Unsere Speisekarte</h1>
          <p className="text-white/80 text-lg">Entdecken Sie die Vielfalt unserer österreichischen und türkischen Küche</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Gericht suchen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory('alle')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'alle'
                  ? 'bg-garden-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              Alle Gerichte
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-garden-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {activeCategory === 'alle' ? (
            categories.map(cat => {
              const catItems = filtered.filter(i => i.category === cat.id);
              if (catItems.length === 0) return null;
              return (
                <div key={cat.id} className="mb-16">
                  <div className="text-center mb-8">
                    <span className="text-3xl">{cat.icon}</span>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">{cat.name}</h2>
                    <p className="text-gray-500 mt-1">{cat.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catItems.map(item => (
                      <MenuCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {categories.filter(c => c.id === activeCategory).map(cat => (
                <div key={cat.id} className="text-center mb-8">
                  <span className="text-3xl">{cat.icon}</span>
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">{cat.name}</h2>
                  <p className="text-gray-500 mt-1">{cat.description}</p>
                </div>
              ))}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-12">Keine Gerichte gefunden.</p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
