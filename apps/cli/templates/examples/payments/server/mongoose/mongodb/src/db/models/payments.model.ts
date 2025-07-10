import { Schema, model, Document } from 'mongoose';

// Customer Schema
interface ICustomer extends Document {
  userId: string;
  stripeCustomerId?: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  userId: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true },
  name: { type: String },
}, {
  timestamps: true,
  collection: 'customers'
});

export const Customer = model<ICustomer>('Customer', customerSchema);

// Product Schema
interface IProduct extends Document {
  stripeProductId?: string;
  name: string;
  description?: string;
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  stripeProductId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  description: { type: String },
  features: { type: [String], default: [] },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'products'
});

export const Product = model<IProduct>('Product', productSchema);

// Price Schema
interface IPrice extends Document {
  productId: Schema.Types.ObjectId;
  stripePriceId?: string;
  unitAmount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year' | 'week' | 'day';
  intervalCount?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const priceSchema = new Schema<IPrice>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  stripePriceId: { type: String, unique: true, sparse: true },
  unitAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'usd' },
  type: { type: String, enum: ['one_time', 'recurring'], default: 'one_time' },
  interval: { type: String, enum: ['month', 'year', 'week', 'day'] },
  intervalCount: { type: Number },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
  collection: 'prices'
});

export const Price = model<IPrice>('Price', priceSchema);

// Subscription Schema
interface ISubscription extends Document {
  customerId: Schema.Types.ObjectId;
  stripeSubscriptionId?: string;
  status: string;
  priceId?: Schema.Types.ObjectId;
  quantity: number;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  endedAt?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  stripeSubscriptionId: { type: String, unique: true, sparse: true },
  status: { type: String, required: true },
  priceId: { type: Schema.Types.ObjectId, ref: 'Price' },
  quantity: { type: Number, default: 1 },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  endedAt: { type: Date },
  cancelAt: { type: Date },
  canceledAt: { type: Date },
  trialStart: { type: Date },
  trialEnd: { type: Date },
}, {
  timestamps: true,
  collection: 'subscriptions'
});

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

// Invoice Schema
interface IInvoice extends Document {
  customerId: Schema.Types.ObjectId;
  subscriptionId?: Schema.Types.ObjectId;
  stripeInvoiceId?: string;
  number?: string;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string;
  hostedInvoiceUrl?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  stripeInvoiceId: { type: String, unique: true, sparse: true },
  number: { type: String },
  amountPaid: { type: Number, required: true },
  amountDue: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  hostedInvoiceUrl: { type: String },
  pdfUrl: { type: String },
}, {
  timestamps: true,
  collection: 'invoices'
});

export const Invoice = model<IInvoice>('Invoice', invoiceSchema);

// PaymentIntent Schema
interface IPaymentIntent extends Document {
  customerId: Schema.Types.ObjectId;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentIntentSchema = new Schema<IPaymentIntent>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  stripePaymentIntentId: { type: String, unique: true, sparse: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  description: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
  collection: 'payment_intents'
});

export const PaymentIntent = model<IPaymentIntent>('PaymentIntent', paymentIntentSchema);

// Export types
export type {
  ICustomer,
  IProduct,
  IPrice,
  ISubscription,
  IInvoice,
  IPaymentIntent
};