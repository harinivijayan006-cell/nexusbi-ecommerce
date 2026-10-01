-- =========================================================
-- NexusBI E-Commerce & BI Platform Schema (PostgreSQL)
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'tag',
  image_url TEXT,
  subcategories TEXT,
  parent_id INTEGER,
  audience TEXT DEFAULT 'All',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  discount INTEGER DEFAULT 0 NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  rating DOUBLE PRECISION DEFAULT 4.5 NOT NULL,
  review_count INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT NOT NULL,
  brand TEXT DEFAULT 'Nexus' NOT NULL,
  gender TEXT DEFAULT 'Unisex' NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  original_price DOUBLE PRECISION,
  sku TEXT,
  model TEXT,
  subcategory TEXT,
  specs TEXT,
  features TEXT,
  gallery_images TEXT,
  country TEXT DEFAULT 'IN' NOT NULL,
  shipping_info TEXT,
  delivery_estimate TEXT,
  tags TEXT,
  ai_score DOUBLE PRECISION,
  popularity_score DOUBLE PRECISION,
  data_source TEXT DEFAULT 'demo' NOT NULL,
  lowest_price DOUBLE PRECISION,
  highest_price DOUBLE PRECISION,
  best_store TEXT DEFAULT 'Amazon',
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'IN' NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_info TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_estimate TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_score DOUBLE PRECISION;
ALTER TABLE products ADD COLUMN IF NOT EXISTS popularity_score DOUBLE PRECISION;
ALTER TABLE products ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'demo' NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;

CREATE TABLE IF NOT EXISTS product_offers (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  store_logo TEXT,
  price DOUBLE PRECISION NOT NULL,
  original_price DOUBLE PRECISION,
  currency TEXT DEFAULT 'INR',
  availability TEXT DEFAULT 'In Stock',
  delivery_time TEXT DEFAULT 'Free Delivery - 2 Days',
  seller TEXT DEFAULT 'Official Retailer',
  product_url TEXT,
  data_source TEXT DEFAULT 'demo' NOT NULL,
  is_best_price BOOLEAN DEFAULT FALSE,
  rating DOUBLE PRECISION DEFAULT 4.5,
  warranty TEXT DEFAULT '1 Year Official Warranty',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE product_offers ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'demo' NOT NULL;

CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  recorded_price DOUBLE PRECISION NOT NULL,
  store_name TEXT NOT NULL,
  recorded_date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  target_price DOUBLE PRECISION NOT NULL,
  current_price DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  phone TEXT,
  subtotal DOUBLE PRECISION NOT NULL,
  discount_amount DOUBLE PRECISION DEFAULT 0 NOT NULL,
  tax DOUBLE PRECISION DEFAULT 0 NOT NULL,
  shipping_fee DOUBLE PRECISION DEFAULT 0 NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL,
  payment_status TEXT DEFAULT 'paid' NOT NULL,
  order_status TEXT DEFAULT 'confirmed' NOT NULL,
  payment_method TEXT DEFAULT 'credit_card' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  unit_price DOUBLE PRECISION NOT NULL,
  total_price DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'completed' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Performance Indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category_id, price);
CREATE INDEX IF NOT EXISTS idx_products_category_rating ON products(category_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(data_source);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm ON products USING GIN (brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING GIN (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_trgm ON products USING GIN (subcategory gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_model_trgm ON products USING GIN (model gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_offers_product_price ON product_offers(product_id, price);
CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_status ON price_alerts(product_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
