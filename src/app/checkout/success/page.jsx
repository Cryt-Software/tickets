'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Box, Card, CardContent, Stack, Button, Alert, CircularProgress } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent') || searchParams.get('session_id');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    if (paymentIntentId) {
      // In a real app, you'd fetch payment details from your backend
      // For now, we'll just show a success message
      setPaymentData({
        id: paymentIntentId,
        amount_total: 3000, // Example amount in cents
        currency: 'eur',
      });
      setLoading(false);
    }
  }, [paymentIntentId]);

  const handleDownloadTicket = async () => {
    if (!paymentIntentId) return;
    
    setDownloading(true);
    setDownloadError(null);
    
    try {
      const response = await fetch(`/api/download-ticket?paymentIntent=${paymentIntentId}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${paymentIntentId}.${blob.type.includes('pdf') ? 'pdf' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Failed to download ticket. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Iconify 
          icon="solar:check-circle-bold" 
          width={80} 
          sx={{ color: 'success.main', mb: 2 }} 
        />
        <Typography variant="h3" sx={{ mb: 2, color: 'success.main' }}>
          Payment Successful!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your purchase. Your tickets have been confirmed.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Order Details</Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Payment ID:
              </Typography>
              <Typography variant="body2">
                {paymentData?.id || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Amount Paid:
              </Typography>
              <Typography variant="body2">
                €30.00
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Event:
              </Typography>
              <Typography variant="body2">
                In Stitches Comedy Club
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          A confirmation email has been sent to your email address with your ticket attached.
        </Typography>

        {/* Download Ticket Section */}
        <Card sx={{ mb: 4, border: '2px dashed', borderColor: 'primary.main', bgcolor: 'primary.lighter' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <Iconify 
                icon="solar:download-bold" 
                width={40} 
                sx={{ color: 'primary.main' }} 
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Download Your Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get your ticket now or download it from your email later
              </Typography>
              
              {downloadError && (
                <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
                  {downloadError}
                </Alert>
              )}
              
              <Button
                variant="contained"
                size="large"
                onClick={handleDownloadTicket}
                disabled={downloading}
                startIcon={downloading ? <CircularProgress size={20} /> : <Iconify icon="solar:download-bold" />}
                sx={{ minWidth: 200 }}
              >
                {downloading ? 'Preparing Download...' : 'Download Ticket'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
