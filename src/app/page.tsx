'use client';

import React from 'react';
import Link from 'next/link';
import { menuItems } from '@/data/menu';
import MenuCard from '@/components/MenuCard';

export default function Home() {
  const popularItems = menuItems.filter(i => i.tags?.includes('beliebt')).slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)',
          }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-garden-300 uppercase tracking-[0.3em] text-sm mb-4 fade-in-up">Restaurant &middot; Café &middot; Lounge</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 fade-in-up fade-in-up-delay-1">
            <span className="text-garden-400">the</span> garden
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 fade-in-up fade-in-up-delay-2">
            Authentische österreichische und türkische Küche in stilvollem Ambiente.
            Genießen Sie das Beste aus zwei Welten in Wiener Neustadt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up fade-in-up-delay-3">
            <Link
              href="/bestellen"
              className="bg-garden-600 hover:bg-garden-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:shadow-xl hover:scale-105"
            >
              Jetzt Online Bestellen
            </Link>
            <Link
              href="/speisekarte"
              className="border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:bg-white/10"
            >
              Speisekarte ansehen
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-garden-600 uppercase tracking-widest text-sm font-semibold mb-3">Willkommen</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                Zwei Kulturen,<br />ein Genuss
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Das The Garden verbindet das Beste aus der österreichischen und türkischen Küche
                zu einem einzigartigen kulinarischen Erlebnis. In unserem stilvollen Ambiente
                servieren wir Ihnen von früh bis spät – ob zum reichhaltigen Frühstücksbuffet,
                einem feinen Mittagessen oder einem genussvollen Abendessen mit Cocktails.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Ob Wiener Schnitzel, Adana Kebab, saftige Burger oder süßes Baklava –
                bei uns trifft Tradition auf moderne Gastfreundschaft.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-garden-700">28+</div>
                  <div className="text-sm text-gray-500 mt-1">Mitarbeiter</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-garden-700">4.5</div>
                  <div className="text-sm text-gray-500 mt-1">Google Bewertung</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-garden-700">2020</div>
                  <div className="text-sm text-gray-500 mt-1">Gegründet</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop"
                    alt="Fine Dining"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
                    alt="Pizza"
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop"
                    alt="Kebab"
                    className="w-full h-44 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=500&fit=crop"
                    alt="Dessert"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-garden-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-garden-400 uppercase tracking-widest text-sm font-semibold mb-3">Unsere Highlights</p>
            <h2 className="text-4xl font-serif font-bold">Was uns besonders macht</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '☀️', title: 'Frühstücksbuffet', desc: 'Reichhaltiges Buffet mit österreichischen & türkischen Spezialitäten, täglich ab 07:30' },
              { icon: '🍽️', title: 'Zwei Küchen', desc: 'Authentische österreichische Klassiker treffen auf türkische Aromen' },
              { icon: '🍸', title: 'Lounge & Bar', desc: 'Entspannen Sie bei Cocktails und Musik in unserer Chillout-Lounge' },
              { icon: '🛵', title: 'Online Bestellen', desc: 'Bequem von zu Hause bestellen – Abholung oder Lieferung' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-garden-600 uppercase tracking-widest text-sm font-semibold mb-3">Unsere Favoriten</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900">Beliebte Gerichte</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/speisekarte"
              className="inline-block border-2 border-garden-600 text-garden-700 hover:bg-garden-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all"
            >
              Gesamte Speisekarte ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-garden-700 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-6">Hunger bekommen?</h2>
          <p className="text-garden-100 text-lg mb-10">
            Bestellen Sie jetzt online und genießen Sie unsere Gerichte bequem zu Hause
            oder holen Sie Ihre Bestellung direkt bei uns ab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bestellen"
              className="bg-white text-garden-800 px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              Online Bestellen
            </Link>
            <a
              href="tel:+43262228221"
              className="border-2 border-white/50 hover:border-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:bg-white/10"
            >
              Anrufen: 02622 / 28 22 1
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-garden-600 uppercase tracking-widest text-sm font-semibold mb-3">Besuchen Sie uns</p>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">So finden Sie uns</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-600">Stadionstraße 3/6, A-2700 Wiener Neustadt</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🕐</span>
                  <div>
                    <p className="font-semibold">Öffnungszeiten</p>
                    <p className="text-gray-600">Di–Do & So: 07:30–00:00</p>
                    <p className="text-gray-600">Fr–Sa: 07:30–01:00</p>
                    <p className="text-red-500">Mo: Ruhetag</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-semibold">Kontakt</p>
                    <p className="text-gray-600">02622 / 28 22 1</p>
                    <p className="text-gray-600">office@thegarden.co.at</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.5!2d16.2456!3d47.8127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476dc72f23d26b1d%3A0x1234567890abcdef!2sStadionstra%C3%9Fe%203%2C%202700%20Wiener%20Neustadt!5e0!3m2!1sde!2sat!4v1709000000000!5m2!1sde!2sat"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Garden Standort"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
