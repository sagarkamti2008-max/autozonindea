-- ============================================================================
-- AUTOZONEINDIA - CATEGORIES TABLE POPULATION SEED DATA (15 CAR-PARTS CATEGORIES)
-- Postgres / Supabase SQL Script
-- ============================================================================

INSERT INTO categories (name, slug, description, image_url, status) VALUES
('Engine', 'engine', 'Pistons, gaskets, timing belts, cylinder heads, spark plugs, fuel pumps & core engine assemblies', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Brake', 'brake', 'Front & rear brake pads, disc rotors, brake drums, calipers, shoes & DOT brake fluid', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Clutch', 'clutch', 'Clutch kits, pressure plates, release bearings, flywheels, master & slave cylinders', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Suspension', 'suspension', 'Shock absorbers, struts, coil springs, lower control arms, sway bar links & bushings', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Steering', 'steering', 'Power steering racks, steering pumps, tie rod ends, steering shafts & EPS modules', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', true),
('Electrical', 'electrical', 'Sensors, alternators, starter motors, ignition coils, relays, switches & wiring harnesses', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Filters', 'filters', 'Engine air filters, spin-on oil filters, activated carbon cabin AC filters & fuel filters', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Cooling', 'cooling', 'Radiators, water pumps, cooling fans, thermostats, expansion tanks & coolant concentrate', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('AC', 'ac', 'AC compressors, condenser coils, expansion valves, blower motors & refrigerant gas', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Body Parts', 'body-parts', 'Wiper blades, bumpers, fenders, side view mirrors, grilles, door handles & headlight brackets', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', true),
('Lights', 'lights', 'LED headlight bulbs, projector headlamps, fog lamp assemblies, tail lights & signal lamps', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Accessories', 'accessories', '7D floor mats, 360 mobile holders, seat covers, dash cameras & car detailing supplies', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Battery', 'battery', '12V automotive batteries, AGM start-stop batteries, jumper cables & charger clamps', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Tyres', 'tyres', 'Tubeless radial tyres, high performance SUV tyres, alloy wheel rims & tyre pressure sensors', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Lubricants', 'lubricants', 'Fully synthetic engine oils 5W-30/0W-20, gear oils 80W-90, transmission fluids & brake fluids', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status;
