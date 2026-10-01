-- =========================================================
-- NEXUS BI: MULTI-STORE & PRICE COMPARISON EXTENDED SEED DATA
-- =========================================================

-- Clear existing offers and price history
DELETE FROM price_alerts;
DELETE FROM price_history;
DELETE FROM product_offers;

-- Insert or Update expanded categories
INSERT INTO categories (id, name, slug, description, icon, image_url) VALUES
(1, 'Electronics', 'electronics', 'High-performance audio, computing, visual gear and gadgets', 'cpu', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
(2, 'Computers & Laptops', 'laptops', 'Ultrabooks, gaming rigs, workstations, and high-RAM coding machines', 'laptop', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'),
(3, 'Mobile Phones & Tablets', 'mobiles', 'Flagship 5G smartphones, foldable displays, and stylus tablets', 'smartphone', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'),
(4, 'TV, Audio & Video', 'audio-video', '4K OLED smart screens, soundbars, DACs, and studio monitors', 'tv', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80'),
(5, 'Food & Grocery', 'food-grocery', 'Premium basmati rice, cold-pressed oils, artisanal spices, and dry fruits', 'shopping-bag', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'),
(6, 'Dairy & Fresh', 'dairy-fresh', 'Farm-fresh milk, organic paneer, artisanal butter, ghee, and seasonal fruits', 'coffee', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80'),
(7, 'Daily Essentials', 'daily-essentials', 'Botanical body wash, active hair care, natural cleaners, and detergents', 'sparkles', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'),
(8, 'Agriculture & Farming', 'agriculture', 'Certified seeds, biofertilizers, precision drip irrigation, and harvesting tools', 'leaf', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'),
(9, 'Fashion & Apparel', 'fashion', 'Designer minimalist tailoring, raw denim, cashmere, and outerwear', 'shirt', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80'),
(10, 'Home & Living', 'home-living', 'Architectural lighting, ergonomic walnut stands, and ceramic homeware', 'home', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'),
(11, 'Beauty & Personal Care', 'beauty', 'Clinical serums, micro-current sculptors, barrier oils, and perfumes', 'smile', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'),
(12, 'Sports & Fitness', 'sports', 'Ultralight trail packs, connected smart rowers, and carbon trek poles', 'activity', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  imageUrl = EXCLUDED.imageUrl;

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
