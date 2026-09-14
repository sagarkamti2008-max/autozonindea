-- ============================================================================
-- AUTOZONEINDIA - BRANDS TABLE POPULATION SEED DATA (25 OEM, OES & AFTERMARKET BRANDS)
-- Postgres / Supabase SQL Script
-- ============================================================================

INSERT INTO brands (name, slug, description, logo_url, status) VALUES
('BOSCH', 'bosch', 'German OEM & OES leader in brake pads, spark plugs, sensors, wiper blades & filtration systems', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('UNO MINDA', 'uno-minda', 'Leading Indian OEM manufacturer of automotive lighting, horn systems, switches & alloy wheels', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Lucas TVS', 'lucas-tvs', 'OEM supplier of starter motors, alternators, wiper motors, ignition coils & electrical systems', 'https://images.unsplash.com/photo-1558441719-443b38605d58?w=500&q=80', true),
('Gabriel India', 'gabriel-india', 'Pioneer in OEM ride control products, gas-charged shock absorbers & strut assemblies', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Castrol', 'castrol', 'World class motor lubricants, synthetic engine oils, transmission fluids & coolants', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Shell Helix', 'shell-helix', 'Premium synthetic motor oils featuring PurePlus technology for engine protection', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Motul', 'motul', 'High-performance synthetic engine lubricants, gear oils, 100% synthetic brake fluids', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80', true),
('Elofic', 'elofic', 'Indian OEM manufacturer of high-efficiency air filters, oil filters, cabin AC & fuel filters', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Exide Batteries', 'exide-batteries', 'Leading OEM manufacturer of 12V zero-maintenance car batteries & AGM start-stop batteries', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Amaron', 'amaron', 'Long-lasting zero-maintenance automotive batteries with Silven X alloy technology', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true),
('Valeo', 'valeo', 'French OEM supplier of clutch kits, dual-mass flywheels, headlamp assemblies & wiper blades', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('SACHS', 'sachs', 'German ZF OEM brand for heavy duty clutch plates, pressure kits & damper shock absorbers', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Monroe', 'monroe', 'Global leader in aftermarket ride control, strut assemblies & suspension shocks', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&q=80', true),
('Denso', 'denso', 'Japanese OEM supplier of radiators, AC compressors, fuel injectors & iridium spark plugs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Subros', 'subros', 'India''s largest OEM manufacturer of car air conditioning compressors & thermal systems', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80', true),
('Maruti Suzuki Genuine Parts (MSGP)', 'msgp', '100% Original factory parts direct from Maruti Suzuki India Limited', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Hyundai Genuine Parts (Mobis)', 'hyundai-mobis', '100% Genuine factory original replacement parts for Hyundai vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Tata Motors Genuine Parts', 'tata-genuine', '100% Original factory replacement parts certified for Tata passenger vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Mahindra mGENUINE', 'mahindra-mgenuine', 'Factory authentic spare parts designed specifically for Mahindra SUVs and pickups', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Toyota Genuine Parts', 'toyota-genuine', 'Original OEM replacement parts precision engineered for Toyota vehicles', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('MRF Tyres', 'mrf-tyres', 'India''s largest tyre manufacturer supplying OEM radial tyres for cars & SUVs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Apollo Tyres', 'apollo-tyres', 'High-speed tubeless radial tyres engineered for Indian road conditions', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('CEAT Tyres', 'ceat-tyres', 'High-grip tubeless tyres for all passenger cars, compact hatchbacks & SUVs', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('JK Tyre', 'jk-tyre', 'Pioneer of radial tyre technology in India providing durable tubeless car tyres', 'https://images.unsplash.com/photo-1600792580403-0550a1030699?w=500&q=80', true),
('Brembo', 'brembo', 'World famous Italian high-performance brake discs, calipers & ceramic pads', 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=500&q=80', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  logo_url = EXCLUDED.logo_url,
  status = EXCLUDED.status;
