import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeProductId: text("stripe_product_id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  features: jsonb("features").$type<string[]>().default([]),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prices = pgTable("prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  stripePriceId: text("stripe_price_id").unique(),
  unitAmount: integer("unit_amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  type: text("type").notNull().default("one_time"), // one_time or recurring
  interval: text("interval"), // month, year, week, day
  intervalCount: integer("interval_count"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text("status").notNull(), // active, canceled, incomplete, incomplete_expired, trialing, past_due, unpaid
  priceId: uuid("price_id").references(() => prices.id),
  quantity: integer("quantity").default(1),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  endedAt: timestamp("ended_at"),
  cancelAt: timestamp("cancel_at"),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  number: text("number"),
  amountPaid: integer("amount_paid").notNull(),
  amountDue: integer("amount_due").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // draft, open, paid, uncollectible, void
  hostedInvoiceUrl: text("hosted_invoice_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const paymentIntents = pgTable("payment_intents", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // succeeded, processing, requires_payment_method, requires_confirmation, requires_action, canceled, requires_capture
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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