import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Helper function to format currency for Stripe (amounts in cents)
export const formatAmountForStripe = (amount, currency = 'eur') => {
  const numberFormat = new Intl.NumberFormat(['en-IE'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? Math.round(amount * 100) : Math.round(amount * 100);
};

// Helper function to format amount from Stripe (cents to euros)
export const formatAmountFromStripe = (amount, currency = 'eur') => {
  const numberFormat = new Intl.NumberFormat(['en-IE'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  
  const parts = numberFormat.formatToParts(0);
  let zeroDecimalCurrency = true;
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  
  return zeroDecimalCurrency ? amount / 100 : amount / 100;
};
