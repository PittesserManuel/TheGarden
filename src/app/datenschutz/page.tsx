import React from 'react';

export default function Datenschutz() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">1. Datenschutz auf einen Blick</h2>
            <p className="text-gray-600">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">2. Verantwortliche Stelle</h2>
            <p className="text-gray-600">
              The Garden Café & Restaurant GmbH & Co. KG<br />
              Stadionstraße 3/6<br />
              A-2700 Wiener Neustadt<br />
              E-Mail: office@thegarden.co.at
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">3. Datenerfassung auf dieser Website</h2>
            <p className="text-gray-600">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen
              (z.B. über ein Kontaktformular). Andere Daten werden automatisch beim Besuch
              der Website durch unsere IT-Systeme erfasst (z.B. Browsertyp, Betriebssystem,
              Uhrzeit des Seitenaufrufs).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">4. Ihre Rechte</h2>
            <p className="text-gray-600">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger
              und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben
              außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
              Hierzu können Sie sich jederzeit an uns wenden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
