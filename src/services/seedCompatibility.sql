-- ============================================================================
-- AUTOZONEINDIA - PRODUCT COMPATIBILITY MATRIX SEED DATA
-- Postgres / Supabase SQL Script
-- Maps Product -> Vehicle (Make, Model, Year Range, Fuel Type, Variant)
-- ============================================================================

DO $$
DECLARE
  v_p_bosch_bp UUID;
  v_p_bosch_of UUID;
  v_p_elofic_af UUID;
  v_p_subros_ac UUID;
  v_p_minda_hl UUID;
  v_p_gabriel_sa UUID;
  v_p_valeo_ck UUID;
  v_p_brembo_bd UUID;

  v_v_creta_petrol UUID;
  v_v_creta_diesel UUID;
  v_v_swift_petrol UUID;
  v_v_innova_diesel UUID;
  v_v_nexon_petrol UUID;
  v_v_scorpio_diesel UUID;
  v_v_seltos_petrol UUID;
  v_v_virtus_petrol UUID;
BEGIN
  -- Get Product IDs
  SELECT id INTO v_p_bosch_bp FROM products WHERE sku = 'AZI-BOSCH-BP-9942' LIMIT 1;
  SELECT id INTO v_p_bosch_of FROM products WHERE sku = 'AZI-BOSCH-OF-1042' LIMIT 1;
  SELECT id INTO v_p_elofic_af FROM products WHERE sku = 'AZI-ELOFIC-AF-8821' LIMIT 1;
  SELECT id INTO v_p_subros_ac FROM products WHERE sku = 'AZI-SUBROS-AC-4011' LIMIT 1;
  SELECT id INTO v_p_minda_hl FROM products WHERE sku = 'AZI-MINDA-HL-7731' LIMIT 1;
  SELECT id INTO v_p_gabriel_sa FROM products WHERE sku = 'AZI-GABRIEL-SA-5021' LIMIT 1;
  SELECT id INTO v_p_valeo_ck FROM products WHERE sku = 'AZI-VALEO-CK-3021' LIMIT 1;
  SELECT id INTO v_p_brembo_bd FROM products WHERE sku = 'AZI-BREMBO-BD-2022' LIMIT 1;

  -- Get Vehicle IDs
  SELECT id INTO v_v_creta_petrol FROM vehicles WHERE make = 'Hyundai' AND model = 'Creta' AND fuel_type = 'Petrol' LIMIT 1;
  SELECT id INTO v_v_creta_diesel FROM vehicles WHERE make = 'Hyundai' AND model = 'Creta' AND fuel_type = 'Diesel' LIMIT 1;
  SELECT id INTO v_v_swift_petrol FROM vehicles WHERE make = 'Maruti Suzuki' AND model = 'Swift' AND fuel_type = 'Petrol' LIMIT 1;
  SELECT id INTO v_v_innova_diesel FROM vehicles WHERE make = 'Toyota' AND model = 'Innova Crysta' AND fuel_type = 'Diesel' LIMIT 1;
  SELECT id INTO v_v_nexon_petrol FROM vehicles WHERE make = 'Tata' AND model = 'Nexon' AND fuel_type = 'Petrol' LIMIT 1;
  SELECT id INTO v_v_scorpio_diesel FROM vehicles WHERE make = 'Mahindra' AND model = 'Scorpio-N' AND fuel_type = 'Diesel' LIMIT 1;
  SELECT id INTO v_v_seltos_petrol FROM vehicles WHERE make = 'Kia' AND model = 'Seltos' AND fuel_type = 'Petrol' LIMIT 1;
  SELECT id INTO v_v_virtus_petrol FROM vehicles WHERE make = 'Volkswagen' AND model = 'Virtus' AND fuel_type = 'Petrol' LIMIT 1;

  -- 1. Bosch Front Brake Pad -> Hyundai Creta (2018-2022 Petrol)
  IF v_p_bosch_bp IS NOT NULL AND v_v_creta_petrol IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_bosch_bp, v_v_creta_petrol, '100% Guaranteed Exact OE Front Axle Fitment for Hyundai Creta (2018-2022) 1.6L / 1.5L Petrol')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 2. Bosch Front Brake Pad -> Hyundai Creta (2015-2026 Diesel)
  IF v_p_bosch_bp IS NOT NULL AND v_v_creta_diesel IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_bosch_bp, v_v_creta_diesel, '100% Guaranteed Exact OE Front Axle Fitment for Hyundai Creta (2015-2026) 1.5L / 1.6L CRDi Diesel')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 3. Bosch Front Brake Pad -> Kia Seltos (2019-2026 Petrol)
  IF v_p_bosch_bp IS NOT NULL AND v_v_seltos_petrol IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_bosch_bp, v_v_seltos_petrol, 'Direct OE Front Disc Brake Pad Fitment for Kia Seltos (2019-2026) 1.5L Petrol / Turbo')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 4. Brembo Disc Rotor -> Hyundai Creta (2018-2022 Petrol)
  IF v_p_brembo_bd IS NOT NULL AND v_v_creta_petrol IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_brembo_bd, v_v_creta_petrol, 'High Performance Ventilated Front Disc Rotor Pair for Hyundai Creta (2018-2022) Petrol')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 5. Valeo Clutch Kit -> Maruti Suzuki Swift (2018-2024 Petrol)
  IF v_p_valeo_ck IS NOT NULL AND v_v_swift_petrol IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_valeo_ck, v_v_swift_petrol, 'Complete 3-Piece OE Clutch Kit for Maruti Suzuki Swift (2018-2024) 1.2L K-Series Petrol')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 6. Gabriel Shock Absorbers -> Toyota Innova Crysta (2016-2026 Diesel)
  IF v_p_gabriel_sa IS NOT NULL AND v_v_innova_diesel IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_gabriel_sa, v_v_innova_diesel, 'Heavy Duty Gas-Charged Front Shock Absorber Pair for Toyota Innova Crysta (2016-2026) 2.4L Diesel')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 7. Elofic Air Filter -> Tata Nexon (2017-2026 Petrol)
  IF v_p_elofic_af IS NOT NULL AND v_v_nexon_petrol IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_elofic_af, v_v_nexon_petrol, 'High-Airflow Engine Air Filter for Tata Nexon (2017-2026) 1.2L Revotron Turbo Petrol')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

  -- 8. Subros AC Compressor -> Mahindra Scorpio-N (2022-2026 Diesel)
  IF v_p_subros_ac IS NOT NULL AND v_v_scorpio_diesel IS NOT NULL THEN
    INSERT INTO product_compatibility (product_id, vehicle_id, notes) VALUES
    (v_p_subros_ac, v_v_scorpio_diesel, 'Original OE Swash-Plate AC Compressor Assembly for Mahindra Scorpio-N (2022-2026) 2.2L mHawk Diesel')
    ON CONFLICT (product_id, vehicle_id) DO UPDATE SET notes = EXCLUDED.notes;
  END IF;

END $$;
