'use client';

import { Container, Typography, Box, Card, CardContent, Stack, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Iconify 
          icon="solar:close-circle-bold" 
          width={80} 
          sx={{ color: 'error.main', mb: 2 }} 
        />
        <Typography variant="h3" sx={{ mb: 2, color: 'error.main' }}>
          Payment Cancelled
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your payment was cancelled. No charges have been made.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">What happened?</Typography>
            <Typography variant="body2" color="text.secondary">
              You cancelled the payment process before completing the transaction. 
              Your tickets have not been reserved and no payment has been processed.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You can try again or explore other events.
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            component={Link}
            href="/"
          >
            Browse Events
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/events/comedy-dublin"
          >
            Try Again
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
