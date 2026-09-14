-- ============================================================================
-- AUTOZONEINDIA - VEHICLES TABLE POPULATION SEED DATA (16 MAJOR BRANDS)
-- Postgres / Supabase SQL Script
-- ============================================================================

INSERT INTO vehicles (make, model, variant, year_from, year_to, fuel_type, transmission) VALUES

-- 1. MARUTI SUZUKI
('Maruti Suzuki', 'Swift', '1.2L DualJet Petrol VXi', 2018, 2024, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Swift', '1.2L ZXi Plus DualTone', 2021, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Swift', '1.3L DDiS Diesel LDi/VDi', 2014, 2020, 'Diesel', 'Manual'),
('Maruti Suzuki', 'Baleno', '1.2L K12N Alpha', 2019, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Baleno', '1.2L VVT Zeta', 2015, 2022, 'Petrol', 'Manual'),
('Maruti Suzuki', 'WagonR', '1.2L DualJet ZXi+', 2019, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'WagonR', '1.0L LXi CNG', 2019, 2026, 'CNG', 'Manual'),
('Maruti Suzuki', 'Dzire', '1.2L K-Series ZXi', 2017, 2026, 'Petrol', 'AMT'),
('Maruti Suzuki', 'Brezza', '1.5L K15C ZXi Plus', 2020, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Vitara Brezza', '1.3L DDiS 200 ZDi', 2016, 2020, 'Diesel', 'Manual'),
('Maruti Suzuki', 'Ertiga', '1.5L K15C ZXi Smart Hybrid', 2018, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Ertiga', '1.5L VXi CNG', 2019, 2026, 'CNG', 'Manual'),
('Maruti Suzuki', 'Grand Vitara', '1.5L Intelligent Hybrid Alpha+ 4WD', 2022, 2026, 'Hybrid', 'Automatic'),
('Maruti Suzuki', 'Fronx', '1.0L Boosterjet Turbo Alpha', 2023, 2026, 'Petrol', 'Automatic'),
('Maruti Suzuki', 'Alto K10', '1.0L K10C VXi+', 2022, 2026, 'Petrol', 'Manual'),
('Maruti Suzuki', 'Eeco', '1.2L G12B 5-Seater CNG', 2010, 2026, 'CNG', 'Manual'),

-- 2. HYUNDAI
('Hyundai', 'Creta', '1.5L CRDi Diesel SX(O)', 2020, 2026, 'Diesel', 'Manual'),
('Hyundai', 'Creta', '1.5L Turbo GDi SX Opt', 2020, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Creta', '1.6L CRDi SX Plus', 2015, 2020, 'Diesel', 'Automatic'),
('Hyundai', 'Venue', '1.0L Turbo GDi SX(O)', 2019, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Venue', '1.2L Kappa Petrol S', 2019, 2026, 'Petrol', 'Manual'),
('Hyundai', 'i20', '1.2L Kappa Asta (O)', 2020, 2026, 'Petrol', 'Manual'),
('Hyundai', 'Elite i20', '1.4L CRDi Sportz', 2014, 2020, 'Diesel', 'Manual'),
('Hyundai', 'Verna', '1.5L Turbo GDi SX Opt', 2023, 2026, 'Petrol', 'DCT'),
('Hyundai', 'Verna', '1.6L CRDi SX(O)', 2017, 2023, 'Diesel', 'Automatic'),
('Hyundai', 'Grand i10 Nios', '1.2L Kappa Asta', 2019, 2026, 'Petrol', 'AMT'),
('Hyundai', 'Exter', '1.2L Kappa SX(O) Connect', 2023, 2026, 'Petrol', 'Automatic'),
('Hyundai', 'Alcazar', '1.5L Turbo Petrol Signature', 2021, 2026, 'Petrol', 'Automatic'),
('Hyundai', 'Tucson', '2.0L CRDi AWD Signature', 2016, 2026, 'Diesel', 'Automatic'),

-- 3. TATA
('Tata', 'Nexon', '1.2L Revotron Turbo Fearless+', 2023, 2026, 'Petrol', 'DCT'),
('Tata', 'Nexon', '1.5L Revotorq Diesel XZA+', 2017, 2023, 'Diesel', 'AMT'),
('Tata', 'Nexon.ev', 'Empowered+ LR EV 40.5 kWh', 2023, 2026, 'Electric', 'Automatic'),
('Tata', 'Punch', '1.2L Revotron Creative Flagship', 2021, 2026, 'Petrol', 'Manual'),
('Tata', 'Punch.ev', 'Empowered+ Long Range EV', 2024, 2026, 'Electric', 'Automatic'),
('Tata', 'Harrier', '2.0L Kryotec Diesel Fearless+ Dark', 2023, 2026, 'Diesel', 'Automatic'),
('Tata', 'Harrier', '2.0L Kryotec Diesel XZ Plus', 2019, 2023, 'Diesel', 'Manual'),
('Tata', 'Safari', '2.0L Kryotec Diesel Accomplished+', 2021, 2026, 'Diesel', 'Automatic'),
('Tata', 'Tiago', '1.2L Revotron XZ+ iCNG', 2022, 2026, 'CNG', 'Manual'),
('Tata', 'Altroz', '1.2L i-Turbo XZ+ Opt', 2020, 2026, 'Petrol', 'DCT'),
('Tata', 'Curvv', '1.2L Hyperion GDi Accomplished', 2024, 2026, 'Petrol', 'DCT'),

-- 4. MAHINDRA
('Mahindra', 'Scorpio-N', '2.2L mHawk Diesel Z8L 4XPLOR', 2022, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Scorpio Classic', '2.2L mHawk Diesel S11', 2022, 2026, 'Diesel', 'Manual'),
('Mahindra', 'XUV700', '2.2L mHawk Diesel AX7 Luxury AWD', 2021, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'XUV700', '2.0L mStallion Petrol AX5', 2021, 2026, 'Petrol', 'Manual'),
('Mahindra', 'Thar', '2.2L mHawk Diesel LX 4x4 Hard Top', 2020, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Thar Roxx', '2.2L mHawk Diesel AX7L 4WD', 2024, 2026, 'Diesel', 'Automatic'),
('Mahindra', 'Bolero Neo', '1.5L mHawk75 N10 Option', 2021, 2026, 'Diesel', 'Manual'),
('Mahindra', 'Bolero', '1.5L mHawk75 ZLX', 2011, 2020, 'Diesel', 'Manual'),
('Mahindra', 'XUV 3XO / XUV300', '1.2L mStallion TGDi AX7L', 2019, 2026, 'Petrol', 'Automatic'),

-- 5. TOYOTA
('Toyota', 'Innova Crysta', '2.4L D-4D Diesel VX 7-Seater', 2016, 2026, 'Diesel', 'Manual'),
('Toyota', 'Innova Hycross', '2.0L Strong Hybrid ZX(O)', 2023, 2026, 'Hybrid', 'Automatic'),
('Toyota', 'Fortuner', '2.8L D-4D Diesel 4x4 AT Legender', 2021, 2026, 'Diesel', 'Automatic'),
('Toyota', 'Fortuner', '2.7L VVT-i Petrol 4x2 MT', 2016, 2021, 'Petrol', 'Manual'),
('Toyota', 'Urban Cruiser Hyryder', '1.5L Strong Hybrid V AWD', 2022, 2026, 'Hybrid', 'Automatic'),
('Toyota', 'Glanza', '1.2L K-Series V AMT', 2022, 2026, 'Petrol', 'AMT'),
('Toyota', 'Camry', '2.5L Dynamic Force Hybrid', 2019, 2026, 'Hybrid', 'Automatic'),

-- 6. HONDA
('Honda', 'City', '1.5L i-VTEC ZX CVT (5th Gen)', 2020, 2026, 'Petrol', 'CVT'),
('Honda', 'City', '1.5L e:HEV Strong Hybrid ZX', 2022, 2026, 'Hybrid', 'Automatic'),
('Honda', 'City', '1.5L i-DTEC Diesel VX (4th Gen)', 2014, 2020, 'Diesel', 'Manual'),
('Honda', 'Elevate', '1.5L i-VTEC ZX CVT ADAS', 2023, 2026, 'Petrol', 'CVT'),
('Honda', 'Amaze', '1.2L i-VTEC VX CVT', 2018, 2026, 'Petrol', 'CVT'),
('Honda', 'Civic', '1.8L i-VTEC ZX CVT', 2019, 2021, 'Petrol', 'CVT'),

-- 7. KIA
('Kia', 'Seltos', '1.5L Turbo GDi GTX+ DCT', 2023, 2026, 'Petrol', 'DCT'),
('Kia', 'Seltos', '1.5L CRDi Diesel HTX AT', 2019, 2023, 'Diesel', 'Automatic'),
('Kia', 'Sonet', '1.0L Turbo GDi X-Line DCT', 2020, 2026, 'Petrol', 'DCT'),
('Kia', 'Carens', '1.5L CRDi Diesel Luxury Plus 7-Str', 2022, 2026, 'Diesel', 'Automatic'),
('Kia', 'EV6', '77.4 kWh AWD GT-Line EV', 2022, 2026, 'Electric', 'Automatic'),

-- 8. VOLKSWAGEN
('Volkswagen', 'Virtus', '1.5L TSI EVO GT Plus DSG', 2022, 2026, 'Petrol', 'DCT'),
('Volkswagen', 'Taigun', '1.5L TSI EVO GT Edge DSG', 2021, 2026, 'Petrol', 'DCT'),
('Volkswagen', 'Polo', '1.0L TSI Highline Plus', 2020, 2022, 'Petrol', 'Manual'),
('Volkswagen', 'Polo', '1.2L GT TSI DSG', 2013, 2020, 'Petrol', 'DCT'),
('Volkswagen', 'Vento', '1.0L TSI Highline Plus', 2020, 2022, 'Petrol', 'Manual'),

-- 9. SKODA
('Skoda', 'Slavia', '1.5L TSI DSG Style Matte Edition', 2022, 2026, 'Petrol', 'DCT'),
('Skoda', 'Kushaq', '1.5L TSI DSG Monte Carlo', 2021, 2026, 'Petrol', 'DCT'),
('Skoda', 'Octavia', '2.0L TSI DSG L&K', 2021, 2023, 'Petrol', 'DCT'),
('Skoda', 'Rapid', '1.0L TSI Monte Carlo', 2020, 2021, 'Petrol', 'Manual'),

-- 10. RENAULT
('Renault', 'Kwid', '1.0L SCe Climber EASY-R AMT', 2019, 2026, 'Petrol', 'AMT'),
('Renault', 'Kiger', '1.0L Turbo RXZ CVT', 2021, 2026, 'Petrol', 'CVT'),
('Renault', 'Triber', '1.0L Energy RXT EASY-R 7-Str', 2019, 2026, 'Petrol', 'AMT'),
('Renault', 'Duster', '1.3L Turbo RxZ 156 hp', 2020, 2022, 'Petrol', 'Manual'),

-- 11. NISSAN
('Nissan', 'Magnite', '1.0L HRA0 Turbo XV Premium CVT', 2020, 2026, 'Petrol', 'CVT'),
('Nissan', 'Kicks', '1.3L Turbo XV Premium', 2020, 2023, 'Petrol', 'Manual'),
('Nissan', 'Sunny', '1.5L k9k Diesel XV Premium', 2011, 2020, 'Diesel', 'Manual'),

-- 12. MG (MORRIS GARAGES)
('MG', 'Hector', '1.5L Turbo Petrol Savvy Pro CVT', 2021, 2026, 'Petrol', 'CVT'),
('MG', 'Hector', '2.0L Multijet Diesel Sharp', 2019, 2024, 'Diesel', 'Manual'),
('MG', 'ZS EV', '50.3 kWh Exclusive Pro EV', 2022, 2026, 'Electric', 'Automatic'),
('MG', 'Astor', '1.3L Turbo Petrol Savvy Pro ADAS', 2021, 2026, 'Petrol', 'Automatic'),

-- 13. JEEP
('Jeep', 'Compass', '2.0L Multijet II Diesel Model S 4x4 AT', 2021, 2026, 'Diesel', 'Automatic'),
('Jeep', 'Compass', '1.4L MultiAir Turbo Petrol Limited', 2017, 2021, 'Petrol', 'Manual'),
('Jeep', 'Meridian', '2.0L Multijet II Diesel Overland 4x4', 2022, 2026, 'Diesel', 'Automatic'),

-- 14. BMW
('BMW', '3 Series Gran Limousine', '330Li M Sport 2.0L Turbo', 2021, 2026, 'Petrol', 'Automatic'),
('BMW', '5 Series', '530i M Sport 2.0L Turbo', 2017, 2024, 'Petrol', 'Automatic'),
('BMW', 'X1', 'sDrive18d M Sport Diesel', 2020, 2026, 'Diesel', 'Automatic'),
('BMW', 'X5', 'xDrive40i M Sport 3.0L Turbo', 2019, 2026, 'Petrol', 'Automatic'),

-- 15. MERCEDES-BENZ
('Mercedes-Benz', 'C-Class', 'C 220d AMG Line 2.0L Diesel', 2022, 2026, 'Diesel', 'Automatic'),
('Mercedes-Benz', 'E-Class LWB', 'E 220d Exclusive 2.0L Diesel', 2017, 2026, 'Diesel', 'Automatic'),
('Mercedes-Benz', 'GLC', 'GLC 300 4MATIC 2.0L Turbo', 2020, 2026, 'Petrol', 'Automatic'),

-- 16. AUDI
('Audi', 'A4', '40 TFSI Technology 2.0L Turbo', 2021, 2026, 'Petrol', 'Automatic'),
('Audi', 'Q3', '40 TFSI quattro Technology', 2022, 2026, 'Petrol', 'Automatic'),
('Audi', 'Q5', '45 TFSI quattro Technology 2.0L', 2021, 2026, 'Petrol', 'Automatic');
