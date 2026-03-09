export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: MenuCategory[] = [
  { id: 'fruehstueck', name: 'Frühstück', description: 'Starten Sie perfekt in den Tag', icon: '☀️' },
  { id: 'vorspeisen', name: 'Vorspeisen', description: 'Köstliche Appetitanreger', icon: '🥗' },
  { id: 'hauptspeisen', name: 'Hauptspeisen', description: 'Herzhafte Gerichte aus aller Welt', icon: '🍽️' },
  { id: 'burger', name: 'Burger & Steaks', description: 'Saftig und frisch zubereitet', icon: '🍔' },
  { id: 'tuerkisch', name: 'Türkische Spezialitäten', description: 'Authentische Aromen der Türkei', icon: '🌶️' },
  { id: 'desserts', name: 'Desserts & Süßes', description: 'Süße Versuchungen', icon: '🍰' },
  { id: 'getraenke', name: 'Getränke', description: 'Erfrischend und genussvoll', icon: '🥂' },
];

export const menuItems: MenuItem[] = [
  // Frühstück
  { id: 'f1', name: 'The Garden Frühstück', description: 'Gebäckauswahl, Butter, Marmelade, Honig, Käse, Schinken, Ei, Orangensaft & Kaffee', price: 14.90, category: 'fruehstueck', tags: ['beliebt'] },
  { id: 'f2', name: 'Türkisches Frühstück', description: 'Sucuk, Oliven, Käse, Tomaten, Gurken, Eier, Brot, Butter, Honig & Çay', price: 16.90, category: 'fruehstueck', tags: ['beliebt'] },
  { id: 'f3', name: 'Wiener Frühstück', description: 'Semmel, Butter, Marmelade, ein weiches Ei & Melange', price: 8.90, category: 'fruehstueck' },
  { id: 'f4', name: 'Fitness Frühstück', description: 'Griechischer Joghurt, frisches Obst, Granola, Honig & frischer Orangensaft', price: 12.90, category: 'fruehstueck', tags: ['gesund'] },
  { id: 'f5', name: 'Omelette nach Wahl', description: 'Mit Schinken, Käse, Champignons oder Gemüse – serviert mit Toast', price: 11.90, category: 'fruehstueck' },

  // Vorspeisen
  { id: 'v1', name: 'Hummus', description: 'Cremiger Kichererbsen-Dip mit Olivenöl, Paprika & warmem Fladenbrot', price: 7.90, category: 'vorspeisen', tags: ['vegan'] },
  { id: 'v2', name: 'Çiğ Köfte', description: 'Traditionelle rohe Köfte mit Salat, Granatapfelsirup & Fladenbrot', price: 9.90, category: 'vorspeisen', tags: ['vegan'] },
  { id: 'v3', name: 'Bruschetta Classica', description: 'Geröstetes Ciabatta mit Tomaten, Basilikum, Knoblauch & Olivenöl', price: 8.50, category: 'vorspeisen', tags: ['vegetarisch'] },
  { id: 'v4', name: 'Suppe des Tages', description: 'Täglich frisch zubereitet – fragen Sie unser Team', price: 5.90, category: 'vorspeisen' },
  { id: 'v5', name: 'Gemischter Vorspeisenteller', description: 'Hummus, Babaganoush, Ezme, Oliven & Fladenbrot für 2 Personen', price: 16.90, category: 'vorspeisen', tags: ['beliebt'] },

  // Hauptspeisen
  { id: 'h1', name: 'Wiener Schnitzel', description: 'Zartes Kalbsschnitzel in goldbrauner Panade mit Petersilkartoffeln & Preiselbeeren', price: 18.90, category: 'hauptspeisen', tags: ['beliebt'] },
  { id: 'h2', name: 'Tafelspitz', description: 'Klassischer Wiener Tafelspitz mit Apfelkren, Schnittlauchsauce & Rösterdäpfel', price: 19.90, category: 'hauptspeisen' },
  { id: 'h3', name: 'Lachsfilet', description: 'Gebratenes Lachsfilet auf Blattspinat mit Zitronenbutter & Reis', price: 17.90, category: 'hauptspeisen', tags: ['gesund'] },
  { id: 'h4', name: 'Pasta Truffle', description: 'Frische Tagliatelle mit Trüffelcreme, Champignons & Parmesan', price: 16.90, category: 'hauptspeisen', tags: ['vegetarisch'] },
  { id: 'h5', name: 'Chicken Bowl', description: 'Gegrillte Hähnchenbrust, Quinoa, Avocado, Edamame & Sesam-Dressing', price: 15.90, category: 'hauptspeisen', tags: ['gesund'] },

  // Burger & Steaks
  { id: 'b1', name: 'The Garden Burger', description: '200g Rindfleisch, Cheddar, Bacon, karamellisierte Zwiebeln, Brioche Bun & Pommes', price: 16.90, category: 'burger', tags: ['beliebt'] },
  { id: 'b2', name: 'Crispy Chicken Burger', description: 'Knuspriges Hühnchen, Coleslaw, Jalapeños, Sriracha-Mayo & Pommes', price: 15.90, category: 'burger' },
  { id: 'b3', name: 'Veggie Burger', description: 'Hausgemachtes Gemüse-Patty, Avocado, Rucola, Tomaten & Süßkartoffelpommes', price: 14.90, category: 'burger', tags: ['vegetarisch'] },
  { id: 'b4', name: 'Rumpsteak 300g', description: 'Saftiges Rumpsteak medium gegrillt mit Kräuterbutter, Ofenkartoffel & Grillgemüse', price: 28.90, category: 'burger', tags: ['beliebt'] },
  { id: 'b5', name: 'Spare Ribs', description: 'Zarte BBQ Spare Ribs mit Coleslaw & Pommes Frites', price: 22.90, category: 'burger' },

  // Türkische Spezialitäten
  { id: 't1', name: 'Adana Kebab', description: 'Würziges Hackfleisch-Kebab vom Grill mit Reis, Salat & Fladenbrot', price: 17.90, category: 'tuerkisch', tags: ['beliebt'] },
  { id: 't2', name: 'Iskender Kebab', description: 'Dünn geschnittenes Dönerfleisch auf Fladenbrot mit Tomatensauce, Joghurt & Butter', price: 18.90, category: 'tuerkisch', tags: ['beliebt'] },
  { id: 't3', name: 'Lahmacun', description: 'Türkische Pizza mit Hackfleisch, Tomaten, Zwiebeln & frischen Kräutern', price: 8.90, category: 'tuerkisch' },
  { id: 't4', name: 'Pide mit Käse & Sucuk', description: 'Türkisches Fladenbrot gefüllt mit Mozzarella & würziger Sucuk', price: 13.90, category: 'tuerkisch' },
  { id: 't5', name: 'Gemischter Grillteller', description: 'Adana, Hähnchen-Şiş, Lammkoteletts, Reis, Salat & Grillgemüse für 2 Personen', price: 39.90, category: 'tuerkisch', tags: ['beliebt'] },

  // Desserts
  { id: 'd1', name: 'Baklava', description: 'Knuspriges Blätterteiggebäck mit Walnüssen & Pistazien in Sirup', price: 7.90, category: 'desserts', tags: ['beliebt'] },
  { id: 'd2', name: 'Tiramisu', description: 'Klassisches italienisches Tiramisu mit Mascarpone & Espresso', price: 8.90, category: 'desserts' },
  { id: 'd3', name: 'Künefe', description: 'Warmes türkisches Käsedessert mit Kadayıf-Teig & Zuckersirup', price: 9.90, category: 'desserts', tags: ['beliebt'] },
  { id: 'd4', name: 'Apfelstrudel', description: 'Hausgemachter Wiener Apfelstrudel mit Vanillesauce & Schlagobers', price: 7.90, category: 'desserts' },
  { id: 'd5', name: 'Schokomousse', description: 'Luftige Schokoladenmousse mit Sahne & frischen Beeren', price: 8.50, category: 'desserts' },

  // Getränke
  { id: 'g1', name: 'Wiener Melange', description: 'Klassischer Wiener Kaffee mit aufgeschäumter Milch', price: 4.50, category: 'getraenke' },
  { id: 'g2', name: 'Türkischer Çay', description: 'Traditioneller türkischer Schwarztee im Glas', price: 2.90, category: 'getraenke' },
  { id: 'g3', name: 'Frischer Orangensaft', description: 'Frisch gepresster Orangensaft', price: 4.90, category: 'getraenke' },
  { id: 'g4', name: 'Aperol Spritz', description: 'Aperol, Prosecco & Soda', price: 8.90, category: 'getraenke', tags: ['beliebt'] },
  { id: 'g5', name: 'Mojito', description: 'Rum, frische Minze, Limette, Zucker & Soda', price: 9.90, category: 'getraenke' },
  { id: 'g6', name: 'Hauswein (0.25l)', description: 'Weißwein oder Rotwein aus österreichischem Anbau', price: 5.50, category: 'getraenke' },
  { id: 'g7', name: 'Mineralwasser (0.5l)', description: 'Prickelnd oder still', price: 3.50, category: 'getraenke' },
];
