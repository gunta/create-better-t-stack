import { mysqlTable, text, timestamp, int, boolean, varchar, json } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  stripeProductId: varchar("stripe_product_id", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  features: json("features").$type<string[]>().default([]),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const prices = mysqlTable("prices", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: varchar("product_id", { length: 36 }).references(() => products.id).notNull(),
  stripePriceId: varchar("stripe_price_id", { length: 255 }).unique(),
  unitAmount: int("unit_amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("usd"),
  type: varchar("type", { length: 20 }).notNull().default("one_time"), // one_time or recurring
  interval: varchar("interval", { length: 20 }), // month, year, week, day
  intervalCount: int("interval_count"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: varchar("customer_id", { length: 36 }).references(() => customers.id).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  status: varchar("status", { length: 50 }).notNull(), // active, canceled, incomplete, incomplete_expired, trialing, past_due, unpaid
  priceId: varchar("price_id", { length: 36 }).references(() => prices.id),
  quantity: int("quantity").default(1),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  endedAt: timestamp("ended_at"),
  cancelAt: timestamp("cancel_at"),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: varchar("customer_id", { length: 36 }).references(() => customers.id).notNull(),
  subscriptionId: varchar("subscription_id", { length: 36 }).references(() => subscriptions.id),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }).unique(),
  number: varchar("number", { length: 255 }),
  amountPaid: int("amount_paid").notNull(),
  amountDue: int("amount_due").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // draft, open, paid, uncollectible, void
  hostedInvoiceUrl: text("hosted_invoice_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const paymentIntents = mysqlTable("payment_intents", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: varchar("customer_id", { length: 36 }).references(() => customers.id).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).unique(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // succeeded, processing, requires_payment_method, requires_confirmation, requires_action, canceled, requires_capture
  description: text("description"),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Zod schemas
export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
export type Customer = z.infer<typeof selectCustomerSchema>;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;

export const insertPriceSchema = createInsertSchema(prices);
export const selectPriceSchema = createSelectSchema(prices);
export type Price = z.infer<typeof selectPriceSchema>;
export type NewPrice = z.infer<typeof insertPriceSchema>;

export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const selectSubscriptionSchema = createSelectSchema(subscriptions);
export type Subscription = z.infer<typeof selectSubscriptionSchema>;
export type NewSubscription = z.infer<typeof insertSubscriptionSchema>;

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);
export type Invoice = z.infer<typeof selectInvoiceSchema>;
export type NewInvoice = z.infer<typeof insertInvoiceSchema>;

export const insertPaymentIntentSchema = createInsertSchema(paymentIntents);
export const selectPaymentIntentSchema = createSelectSchema(paymentIntents);
export type PaymentIntent = z.infer<typeof selectPaymentIntentSchema>;
export type NewPaymentIntent = z.infer<typeof insertPaymentIntentSchema>;