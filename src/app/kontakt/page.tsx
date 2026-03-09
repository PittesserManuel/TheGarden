'use client';

import React, { useState } from 'react';

export default function Kontakt() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <>
      <section className="relative pt-32 pb-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80)' }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Kontakt & Reservierung</h1>
          <p className="text-white/80 text-lg">Wir freuen uns auf Ihren Besuch oder Ihre Nachricht</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Besuchen Sie uns</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600">Stadionstraße 3/6</p>
                    <p className="text-gray-600">A-2700 Wiener Neustadt</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <a href="tel:+43262228221" className="text-garden-700 hover:text-garden-800 font-medium">
                      02622 / 28 22 1
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">E-Mail</h3>
                    <a href="mailto:office@thegarden.co.at" className="text-garden-700 hover:text-garden-800 font-medium">
                      office@thegarden.co.at
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Öffnungszeiten</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-600">Dienstag – Donnerstag</span>
                        <span className="font-medium">07:30 – 00:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-600">Freitag – Samstag</span>
                        <span className="font-medium">07:30 – 01:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-600">Sonntag</span>
                        <span className="font-medium">07:30 – 00:00</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-gray-600">Montag</span>
                        <span className="font-medium text-red-500">Ruhetag</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-lg h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.5!2d16.2456!3d47.8127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476dc72f23d26b1d%3A0x1234567890abcdef!2sStadionstra%C3%9Fe%203%2C%202700%20Wiener%20Neustadt!5e0!3m2!1sde!2sat!4v1709000000000!5m2!1sde!2sat"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="The Garden Standort"
                />
              </div>
            </div>

            {/* Contact / Reservation Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Reservierung & Anfrage</h2>

              {formSubmitted ? (
                <div className="bg-garden-50 border border-garden-200 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-serif font-bold text-garden-800 mb-2">Nachricht gesendet!</h3>
                  <p className="text-gray-600">Vielen Dank! Wir melden uns in Kürze bei Ihnen.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
                      <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
                    <input required type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anlass</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent bg-white">
                      <option value="">Bitte wählen</option>
                      <option value="reservierung">Tischreservierung</option>
                      <option value="event">Privatveranstaltung</option>
                      <option value="firmenfeier">Firmenfeier</option>
                      <option value="geburtstag">Geburtstagsfeier</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                      <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uhrzeit</label>
                      <input type="time" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personenanzahl</label>
                    <input type="number" min="1" max="50" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
                    <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-garden-500 focus:border-transparent" placeholder="Ihre Nachricht, Sonderwünsche, Allergien..." />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-garden-600 hover:bg-garden-700 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg"
                  >
                    Anfrage senden
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
