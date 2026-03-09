'use client';

import React, { useState } from 'react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', alt: 'Restaurant Innenbereich', category: 'ambiente' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', alt: 'Fine Dining Gericht', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', alt: 'Bar Bereich', category: 'ambiente' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', alt: 'Pide', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80', alt: 'Kebab Teller', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80', alt: 'Dessert', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', alt: 'Terrasse', category: 'ambiente' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', alt: 'Grill Spezialitäten', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1543353071-087092ec169a?w=800&q=80', alt: 'Cocktails', category: 'getraenke' },
  { src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80', alt: 'Steak', category: 'speisen' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', alt: 'Kaffee Spezialitäten', category: 'getraenke' },
  { src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', alt: 'Restaurant Abend', category: 'ambiente' },
];

const filterOptions = [
  { id: 'alle', label: 'Alle' },
  { id: 'speisen', label: 'Speisen' },
  { id: 'getraenke', label: 'Getränke' },
  { id: 'ambiente', label: 'Ambiente' },
];

export default function Galerie() {
  const [filter, setFilter] = useState('alle');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === 'alle' ? galleryImages : galleryImages.filter(i => i.category === filter);

  return (
    <>
      <section className="relative pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80)' }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Galerie</h1>
          <p className="text-white/80 text-lg">Einblicke in unser Restaurant, unsere Gerichte und unser Ambiente</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter */}
          <div className="flex justify-center gap-2 mb-10">
            {filterOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === opt.id
                    ? 'bg-garden-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, idx) => (
              <div
                key={idx}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightbox(idx)}
              >
                <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-600 font-medium">{img.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300">&times;</button>
          <button
            className="absolute left-4 text-white text-4xl hover:text-gray-300"
            onClick={e => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            &#8249;
          </button>
          <img
            src={filtered[lightbox]?.src}
            alt={filtered[lightbox]?.alt}
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
          />
          <button
            className="absolute right-4 text-white text-4xl hover:text-gray-300"
            onClick={e => { e.stopPropagation(); setLightbox(Math.min(filtered.length - 1, lightbox + 1)); }}
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
