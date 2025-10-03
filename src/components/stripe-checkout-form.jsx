'use client';

import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { fCurrencyEUR } from 'src/utils/format-number';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ 
  eventData, 
  selectedDate, 
  selectedTicket, 
  quantity, 
  onSuccess, 
  onError 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const methods = useForm({
    defaultValues: {
      email: '',
      cardholderName: '',
      acceptTerms: false,
    }
  });

  const { control, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: data.cardholderName,
          email: data.email,
        },
      });

      if (error) {
        setCardError(error.message);
        setIsProcessing(false);
        return;
      }

      // Create payment intent
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTitle: eventData.title,
          eventDate: selectedDate.date,
          ticketName: selectedTicket.name,
          quantity: quantity,
          unitPrice: selectedTicket.price,
          totalPrice: selectedTicket.price * quantity,
          customerEmail: data.email,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.paymentIntentId);
      } else {
        setCardError(result.details || result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setCardError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
        {/* Left Column - Order Summary */}
        <Grid xs={12} md={6} item>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Order Summary
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {eventData.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDate.date} at {selectedDate.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {eventData.venue}
                  </Typography>
                </Box>
                
                <Divider />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">
                    {selectedTicket.name} × {quantity}
                  </Typography>
                  <Typography variant="body2">
                    {fCurrencyEUR(selectedTicket.price * quantity)}
                  </Typography>
                </Stack>
                
                <Divider />
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total</Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                    {fCurrencyEUR(selectedTicket.price * quantity)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Payment Form */}
        <Grid xs={12} md={6} item>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Payment Details
          </Typography>
          
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                {/* Email Field */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Email Address
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="your.email@example.com"
                        variant="outlined"
                        size="small"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Box>

                {/* Cardholder Name */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Cardholder Name
                  </Typography>
                  <Controller
                    name="cardholderName"
                    control={control}
                    rules={{ required: 'Cardholder name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="John Doe"
                        variant="outlined"
                        size="small"
                        error={!!errors.cardholderName}
                        helperText={errors.cardholderName?.message}
                      />
                    )}
                  />
                </Box>

                {/* Stripe Card Element */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Card Information
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: cardError ? 'error.main' : 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </Box>
                  {cardError && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {cardError}
                    </Typography>
                  )}
                </Box>

                {/* Terms and Conditions */}
                <Box>
                  <Controller
                    name="acceptTerms"
                    control={control}
                    rules={{ required: 'You must accept the terms and conditions' }}
                    render={({ field }) => (
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <input 
                          type="checkbox" 
                          checked={field.value}
                          onChange={field.onChange}
                          style={{ marginTop: 4 }} 
                        />
                        <Typography variant="caption" color={errors.acceptTerms ? 'error' : 'text.secondary'}>
                          I agree to the{' '}
                          <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                            Terms and Conditions
                          </Button>
                          {' '}and{' '}
                          <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                            Privacy Policy
                          </Button>
                          {errors.acceptTerms && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                              {errors.acceptTerms.message}
                            </Typography>
                          )}
                        </Typography>
                      </Stack>
                    )}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button 
          variant="contained" 
          type="submit"
          disabled={isProcessing || !stripe}
          startIcon={<Iconify icon="solar:card-bold" />}
          sx={{ minWidth: 200 }}
        >
          {isProcessing ? 'Processing...' : 'Complete Booking'}
        </Button>
      </Box>
    </form>
    </FormProvider>
  );
}

export function StripeCheckoutForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
