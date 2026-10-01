import dotenv from 'dotenv';
import { like, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { categories, products } from './schema.ts';

dotenv.config();

const TARGET_PRODUCT_COUNT = 100_000;
const BATCH_SIZE = 2_000;

const categoryData = [
  { name: 'Fashion', slug: 'fashion', subcategories: ['Men\'s Fashion', 'Women\'s Fashion', 'Kids Fashion', 'Shoes', 'Bags', 'Watches', 'Jewellery', 'Sunglasses', 'Sportswear', 'Ethnic Wear'], imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
  { name: 'Electronics', slug: 'electronics', subcategories: ['Mobile Phones', 'Laptops', 'Tablets', 'Headphones', 'Earbuds', 'Smart Watches', 'Cameras', 'TVs', 'Speakers', 'Gaming', 'Computer Accessories'], imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
  { name: 'Home & Living', slug: 'home-living', subcategories: ['Furniture', 'Home Decor', 'Kitchen', 'Home Appliances', 'Lighting', 'Storage', 'Bathroom', 'Bedroom', 'Garden', 'Cleaning Products'], imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800' },
  { name: 'Beauty & Personal Care', slug: 'beauty', subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Personal Care', 'Grooming', 'Beauty Tools'], imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
  { name: 'Sports & Fitness', slug: 'sports', subcategories: ['Gym Equipment', 'Running', 'Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Cycling', 'Yoga', 'Outdoor Sports'], imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
  { name: 'Food & Grocery', slug: 'food-grocery', subcategories: ['Snacks', 'Beverages', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Cooking Essentials', 'Packaged Food', 'Organic Products', 'International Food'], imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
  { name: 'Baby & Kids', slug: 'baby-kids', subcategories: ['Baby Clothing', 'Toys', 'Baby Care', 'School Supplies', 'Kids Accessories', 'Educational Toys'], imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800' },
  { name: 'Automotive', slug: 'automotive', subcategories: ['Car Accessories', 'Bike Accessories', 'Car Care', 'Automotive Electronics', 'Tools', 'Interior Accessories'], imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' },
  { name: 'Books & Education', slug: 'books-education', subcategories: ['Books', 'Educational Materials', 'Stationery', 'Courses', 'Study Accessories'], imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800' },
  { name: 'Travel', slug: 'travel', subcategories: ['Luggage', 'Backpacks', 'Travel Accessories', 'Camping', 'Outdoor Gear'], imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { name: 'Pet Supplies', slug: 'pet-supplies', subcategories: ['Dog Products', 'Cat Products', 'Pet Food', 'Pet Toys', 'Pet Accessories'], imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800' },
  { name: 'Industrial & Agriculture', slug: 'industrial-agriculture', subcategories: ['Agricultural Equipment', 'Farm Tools', 'Irrigation', 'Gardening', 'Industrial Tools', 'Safety Equipment', 'Machinery Accessories'], imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800' },
  { name: 'Global Products', slug: 'global-products', subcategories: ['Japanese Homeware', 'Korean Beauty', 'European Design', 'American Outdoor Gear', 'International Specialty Food'], imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800' },
] as const;

const genders = ['Men', 'Women', 'Unisex', 'Kids'] as const;

function buildProduct(index: number, categoryIds: Map<string, number>) {
  const category = categoryData[index % categoryData.length];
  const subcategory = category.subcategories[Math.floor(index / categoryData.length) % category.subcategories.length];
  const gender = genders[Math.floor(index / categoryData.length) % genders.length];
  const price = 299 + ((index * 7919) % 149700);

  return {
    categoryId: categoryIds.get(category.slug)!,
    name: `Demo ${subcategory} Item ${String(index + 1).padStart(6, '0')}`,
    description: `Generated demonstration catalog record for ${subcategory}. Product details, pricing, ratings, and availability are illustrative and are not verified merchant data.`,
    price,
    originalPrice: null,
    discount: 0,
    stock: 0,
    rating: 0,
    reviewCount: 0,
    imageUrl: category.imageUrl,
    galleryImages: JSON.stringify([]),
    brand: 'Demo Brand',
    isFeatured: index % 250 === 0,
    viewsCount: 0,
    sku: `BULK-${String(index + 1).padStart(6, '0')}`,
    model: null,
    subcategory,
    gender,
    specs: JSON.stringify({ category: category.name, subcategory, demo: true }),
    features: JSON.stringify([]),
    tags: JSON.stringify([category.slug, subcategory.toLowerCase(), 'demo']),
    country: 'IN',
    currency: 'INR',
    shippingInfo: null,
    deliveryEstimate: null,
    aiScore: null,
    popularityScore: null,
    dataSource: 'demo',
    lowestPrice: null,
    highestPrice: null,
    bestStore: null,
    createdAt: new Date(Date.now() - (index % 365) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  };
}

async function seedBulkProducts() {
  console.log(`Preparing ${TARGET_PRODUCT_COUNT.toLocaleString()} bulk products...`);

  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'Unisex'`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'IN' NOT NULL`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_info TEXT`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_estimate TEXT`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_score DOUBLE PRECISION`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS popularity_score DOUBLE PRECISION`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'demo' NOT NULL`);
  await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL`);
  await db.execute(sql`ALTER TABLE product_offers ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'demo' NOT NULL`);

  for (const category of categoryData) {
    await db.insert(categories).values({
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      subcategories: JSON.stringify(category.subcategories),
      audience: 'All',
    }).onConflictDoUpdate({
      target: categories.slug,
      set: { name: category.name, imageUrl: category.imageUrl, subcategories: JSON.stringify(category.subcategories) },
    });
  }

  const seededCategories = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const categoryIds = new Map(seededCategories.map((category) => [category.slug, category.id]));

  await db.execute(sql`DELETE FROM products WHERE sku LIKE 'BULK-%'`);

  for (let start = 0; start < TARGET_PRODUCT_COUNT; start += BATCH_SIZE) {
    const batch = Array.from(
      { length: Math.min(BATCH_SIZE, TARGET_PRODUCT_COUNT - start) },
      (_, offset) => buildProduct(start + offset, categoryIds),
    );
    await db.insert(products).values(batch);
    console.log(`Inserted ${(start + batch.length).toLocaleString()} / ${TARGET_PRODUCT_COUNT.toLocaleString()}`);
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(like(products.sku, 'BULK-%'));
  console.log(`Bulk seed complete: ${count.toLocaleString()} generated products.`);
  process.exit(0);
}

seedBulkProducts().catch((error) => {
  console.error('Bulk product seed failed:', error);
  process.exit(1);
});
