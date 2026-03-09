import React from 'react';

export default function Impressum() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Angaben gemäß § 5 ECG</h2>
            <p className="text-gray-600">
              The Garden Café & Restaurant GmbH & Co. KG<br />
              Stadionstraße 3/6<br />
              A-2700 Wiener Neustadt<br />
              Österreich
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Kontakt</h2>
            <p className="text-gray-600">
              Telefon: 02622 / 28 22 1<br />
              E-Mail: office@thegarden.co.at
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Geschäftsführung</h2>
            <p className="text-gray-600">Fatih Karakoca</p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Unternehmensgegenstand</h2>
            <p className="text-gray-600">Gastgewerbe</p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Haftungsausschluss</h2>
            <p className="text-gray-600">
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
              jedoch keine Gewähr übernehmen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
