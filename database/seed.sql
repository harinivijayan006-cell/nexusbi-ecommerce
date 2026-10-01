-- =========================================================
-- NexusBI Platform Seed Data
-- =========================================================

-- Clear existing data if any (in reverse dependency order)
DELETE FROM reviews;
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, icon, image_url) VALUES
(1, 'Electronics', 'electronics', 'Cutting-edge gadgets, computing, and high-fidelity audio equipment', 'cpu', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80'),
(2, 'Fashion & Apparel', 'fashion', 'Contemporary minimalist apparel, premium fabrics, and timeless outerwear', 'shirt', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80'),
(3, 'Home & Living', 'home-living', 'Architectural interior essentials, ergonomic lighting, and homeware', 'home', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'),
(4, 'Beauty & Personal Care', 'beauty', 'Botanical formulations, clinical skincare, and daily ritual essentials', 'sparkles', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'),
(5, 'Sports & Outdoors', 'sports', 'High-performance athletics gear, trail essentials, and training equipment', 'activity', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'),
(6, 'Accessories', 'accessories', 'Handcrafted leather goods, precision timepieces, and everyday carry', 'watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'),
(7, 'Books & Media', 'books', 'Curated architectural monographs, philosophy, design, and literature', 'book-open', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80');

ALTER SEQUENCE categories_id_seq RESTART WITH 8;

-- 2. Insert Users
INSERT INTO users (id, uid, name, email, role, phone, avatar_url, created_at) VALUES
(1, 'admin_nexus_master', 'Admin Director', 'admin@nexusbi.com', 'admin', '+1 (555) 019-2834', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '120 days'),
(2, 'user_sarah_01', 'Sarah Connor', 'sarah.connor@example.com', 'customer', '+1 (555) 123-4567', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '90 days'),
(3, 'user_david_02', 'David Miller', 'david.m@example.com', 'customer', '+1 (555) 234-5678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '85 days'),
(4, 'user_elena_03', 'Elena Rostova', 'elena.r@example.com', 'customer', '+1 (555) 345-6789', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '80 days'),
(5, 'user_james_04', 'James Wilson', 'j.wilson@example.com', 'customer', '+1 (555) 456-7890', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '75 days'),
(6, 'user_maria_05', 'Maria Garcia', 'm.garcia@example.com', 'customer', '+1 (555) 567-8901', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '65 days'),
(7, 'user_alex_06', 'Alex Chen', 'alex.chen@example.com', 'customer', '+1 (555) 678-9012', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '60 days'),
(8, 'user_priya_07', 'Priya Sharma', 'priya.s@example.com', 'customer', '+1 (555) 789-0123', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '50 days'),
(9, 'user_marcus_08', 'Marcus Brody', 'm.brody@example.com', 'customer', '+1 (555) 890-1234', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '45 days'),
(10, 'user_chloe_09', 'Chloe Bennett', 'chloe.b@example.com', 'customer', '+1 (555) 901-2345', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '40 days'),
(11, 'user_liam_10', 'Liam O''Connor', 'liam.oc@example.com', 'customer', '+1 (555) 012-3456', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '35 days'),
(12, 'user_sophia_11', 'Sophia Martinez', 'sophia.m@example.com', 'customer', '+1 (555) 123-9876', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '28 days'),
(13, 'user_daniel_12', 'Daniel Jackson', 'd.jackson@example.com', 'customer', '+1 (555) 234-8765', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '21 days'),
(14, 'user_emma_13', 'Emma Watson', 'emma.w@example.com', 'customer', '+1 (555) 345-7654', 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '14 days'),
(15, 'user_noah_14', 'Noah Taylor', 'noah.t@example.com', 'customer', '+1 (555) 456-6543', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '7 days'),
(16, 'user_olivia_15', 'Olivia Brown', 'olivia.b@example.com', 'customer', '+1 (555) 567-5432', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', NOW() - INTERVAL '3 days');

ALTER SEQUENCE users_id_seq RESTART WITH 17;

-- 3. Insert Products (35 realistic items)
INSERT INTO products (id, category_id, name, description, price, discount, stock, rating, review_count, image_url, brand, is_featured, views_count, created_at) VALUES
-- Category 1: Electronics
(1, 1, 'AeroSound Pro Wireless ANC Headphones', 'Spatial audio with 40mm beryllium drivers, active hybrid noise cancellation, and 45-hour ultra endurance battery.', 349.00, 10, 42, 4.9, 128, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'AeroAudio', true, 1420, NOW() - INTERVAL '90 days'),
(2, 1, 'Apex Pro Mechanical Studio Keyboard', 'Custom lubricated linear switches, solid anodized aluminum chassis, gasket mount, and per-key RGB backlighting.', 189.00, 0, 18, 4.8, 86, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 'ApexKeys', true, 940, NOW() - INTERVAL '85 days'),
(3, 1, 'PulseCore 4K OLED Ultra-Wide Monitor', '34-inch curved QD-OLED display, 175Hz refresh rate, 0.03ms response time, 99.3% DCI-P3 color calibration for creators.', 899.00, 15, 8, 4.9, 64, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 'PulseCore', true, 2100, NOW() - INTERVAL '80 days'),
(4, 1, 'Spectra Hi-Fi Lossless DAC & Amp', 'Dual ESS Sabre ES9038Q2M architecture, balanced 4.4mm output, THX AAA amplification module for audiophile precision.', 220.00, 5, 24, 4.7, 39, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', 'Spectra', false, 480, NOW() - INTERVAL '70 days'),
(5, 1, 'Nomad MagSafe Multi-Device Power Bank', '25,000mAh bi-directional 100W PD charging, titanium enclosure, and wireless magnetic puck for on-the-go professionals.', 129.00, 0, 3, 4.6, 92, 'https://images.unsplash.com/photo-1609592807664-8848db96541f?w=800&auto=format&fit=crop&q=80', 'NomadLab', false, 750, NOW() - INTERVAL '60 days'),

-- Category 2: Fashion & Apparel
(6, 2, 'Merino Wool Thermal Trench Coat', 'Superfine 18.5 micron Australian merino wool, structured raglan silhouette, water-repellent eco-finish.', 420.00, 10, 14, 4.9, 45, 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80', 'Atelier Nord', true, 1150, NOW() - INTERVAL '85 days'),
(7, 2, 'Raw Japanese Selvedge Denim Jean', '14.5oz Kuroki mill denim, rope-dyed indigo, vintage shuttle loom weave with tailored modern tapered cut.', 175.00, 0, 29, 4.8, 71, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80', 'Kuroki Craft', false, 820, NOW() - INTERVAL '75 days'),
(8, 2, 'Cashmere Ribbed Minimalist Crewneck', '100% Grade-A Mongolian cashmere, 2-ply yarn for cloud-like softness and thermal regulation.', 210.00, 20, 19, 4.7, 53, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 'Atelier Nord', true, 680, NOW() - INTERVAL '65 days'),
(9, 2, 'Ventile Weatherproof Parka', 'Original military-spec 100% dense woven cotton, windproof and breathable without synthetic membranes.', 380.00, 0, 4, 4.9, 32, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80', 'Ventile Co', false, 510, NOW() - INTERVAL '55 days'),
(10, 2, 'Organic Heavyweight French Terry Hoodie', '480 GSM unbrushed organic cotton looped interior, double-lined hood, and pre-shrunk garment dye.', 125.00, 0, 38, 4.6, 110, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 'Kuroki Craft', false, 930, NOW() - INTERVAL '50 days'),

-- Category 3: Home & Living
(11, 3, 'Lumina Concrete & Brass Desk Lamp', 'Hand-cast architectural concrete base, brushed solid brass arm, stepless touch-dimming high-CRI LED.', 165.00, 0, 22, 4.8, 62, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 'Forma Studio', true, 890, NOW() - INTERVAL '80 days'),
(12, 3, 'Artisan Ceramic Pour-Over Dripper Set', 'Wheel-thrown stoneware carafe with dual-layer titanium micro-mesh dripper and walnut collar.', 88.00, 10, 35, 4.7, 95, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 'Kanso Ceramics', false, 1120, NOW() - INTERVAL '70 days'),
(13, 3, 'Kyoto Hinoki Cypress Essential Oil Diffuser', 'Waterless nebulizing ultrasonic diffuser carved from sustainably harvested aged Japanese Hinoki timber.', 145.00, 0, 11, 4.9, 41, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80', 'Kanso Living', true, 670, NOW() - INTERVAL '60 days'),
(14, 3, 'Loomed Linen Waffle Throw Blanket', 'Pre-washed French flax linen, breathable waffle texture for year-round temperature balanced comfort.', 115.00, 15, 2, 4.6, 38, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', 'Forma Studio', false, 430, NOW() - INTERVAL '45 days'),
(15, 3, 'Ergonomic Walnut Monitor Stand & Drawer', 'Solid American black walnut riser with aluminum pull-out storage drawer and integrated cable router.', 130.00, 0, 16, 4.8, 77, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80', 'Forma Studio', false, 820, NOW() - INTERVAL '40 days'),

-- Category 4: Beauty & Personal Care
(16, 4, 'Botanical Squalane Repair Elixir 50ml', 'Plant-derived squalane infused with bakuchiol, rosehip seed oil, and blue tansy for barrier renewal.', 68.00, 0, 48, 4.9, 142, 'https://images.unsplash.com/photo-1608248597359-00f7e651e60f?w=800&auto=format&fit=crop&q=80', 'Verve Botanics', true, 1310, NOW() - INTERVAL '85 days'),
(17, 4, 'Peptide Collagen Firming Complex Serum', 'Multi-weight hyaluronic acid matrix with copper peptides and niacinamide for cellular hydration.', 84.00, 10, 31, 4.8, 88, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', 'Verve Botanics', false, 950, NOW() - INTERVAL '75 days'),
(18, 4, 'Sonic Ionized Facial Sculptor', 'Micro-current lymphatic drainage wand with red and near-infrared phototherapy for facial rejuvenation.', 195.00, 20, 5, 4.7, 56, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 'Aura Skincare', true, 780, NOW() - INTERVAL '65 days'),
(19, 4, 'Cedar & Vetiver Botanical Eau de Parfum', 'Artisanal cold-extracted fragrance featuring Haitian vetiver, Atlas cedarwood, pink pepper, and amber.', 135.00, 0, 20, 4.8, 64, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80', 'Aura Parfums', false, 610, NOW() - INTERVAL '50 days'),
(20, 4, 'Mineral Marine Daily Sun Shield SPF 50', 'Non-nano zinc oxide sunscreen with ectoin and astaxanthin antioxidant defense, sheer matte finish.', 42.00, 0, 55, 4.6, 175, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80', 'Verve Botanics', false, 1450, NOW() - INTERVAL '40 days'),

-- Category 5: Sports & Outdoors
(21, 5, 'Ultralight Dyneema Trail Running Pack 18L', 'Constructed from waterproof Composite Fabric, vest harness with dual hydration flask pockets.', 190.00, 0, 12, 4.9, 58, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'Summit Gear', true, 890, NOW() - INTERVAL '80 days'),
(22, 5, 'Carbon Fiber Quick-Lock Trekking Poles', '100% 3K carbon fiber shaft, cork ergonomic grips, tungsten carbide tips, weighs only 190g per pole.', 110.00, 10, 26, 4.8, 93, 'https://images.unsplash.com/photo-1486825586573-7131f7991bdd?w=800&auto=format&fit=crop&q=80', 'Summit Gear', false, 720, NOW() - INTERVAL '70 days'),
(23, 5, 'Smart Dual-Resistance Indoor Rowing Machine', 'Magnetic + water dual resistance, Bluetooth FTMS connected metrics, fold-away aerospace aluminum frame.', 980.00, 15, 6, 4.9, 34, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', 'Veloce Labs', true, 1640, NOW() - INTERVAL '60 days'),
(24, 5, 'Aerodynamic Gravel Cycling Helmet', 'MIPS Air rotational brain protection system, 18 optimized wind-tunnel vents, magnetic Fidlock buckle.', 160.00, 0, 18, 4.7, 49, 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&auto=format&fit=crop&q=80', 'Veloce Labs', false, 580, NOW() - INTERVAL '45 days'),
(25, 5, 'Thermal Insulated Titanium Camp Cookset', 'Grade 1 pure ultralight titanium 800ml pot with nesting insulated mug and folding titanium spork.', 75.00, 0, 4, 4.8, 82, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80', 'Summit Gear', false, 490, NOW() - INTERVAL '30 days'),

-- Category 6: Accessories
(26, 6, 'Horween Chromexcel Full-Grain Leather Wallet', 'Hand-stitched with waxed linen thread, 6 card slots, cash pocket, develops a rich patina over decades.', 85.00, 0, 32, 4.9, 130, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', 'Heritage Leather', true, 1290, NOW() - INTERVAL '90 days'),
(27, 6, 'Automatic 38mm Minimalist Bauhaus Timepiece', 'Miyota 9015 high-beat movement, sapphire crystal with AR coating, Italian vegetable-tanned leather strap.', 395.00, 10, 15, 4.9, 78, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', 'Chronos Atelier', true, 1750, NOW() - INTERVAL '80 days'),
(28, 6, 'Grade 5 Titanium Everyday Carry Multi-Tool', 'CNC machined pry bar, bottle opener, bit driver, pocket clip, with tritium illumination slot.', 65.00, 0, 40, 4.6, 65, 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=800&auto=format&fit=crop&q=80', 'Titan Works', false, 420, NOW() - INTERVAL '65 days'),
(29, 6, 'Polarized Acetate Square Frame Sunglasses', 'Mazzucchelli Italian acetate frame, Japanese 7-barrel hinges, polarized CR-39 lenses with 100% UV400.', 140.00, 15, 23, 4.7, 84, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', 'Spectacle Co', false, 860, NOW() - INTERVAL '50 days'),
(30, 6, 'Waxed Cotton Canvas Weekender Duffel', '18oz Martexin grid-waxed cotton canvas, solid brass hardware, and bridle leather carry handles.', 240.00, 0, 7, 4.8, 52, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'Heritage Leather', true, 920, NOW() - INTERVAL '35 days'),

-- Category 7: Books & Media
(31, 7, 'Principles of Modern Architectural Form', 'A comprehensive visual study on brutalism, spatial volume, and sustainable contemporary structures. Hardcover.', 65.00, 0, 27, 4.9, 44, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', 'Nexus Press', true, 630, NOW() - INTERVAL '80 days'),
(32, 7, 'The Bauhaus Archive: 1919-1933 Monograph', 'Definitive illustrated retrospective of the revolutionary German design school with restored archival photographs.', 85.00, 10, 19, 4.8, 61, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80', 'Nexus Press', false, 570, NOW() - INTERVAL '70 days'),
(33, 7, 'Systems Thinking for Product Designers', 'Frameworks for designing resilient, scalable software interfaces and cognitive physical ergonomics.', 48.00, 0, 35, 4.7, 89, 'https://images.unsplash.com/photo-1532012164546-f432f2e3725b?w=800&auto=format&fit=crop&q=80', 'Nexus Press', false, 810, NOW() - INTERVAL '55 days'),
(34, 7, 'Nordic Aesthetics: Light, Wood & Form', 'Exploration of Scandinavian functionalism, crafted wood joinery, and biophilic architectural spaces.', 54.00, 0, 22, 4.8, 38, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80', 'Forma Publications', false, 450, NOW() - INTERVAL '40 days'),
(35, 7, 'The Art of Analog Photography & Darkroom', 'Mastering silver gelatin prints, large format field cameras, and classic optical chemistry printing.', 58.00, 5, 14, 4.9, 29, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80', 'Nexus Press', false, 390, NOW() - INTERVAL '25 days');

ALTER SEQUENCE products_id_seq RESTART WITH 36;

-- 4. Insert Realistic Orders across past 90 days (35 orders)
INSERT INTO orders (id, order_number, user_id, customer_name, customer_email, shipping_address, phone, subtotal, discount_amount, tax, shipping_fee, total_amount, payment_status, order_status, payment_method, notes, created_at) VALUES
(1, 'ORD-2026-1001', 2, 'Sarah Connor', 'sarah.connor@example.com', '742 Evergreen Terrace, Seattle, WA 98101', '+1 555-123-4567', 314.10, 34.90, 25.13, 0.00, 339.23, 'paid', 'delivered', 'credit_card', 'Please leave at front door', NOW() - INTERVAL '85 days'),
(2, 'ORD-2026-1002', 3, 'David Miller', 'david.m@example.com', '124 Conch Street, Portland, OR 97201', '+1 555-234-5678', 899.00, 134.85, 61.13, 0.00, 825.28, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '80 days'),
(3, 'ORD-2026-1003', 4, 'Elena Rostova', 'elena.r@example.com', '55 Wall Street, New York, NY 10005', '+1 555-345-6789', 378.00, 42.00, 30.24, 0.00, 408.24, 'paid', 'delivered', 'apple_pay', 'Fragile package', NOW() - INTERVAL '76 days'),
(4, 'ORD-2026-1004', 5, 'James Wilson', 'j.wilson@example.com', '400 Pine St, San Francisco, CA 94104', '+1 555-456-7890', 189.00, 0.00, 15.12, 12.00, 216.12, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '72 days'),
(5, 'ORD-2026-1005', 6, 'Maria Garcia', 'm.garcia@example.com', '820 Michigan Ave, Chicago, IL 60611', '+1 555-567-8901', 152.00, 0.00, 12.16, 12.00, 176.16, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '68 days'),
(6, 'ORD-2026-1006', 7, 'Alex Chen', 'alex.chen@example.com', '101 Market St, Austin, TX 78701', '+1 555-678-9012', 434.00, 20.00, 33.12, 0.00, 447.12, 'paid', 'delivered', 'paypal', 'Gate code 4920', NOW() - INTERVAL '64 days'),
(7, 'ORD-2026-1007', 8, 'Priya Sharma', 'priya.s@example.com', '935 Pennsylvania Ave, Washington, DC 20004', '+1 555-789-0123', 85.00, 0.00, 6.80, 8.00, 99.80, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '60 days'),
(8, 'ORD-2026-1008', 9, 'Marcus Brody', 'm.brody@example.com', '330 Biscayne Blvd, Miami, FL 33132', '+1 555-890-1234', 355.50, 39.50, 25.28, 0.00, 380.78, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '58 days'),
(9, 'ORD-2026-1009', 10, 'Chloe Bennett', 'chloe.b@example.com', '120 Boylston St, Boston, MA 02116', '+1 555-901-2345', 210.00, 0.00, 16.80, 0.00, 226.80, 'paid', 'delivered', 'apple_pay', '', NOW() - INTERVAL '54 days'),
(10, 'ORD-2026-1010', 2, 'Sarah Connor', 'sarah.connor@example.com', '742 Evergreen Terrace, Seattle, WA 98101', '+1 555-123-4567', 165.00, 0.00, 13.20, 0.00, 178.20, 'paid', 'delivered', 'credit_card', 'Second order', NOW() - INTERVAL '50 days'),
(11, 'ORD-2026-1011', 11, 'Liam O''Connor', 'liam.oc@example.com', '500 Grand Ave, Denver, CO 80202', '+1 555-012-3456', 980.00, 147.00, 66.64, 0.00, 899.64, 'paid', 'delivered', 'credit_card', 'Heavy equipment', NOW() - INTERVAL '47 days'),
(12, 'ORD-2026-1012', 12, 'Sophia Martinez', 'sophia.m@example.com', '700 Louisiana St, Houston, TX 77002', '+1 555-123-9876', 156.00, 15.60, 11.23, 10.00, 161.63, 'paid', 'delivered', 'paypal', '', NOW() - INTERVAL '44 days'),
(13, 'ORD-2026-1013', 3, 'David Miller', 'david.m@example.com', '124 Conch Street, Portland, OR 97201', '+1 555-234-5678', 349.00, 34.90, 25.13, 0.00, 339.23, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '41 days'),
(14, 'ORD-2026-1014', 13, 'Daniel Jackson', 'd.jackson@example.com', '210 Peachtree St, Atlanta, GA 30303', '+1 555-234-8765', 190.00, 0.00, 15.20, 0.00, 205.20, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '38 days'),
(15, 'ORD-2026-1015', 14, 'Emma Watson', 'emma.w@example.com', '150 California St, San Francisco, CA 94111', '+1 555-345-7654', 240.00, 0.00, 19.20, 0.00, 259.20, 'paid', 'delivered', 'apple_pay', '', NOW() - INTERVAL '35 days'),
(16, 'ORD-2026-1016', 4, 'Elena Rostova', 'elena.r@example.com', '55 Wall Street, New York, NY 10005', '+1 555-345-6789', 525.00, 52.50, 37.80, 0.00, 510.30, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '31 days'),
(17, 'ORD-2026-1017', 7, 'Alex Chen', 'alex.chen@example.com', '101 Market St, Austin, TX 78701', '+1 555-678-9012', 395.00, 39.50, 28.44, 0.00, 383.94, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '28 days'),
(18, 'ORD-2026-1018', 15, 'Noah Taylor', 'noah.t@example.com', '600 Nicollet Mall, Minneapolis, MN 55402', '+1 555-456-6543', 113.00, 0.00, 9.04, 8.00, 130.04, 'paid', 'delivered', 'paypal', '', NOW() - INTERVAL '25 days'),
(19, 'ORD-2026-1019', 5, 'James Wilson', 'j.wilson@example.com', '400 Pine St, San Francisco, CA 94104', '+1 555-456-7890', 698.00, 69.80, 50.26, 0.00, 678.46, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '22 days'),
(20, 'ORD-2026-1020', 6, 'Maria Garcia', 'm.garcia@example.com', '820 Michigan Ave, Chicago, IL 60611', '+1 555-567-8901', 209.00, 20.90, 15.05, 0.00, 203.15, 'paid', 'delivered', 'apple_pay', '', NOW() - INTERVAL '20 days'),
(21, 'ORD-2026-1021', 16, 'Olivia Brown', 'olivia.b@example.com', '801 Brickell Ave, Miami, FL 33131', '+1 555-567-5432', 88.00, 8.80, 6.34, 8.00, 93.54, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '18 days'),
(22, 'ORD-2026-1022', 8, 'Priya Sharma', 'priya.s@example.com', '935 Pennsylvania Ave, Washington, DC 20004', '+1 555-789-0123', 279.00, 0.00, 22.32, 0.00, 301.32, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '16 days'),
(23, 'ORD-2026-1023', 9, 'Marcus Brody', 'm.brody@example.com', '330 Biscayne Blvd, Miami, FL 33132', '+1 555-890-1234', 899.00, 134.85, 61.13, 0.00, 825.28, 'paid', 'delivered', 'credit_card', '', NOW() - INTERVAL '14 days'),
(24, 'ORD-2026-1024', 10, 'Chloe Bennett', 'chloe.b@example.com', '120 Boylston St, Boston, MA 02116', '+1 555-901-2345', 156.00, 31.20, 9.98, 8.00, 142.78, 'paid', 'delivered', 'apple_pay', '', NOW() - INTERVAL '12 days'),
(25, 'ORD-2026-1025', 11, 'Liam O''Connor', 'liam.oc@example.com', '500 Grand Ave, Denver, CO 80202', '+1 555-012-3456', 220.00, 11.00, 16.72, 0.00, 225.72, 'paid', 'shipped', 'credit_card', '', NOW() - INTERVAL '9 days'),
(26, 'ORD-2026-1026', 12, 'Sophia Martinez', 'sophia.m@example.com', '700 Louisiana St, Houston, TX 77002', '+1 555-123-9876', 420.00, 42.00, 30.24, 0.00, 408.24, 'paid', 'shipped', 'credit_card', '', NOW() - INTERVAL '8 days'),
(27, 'ORD-2026-1027', 2, 'Sarah Connor', 'sarah.connor@example.com', '742 Evergreen Terrace, Seattle, WA 98101', '+1 555-123-4567', 175.00, 0.00, 14.00, 0.00, 189.00, 'paid', 'shipped', 'credit_card', 'VIP Customer', NOW() - INTERVAL '7 days'),
(28, 'ORD-2026-1028', 13, 'Daniel Jackson', 'd.jackson@example.com', '210 Peachtree St, Atlanta, GA 30303', '+1 555-234-8765', 314.10, 34.90, 25.13, 0.00, 339.23, 'paid', 'processing', 'paypal', '', NOW() - INTERVAL '5 days'),
(29, 'ORD-2026-1029', 14, 'Emma Watson', 'emma.w@example.com', '150 California St, San Francisco, CA 94111', '+1 555-345-7654', 160.00, 0.00, 12.80, 0.00, 172.80, 'paid', 'processing', 'apple_pay', '', NOW() - INTERVAL '4 days'),
(30, 'ORD-2026-1030', 3, 'David Miller', 'david.m@example.com', '124 Conch Street, Portland, OR 97201', '+1 555-234-5678', 210.00, 42.00, 13.44, 0.00, 181.44, 'paid', 'confirmed', 'credit_card', '', NOW() - INTERVAL '3 days'),
(31, 'ORD-2026-1031', 15, 'Noah Taylor', 'noah.t@example.com', '600 Nicollet Mall, Minneapolis, MN 55402', '+1 555-456-6543', 189.00, 0.00, 15.12, 0.00, 204.12, 'paid', 'confirmed', 'credit_card', '', NOW() - INTERVAL '2 days'),
(32, 'ORD-2026-1032', 7, 'Alex Chen', 'alex.chen@example.com', '101 Market St, Austin, TX 78701', '+1 555-678-9012', 349.00, 34.90, 25.13, 0.00, 339.23, 'paid', 'confirmed', 'credit_card', '', NOW() - INTERVAL '1 day'),
(33, 'ORD-2026-1033', 16, 'Olivia Brown', 'olivia.b@example.com', '801 Brickell Ave, Miami, FL 33131', '+1 555-567-5432', 125.00, 0.00, 10.00, 8.00, 143.00, 'paid', 'confirmed', 'paypal', '', NOW() - INTERVAL '18 hours'),
(34, 'ORD-2026-1034', 4, 'Elena Rostova', 'elena.r@example.com', '55 Wall Street, New York, NY 10005', '+1 555-345-6789', 240.00, 0.00, 19.20, 0.00, 259.20, 'paid', 'confirmed', 'apple_pay', '', NOW() - INTERVAL '8 hours'),
(35, 'ORD-2026-1035', 6, 'Maria Garcia', 'm.garcia@example.com', '820 Michigan Ave, Chicago, IL 60611', '+1 555-567-8901', 349.00, 34.90, 25.13, 0.00, 339.23, 'paid', 'pending', 'credit_card', '', NOW() - INTERVAL '2 hours');

ALTER SEQUENCE orders_id_seq RESTART WITH 36;

-- 5. Insert Order Items
INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price) VALUES
(1, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1, 314.10, 314.10),
(2, 3, 'PulseCore 4K OLED Ultra-Wide Monitor', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 1, 764.15, 764.15),
(3, 6, 'Merino Wool Thermal Trench Coat', 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80', 1, 378.00, 378.00),
(4, 2, 'Apex Pro Mechanical Studio Keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 1, 189.00, 189.00),
(5, 16, 'Botanical Squalane Repair Elixir 50ml', 'https://images.unsplash.com/photo-1608248597359-00f7e651e60f?w=800&auto=format&fit=crop&q=80', 1, 68.00, 68.00),
(5, 17, 'Peptide Collagen Firming Complex Serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', 1, 84.00, 84.00),
(6, 8, 'Cashmere Ribbed Minimalist Crewneck', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 1, 168.00, 168.00),
(6, 26, 'Horween Chromexcel Full-Grain Leather Wallet', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', 1, 85.00, 85.00),
(6, 7, 'Raw Japanese Selvedge Denim Jean', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80', 1, 175.00, 175.00),
(7, 26, 'Horween Chromexcel Full-Grain Leather Wallet', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80', 1, 85.00, 85.00),
(8, 27, 'Automatic 38mm Minimalist Bauhaus Timepiece', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', 1, 355.50, 355.50),
(9, 8, 'Cashmere Ribbed Minimalist Crewneck', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 1, 210.00, 210.00),
(10, 11, 'Lumina Concrete & Brass Desk Lamp', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', 1, 165.00, 165.00),
(11, 23, 'Smart Dual-Resistance Indoor Rowing Machine', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', 1, 833.00, 833.00),
(12, 12, 'Artisan Ceramic Pour-Over Dripper Set', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 1, 79.20, 79.20),
(12, 31, 'Principles of Modern Architectural Form', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', 1, 65.00, 65.00),
(13, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1, 314.10, 314.10),
(14, 21, 'Ultralight Dyneema Trail Running Pack 18L', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 1, 190.00, 190.00),
(15, 30, 'Waxed Cotton Canvas Weekender Duffel', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 1, 240.00, 240.00),
(16, 6, 'Merino Wool Thermal Trench Coat', 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80', 1, 378.00, 378.00),
(16, 13, 'Kyoto Hinoki Cypress Essential Oil Diffuser', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80', 1, 145.00, 145.00),
(17, 27, 'Automatic 38mm Minimalist Bauhaus Timepiece', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', 1, 355.50, 355.50),
(18, 31, 'Principles of Modern Architectural Form', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80', 1, 65.00, 65.00),
(18, 33, 'Systems Thinking for Product Designers', 'https://images.unsplash.com/photo-1532012164546-f432f2e3725b?w=800&auto=format&fit=crop&q=80', 1, 48.00, 48.00),
(19, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 2, 314.10, 628.20),
(20, 18, 'Sonic Ionized Facial Sculptor', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', 1, 156.00, 156.00),
(21, 12, 'Artisan Ceramic Pour-Over Dripper Set', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 1, 79.20, 79.20),
(22, 4, 'Spectra Hi-Fi Lossless DAC & Amp', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', 1, 209.00, 209.00),
(23, 3, 'PulseCore 4K OLED Ultra-Wide Monitor', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', 1, 764.15, 764.15),
(24, 8, 'Cashmere Ribbed Minimalist Crewneck', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 1, 168.00, 168.00),
(25, 4, 'Spectra Hi-Fi Lossless DAC & Amp', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80', 1, 209.00, 209.00),
(26, 6, 'Merino Wool Thermal Trench Coat', 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80', 1, 378.00, 378.00),
(27, 7, 'Raw Japanese Selvedge Denim Jean', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80', 1, 175.00, 175.00),
(28, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1, 314.10, 314.10),
(29, 24, 'Aerodynamic Gravel Cycling Helmet', 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&auto=format&fit=crop&q=80', 1, 160.00, 160.00),
(30, 8, 'Cashmere Ribbed Minimalist Crewneck', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', 1, 168.00, 168.00),
(31, 2, 'Apex Pro Mechanical Studio Keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 1, 189.00, 189.00),
(32, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1, 314.10, 314.10),
(33, 10, 'Organic Heavyweight French Terry Hoodie', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 1, 125.00, 125.00),
(34, 30, 'Waxed Cotton Canvas Weekender Duffel', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 1, 240.00, 240.00),
(35, 1, 'AeroSound Pro Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1, 314.10, 314.10);

-- 6. Insert Payments
INSERT INTO payments (order_id, payment_method, transaction_id, amount, status, created_at)
SELECT id, payment_method, 'txn_' || md5(random()::text || id::text), total_amount, 'completed', created_at
FROM orders;

-- 7. Insert Reviews
INSERT INTO reviews (user_id, product_id, user_name, rating, comment, created_at) VALUES
(2, 1, 'Sarah Connor', 5, 'Unmatched clarity and comfort. The noise cancellation completely eliminates subway rumble.', NOW() - INTERVAL '80 days'),
(3, 3, 'David Miller', 5, 'The 4K OLED panel is astonishing for color grading and late-night coding sessions.', NOW() - INTERVAL '75 days'),
(4, 6, 'Elena Rostova', 5, 'Exceptional tailoring. Wool drape and thermal insulation are supreme.', NOW() - INTERVAL '70 days'),
(5, 2, 'James Wilson', 5, 'Gasket mounted feel with lubed linear switches is pure tactile bliss.', NOW() - INTERVAL '65 days'),
(6, 16, 'Maria Garcia', 5, 'My skin barrier transformed in two weeks. Lightweight yet deeply nourishing.', NOW() - INTERVAL '60 days'),
(7, 26, 'Alex Chen', 5, 'The Horween leather smells amazing and is already forming a gorgeous patina.', NOW() - INTERVAL '55 days'),
(8, 27, 'Priya Sharma', 5, 'Classic Bauhaus proportions. Gets compliments at every architectural review.', NOW() - INTERVAL '48 days'),
(9, 23, 'Marcus Brody', 5, 'Dual water/magnetic flywheel feels fluid and whisper quiet in apartment living.', NOW() - INTERVAL '40 days'),
(10, 11, 'Chloe Bennett', 5, 'Warm, high-CRI light that illuminates without harsh shadows. A sculptural piece on my desk.', NOW() - INTERVAL '35 days'),
(2, 12, 'Sarah Connor', 4, 'Very consistent extraction flow. Ceramic quality is top tier.', NOW() - INTERVAL '30 days'),
(11, 4, 'Liam O''Connor', 5, 'Drives my 300-ohm headphones effortlessly with black background floor.', NOW() - INTERVAL '20 days'),
(12, 8, 'Sophia Martinez', 5, 'Sublime cashmere hand-feel. Sits elegantly over tailored trousers.', NOW() - INTERVAL '15 days');
