import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-garden-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              <span className="text-garden-400">the</span> garden
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Restaurant, Café & Lounge in Wiener Neustadt. Authentische österreichische und türkische Küche.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-garden-400 uppercase text-sm tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/speisekarte', label: 'Speisekarte' },
                { href: '/bestellen', label: 'Online Bestellen' },
                { href: '/galerie', label: 'Galerie' },
                { href: '/kontakt', label: 'Kontakt' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Öffnungszeiten */}
          <div>
            <h4 className="font-semibold text-garden-400 uppercase text-sm tracking-wider mb-4">Öffnungszeiten</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between"><span>Di – Do, So</span><span>07:30 – 00:00</span></li>
              <li className="flex justify-between"><span>Fr – Sa</span><span>07:30 – 01:00</span></li>
              <li className="flex justify-between"><span>Montag</span><span className="text-red-400">Ruhetag</span></li>
            </ul>
            <div className="mt-4 p-3 bg-garden-800/50 rounded-lg">
              <p className="text-xs text-garden-300 font-medium">Frühstücksbuffet</p>
              <p className="text-xs text-gray-400">Di–Fr: 07:30–12:00 | Sa–So: 07:30–13:00</p>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-semibold text-garden-400 uppercase text-sm tracking-wider mb-4">Kontakt</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>📍 Stadionstraße 3/6<br />A-2700 Wiener Neustadt</li>
              <li>📞 <a href="tel:+43262228221" className="hover:text-white transition-colors">02622 / 28 22 1</a></li>
              <li>✉️ <a href="mailto:office@thegarden.co.at" className="hover:text-white transition-colors">office@thegarden.co.at</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-garden-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} The Garden Café & Restaurant GmbH & Co. KG
          </p>
          <div className="flex space-x-6">
            <Link href="/impressum" className="text-gray-500 hover:text-white text-sm transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-gray-500 hover:text-white text-sm transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
