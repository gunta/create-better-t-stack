# Payment Integration Setup Guide

This guide will help you set up Stripe payment processing in your application.

## Prerequisites

1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## Configuration

### 1. Environment Variables

Copy the `.env.payments.example` file and add your Stripe keys:

```bash
# In your server directory
cp .env.payments.example .env
```

Add these variables to your `.env` file:
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret (see below)

### 2. Webhook Setup

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select the following events:
   - `customer.created`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.created`
   - `invoice.updated`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET`

### 3. Database Setup

The payment schemas have been added to your database. Run migrations:

```bash
# For Drizzle
npm run db:migrate

# For Prisma
npx prisma migrate dev
```

### 4. Create Products in Stripe

1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Create your products and prices
3. The products will automatically sync to your database via webhooks

### 5. Testing

Use Stripe's test mode and test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- More test cards: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## Usage

### Frontend Routes

- `/pricing` - Display products and pricing
- `/billing` - User billing management
- `/payment-success` - Success page after payment

### API Endpoints

The payment router provides these endpoints:
- `payments.getProducts` - Get all active products
- `payments.createCheckoutSession` - Create a Stripe checkout session
- `payments.getCustomer` - Get current user's customer info
- `payments.getSubscriptions` - Get user's subscriptions
- `payments.cancelSubscription` - Cancel a subscription
- `payments.createPortalSession` - Create a customer portal session

## Adding Products

1. Create products in Stripe Dashboard
2. Products will sync to your database automatically
3. Add features to products as metadata in Stripe:
   ```json
   {
     "features": ["Feature 1", "Feature 2", "Feature 3"]
   }
   ```

## Customization

### Adding New Payment Providers

The payment system is structured to support multiple providers:

1. Create new provider modules in `/server/src/providers/`
2. Implement the same interface as the Stripe provider
3. Update the payment router to use the new provider

### Extending the Schema

You can extend the payment schemas to add:
- Coupons and discounts
- Usage-based billing
- Multiple currencies
- Tax handling
- Custom fields

## Security Best Practices

1. **Never expose your secret key** - Only use it on the server
2. **Verify webhooks** - Always validate webhook signatures
3. **Use HTTPS** - Webhooks require HTTPS in production
4. **Implement proper auth** - Ensure users can only access their own data
5. **Log payment events** - Keep audit trails of all payment activities

## Troubleshooting

### Webhook Issues
- Check webhook signature validation
- Ensure your webhook URL is publicly accessible
- Check Stripe webhook logs for errors

### Database Sync Issues
- Verify webhook events are being received
- Check database connection and permissions
- Review server logs for errors

### Payment Failures
- Check Stripe Dashboard for detailed error messages
- Verify API keys are correct
- Ensure products and prices are active

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)