import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Users table (links with Firebase Auth uid)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or local ID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('customer'), // 'admin' | 'customer'
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon').default('tag'),
  imageUrl: text('image_url'),
  subcategories: text('subcategories'), // JSON array or comma separated
  parentId: integer('parent_id'),
  audience: text('audience').default('All'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(), // Best/Current lowest price
  originalPrice: doublePrecision('original_price'),
  discount: integer('discount').default(0).notNull(), // percent discount
  stock: integer('stock').notNull().default(0),
  rating: doublePrecision('rating').default(4.5).notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  imageUrl: text('image_url').notNull(),
  brand: text('brand').notNull().default('Nexus'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  // Multi-store & specs fields
  sku: text('sku'),
  model: text('model'),
  subcategory: text('subcategory'),
  gender: text('gender').default('Unisex'),
  specs: text('specs'), // JSON stringified specifications
  features: text('features'),
  galleryImages: text('gallery_images'),
  country: text('country').default('IN').notNull(),
  shippingInfo: text('shipping_info'),
  deliveryEstimate: text('delivery_estimate'),
  tags: text('tags'),
  aiScore: doublePrecision('ai_score'),
  popularityScore: doublePrecision('popularity_score'),
  dataSource: text('data_source').default('demo').notNull(),
  lowestPrice: doublePrecision('lowest_price'),
  highestPrice: doublePrecision('highest_price'),
  bestStore: text('best_store').default('Amazon'),
  currency: text('currency').default('INR'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product Offers (from multiple stores: Amazon, Flipkart, Croma, Reliance Digital, etc.)
export const productOffers = pgTable('product_offers', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  storeName: text('store_name').notNull(), // 'Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Tata CLiQ', 'Myntra'
  storeLogo: text('store_logo'),
  price: doublePrecision('price').notNull(),
  originalPrice: doublePrecision('original_price'),
  currency: text('currency').default('INR'),
  availability: text('availability').default('In Stock'),
  deliveryTime: text('delivery_time').default('Free Delivery - 2 Days'),
  seller: text('seller').default('Official Retailer'),
  productUrl: text('product_url'),
  dataSource: text('data_source').default('demo').notNull(),
  isBestPrice: boolean('is_best_price').default(false),
  rating: doublePrecision('rating').default(4.5),
  warranty: text('warranty').default('1 Year Official Warranty'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// Price History table (for 30d, 90d, 6m, 1y interactive charts)
export const priceHistory = pgTable('price_history', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  recordedPrice: doublePrecision('recorded_price').notNull(),
  storeName: text('store_name').notNull(),
  recordedDate: text('recorded_date').notNull(), // 'YYYY-MM-DD'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Price Alerts table
export const priceAlerts = pgTable('price_alerts', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  userEmail: text('user_email').notNull(),
  targetPrice: doublePrecision('target_price').notNull(),
  currentPrice: doublePrecision('current_price').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'triggered'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Carts table
export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // uid string or guest session ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cart Items table
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id')
    .references(() => carts.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  phone: text('phone'),
  subtotal: doublePrecision('subtotal').notNull(),
  discountAmount: doublePrecision('discount_amount').default(0).notNull(),
  tax: doublePrecision('tax').default(0).notNull(),
  shippingFee: doublePrecision('shipping_fee').default(0).notNull(),
  totalAmount: doublePrecision('total_amount').notNull(),
  paymentStatus: text('payment_status').notNull().default('paid'), // 'paid' | 'pending' | 'failed' | 'refunded'
  orderStatus: text('order_status').notNull().default('confirmed'), // 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: text('payment_method').default('credit_card').notNull(),
  trackingNumber: text('tracking_number'),
  courierName: text('courier_name').default('BlueDart Express'),
  estimatedDelivery: text('estimated_delivery'),
  trackingStatus: text('tracking_status').default('In Transit'),
  returnStatus: text('return_status'),
  cancellationEligible: boolean('cancellation_eligible').default(true),
  returnEligible: boolean('return_eligible').default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order Items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id').references(() => products.id),
  productName: text('product_name').notNull(),
  productImage: text('product_image'),
  quantity: integer('quantity').notNull(),
  unitPrice: doublePrecision('unit_price').notNull(),
  totalPrice: doublePrecision('total_price').notNull(),
});

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  paymentMethod: text('payment_method').notNull(),
  transactionId: text('transaction_id').notNull(),
  amount: doublePrecision('amount').notNull(),
  status: text('status').notNull().default('completed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  userName: text('user_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
  offers: many(productOffers),
  priceHistory: many(priceHistory),
  priceAlerts: many(priceAlerts),
}));

export const productOffersRelations = relations(productOffers, ({ one }) => ({
  product: one(products, {
    fields: [productOffers.productId],
    references: [products.id],
  }),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  product: one(products, {
    fields: [priceHistory.productId],
    references: [products.id],
  }),
}));

export const priceAlertsRelations = relations(priceAlerts, ({ one }) => ({
  product: one(products, {
    fields: [priceAlerts.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
