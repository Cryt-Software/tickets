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
      width: '100%',
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

      // Debug: Log the booking data being sent
      console.log('🚀 StripeCheckoutForm Debug:', {
        quantity,
        selectedTicket,
        totalPrice: selectedTicket.price * quantity,
        eventData: eventData.title
      });

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
        {/* Full Width Order Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
            Order Summary
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 3, 
            borderRadius: 2,
            border: 1,
            borderColor: 'grey.200'
          }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={8} item>
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
                </Stack>
              </Grid>
              
              <Grid xs={12} md={4} item sx={{ textAlign: 'right' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {fCurrencyEUR(selectedTicket.price * quantity)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Payment Form */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
            Payment Details
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 3, 
            borderRadius: 2,
            border: 1,
            borderColor: 'grey.200'
          }}>
            <Grid container spacing={3}>
              <Grid xs={12} item>
                <Stack spacing={3} sx={{
                  width: '100%',
                  '& .MuiFormControl-root': { width: '100%' },
                  '& .MuiInputBase-root': { width: '100%' },
                  '& .StripeElement': { width: '100%' }
                }}>
                  {/* Email Field */}
                  <Box sx={{ width: '100%' }}>
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
                          sx={{ 
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              width: '100%'
                            },
                            '& .MuiInputBase-input': {
                              width: '100%'
                            }
                          }}
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
                  <Box sx={{ width: '100%' }}>
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
                          sx={{ 
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              width: '100%'
                            },
                            '& .MuiInputBase-input': {
                              width: '100%'
                            }
                          }}
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
                  <Box sx={{ width: '100%' }}>
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
                        display: 'block !important',
                        '& .StripeElement': {
                          width: '100% !important',
                          display: 'block !important',
                        },
                        '& .__PrivateStripeElement': {
                          width: '100% !important',
                          display: 'block !important',
                        },
                        '& .__PrivateStripeElement > iframe': {
                          width: '100% !important',
                        },
                      }}
                    >
                      <CardElement 
                        options={{
                          ...CARD_ELEMENT_OPTIONS,
                          style: {
                            ...CARD_ELEMENT_OPTIONS.style,
                            base: {
                              ...CARD_ELEMENT_OPTIONS.style.base,
                              lineHeight: '40px',
                            }
                          }
                        }} 
                      />
                    </Box>
                    {cardError && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {cardError}
                      </Typography>
                    )}
                  </Box>

                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            type="submit"
            disabled={isProcessing || !stripe}
            startIcon={<Iconify icon="solar:card-bold" />}
            fullWidth
            size="large"
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
