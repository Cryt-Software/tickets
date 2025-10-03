'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EventsNewsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: 'background.neutral',
      }}
    >
      <Container>
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            maxWidth: 480,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">Stay Updated</Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Subscribe to our newsletter and be the first to know about upcoming events, exclusive offers, and special announcements.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: 1,
              maxWidth: 366,
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      type="submit"
                      color="inherit"
                      size="large"
                      variant="contained"
                      sx={{ minWidth: { xs: '100%', sm: 48 } }}
                    >
                      <Iconify icon="eva:arrow-forward-fill" />
                    </Button>
                  ),
                }}
              />
            </Stack>
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            We respect your privacy. Unsubscribe at any time.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

