-- =============================================
-- TheGarden Seed Data
-- =============================================

-- Location
INSERT INTO locations (id, name, address, phone, email, opening_hours, features)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'The Garden',
  'Hauptplatz 1, 2700 Wiener Neustadt',
  '02622 / 28 22 1',
  'info@thegarden.at',
  '{
    "monday": {"open": "09:00", "close": "22:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
    "thursday": {"open": "09:00", "close": "22:00", "closed": false},
    "friday": {"open": "09:00", "close": "23:00", "closed": false},
    "saturday": {"open": "09:00", "close": "23:00", "closed": false},
    "sunday": {"open": "10:00", "close": "21:00", "closed": false}
  }'::jsonb,
  '{"member_system": true, "delivery": false}'::jsonb
);

-- Order counter
INSERT INTO order_counters (location_id, current_number)
VALUES ('a0000000-0000-0000-0000-000000000001', 0);

-- Categories
INSERT INTO categories (id, location_id, name, description, icon, station, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Frühstück', 'Starten Sie perfekt in den Tag', '☀️', 'kitchen', 1),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Vorspeisen', 'Köstliche Appetitanreger', '🥗', 'kitchen', 2),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Hauptspeisen', 'Herzhafte Gerichte aus aller Welt', '🍽️', 'kitchen', 3),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Burger & Steaks', 'Saftig und frisch zubereitet', '🍔', 'kitchen', 4),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Türkische Spezialitäten', 'Authentische Aromen der Türkei', '🌶️', 'kitchen', 5),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Desserts & Süßes', 'Süße Versuchungen', '🍰', 'dessert', 6),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Getränke', 'Erfrischend und genussvoll', '🥂', 'bar', 7);

-- Products: Frühstück
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'The Garden Frühstück', 'Gebäckauswahl, Butter, Marmelade, Honig, Käse, Schinken, Ei, Orangensaft & Kaffee', 14.90, '{beliebt}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Türkisches Frühstück', 'Sucuk, Oliven, Käse, Tomaten, Gurken, Eier, Brot, Butter, Honig & Çay', 16.90, '{beliebt}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Wiener Frühstück', 'Semmel, Butter, Marmelade, ein weiches Ei & Melange', 8.90, '{}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Fitness Frühstück', 'Griechischer Joghurt, frisches Obst, Granola, Honig & frischer Orangensaft', 12.90, '{gesund}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Omelette nach Wahl', 'Mit Schinken, Käse, Champignons oder Gemüse – serviert mit Toast', 11.90, '{}', 5);

-- Products: Vorspeisen
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Hummus', 'Cremiger Kichererbsen-Dip mit Olivenöl, Paprika & warmem Fladenbrot', 7.90, '{vegan}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Çiğ Köfte', 'Traditionelle rohe Köfte mit Salat, Granatapfelsirup & Fladenbrot', 9.90, '{vegan}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Bruschetta Classica', 'Geröstetes Ciabatta mit Tomaten, Basilikum, Knoblauch & Olivenöl', 8.50, '{vegetarisch}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Suppe des Tages', 'Täglich frisch zubereitet – fragen Sie unser Team', 5.90, '{}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Gemischter Vorspeisenteller', 'Hummus, Babaganoush, Ezme, Oliven & Fladenbrot für 2 Personen', 16.90, '{beliebt}', 5);

-- Products: Hauptspeisen
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Wiener Schnitzel', 'Zartes Kalbsschnitzel in goldbrauner Panade mit Petersilkartoffeln & Preiselbeeren', 18.90, '{beliebt}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Tafelspitz', 'Klassischer Wiener Tafelspitz mit Apfelkren, Schnittlauchsauce & Rösterdäpfel', 19.90, '{}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Lachsfilet', 'Gebratenes Lachsfilet auf Blattspinat mit Zitronenbutter & Reis', 17.90, '{gesund}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Pasta Truffle', 'Frische Tagliatelle mit Trüffelcreme, Champignons & Parmesan', 16.90, '{vegetarisch}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Chicken Bowl', 'Gegrillte Hähnchenbrust, Quinoa, Avocado, Edamame & Sesam-Dressing', 15.90, '{gesund}', 5);

-- Products: Burger & Steaks
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'The Garden Burger', '200g Rindfleisch, Cheddar, Bacon, karamellisierte Zwiebeln, Brioche Bun & Pommes', 16.90, '{beliebt}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Crispy Chicken Burger', 'Knuspriges Hühnchen, Coleslaw, Jalapeños, Sriracha-Mayo & Pommes', 15.90, '{}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Veggie Burger', 'Hausgemachtes Gemüse-Patty, Avocado, Rucola, Tomaten & Süßkartoffelpommes', 14.90, '{vegetarisch}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Rumpsteak 300g', 'Saftiges Rumpsteak medium gegrillt mit Kräuterbutter, Ofenkartoffel & Grillgemüse', 28.90, '{beliebt}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Spare Ribs', 'Zarte BBQ Spare Ribs mit Coleslaw & Pommes Frites', 22.90, '{}', 5);

-- Products: Türkische Spezialitäten
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Adana Kebab', 'Würziges Hackfleisch-Kebab vom Grill mit Reis, Salat & Fladenbrot', 17.90, '{beliebt}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Iskender Kebab', 'Dünn geschnittenes Dönerfleisch auf Fladenbrot mit Tomatensauce, Joghurt & Butter', 18.90, '{beliebt}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Lahmacun', 'Türkische Pizza mit Hackfleisch, Tomaten, Zwiebeln & frischen Kräutern', 8.90, '{}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Pide mit Käse & Sucuk', 'Türkisches Fladenbrot gefüllt mit Mozzarella & würziger Sucuk', 13.90, '{}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Gemischter Grillteller', 'Adana, Hähnchen-Şiş, Lammkoteletts, Reis, Salat & Grillgemüse für 2 Personen', 39.90, '{beliebt}', 5);

-- Products: Desserts
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Baklava', 'Knuspriges Blätterteiggebäck mit Walnüssen & Pistazien in Sirup', 7.90, '{beliebt}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Tiramisu', 'Klassisches italienisches Tiramisu mit Mascarpone & Espresso', 8.90, '{}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Künefe', 'Warmes türkisches Käsedessert mit Kadayıf-Teig & Zuckersirup', 9.90, '{beliebt}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Apfelstrudel', 'Hausgemachter Wiener Apfelstrudel mit Vanillesauce & Schlagobers', 7.90, '{}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Schokomousse', 'Luftige Schokoladenmousse mit Sahne & frischen Beeren', 8.50, '{}', 5);

-- Products: Getränke
INSERT INTO products (location_id, category_id, name, description, price, tags, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Wiener Melange', 'Klassischer Wiener Kaffee mit aufgeschäumter Milch', 4.50, '{}', 1),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Türkischer Çay', 'Traditioneller türkischer Schwarztee im Glas', 2.90, '{}', 2),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Frischer Orangensaft', 'Frisch gepresster Orangensaft', 4.90, '{}', 3),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Aperol Spritz', 'Aperol, Prosecco & Soda', 8.90, '{beliebt}', 4),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Mojito', 'Rum, frische Minze, Limette, Zucker & Soda', 9.90, '{}', 5),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Hauswein (0.25l)', 'Weißwein oder Rotwein aus österreichischem Anbau', 5.50, '{}', 6),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Mineralwasser (0.5l)', 'Prickelnd oder still', 3.50, '{}', 7);
