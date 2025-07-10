import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  stripeProductId: text("stripe_product_id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  features: text("features", { mode: "json" }).$type<string[]>().default([]),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const prices = sqliteTable("prices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").references(() => products.id).notNull(),
  stripePriceId: text("stripe_price_id").unique(),
  unitAmount: integer("unit_amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  type: text("type").notNull().default("one_time"), // one_time or recurring
  interval: text("interval"), // month, year, week, day
  intervalCount: integer("interval_count"),
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").references(() => customers.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  status: text("status").notNull(), // active, canceled, incomplete, incomplete_expired, trialing, past_due, unpaid
  priceId: text("price_id").references(() => prices.id),
  quantity: integer("quantity").default(1),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  cancelAt: integer("cancel_at", { mode: "timestamp" }),
  canceledAt: integer("canceled_at", { mode: "timestamp" }),
  trialStart: integer("trial_start", { mode: "timestamp" }),
  trialEnd: integer("trial_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").references(() => customers.id).notNull(),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  number: text("number"),
  amountPaid: integer("amount_paid").notNull(),
  amountDue: integer("amount_due").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // draft, open, paid, uncollectible, void
  hostedInvoiceUrl: text("hosted_invoice_url"),
  pdfUrl: text("pdf_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const paymentIntents = sqliteTable("payment_intents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").references(() => customers.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // succeeded, processing, requires_payment_method, requires_confirmation, requires_action, canceled, requires_capture
  description: text("description"),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
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