'use client';

import { useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

export function EventCard({ event }) {
  const [favorite, setFavorite] = useState(false);

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  const {
    id,
    slug,
    coverUrl,
    eventType,
    eventDate,
    startTime,
    venue,
    price,
    priceSale,
    ratingNumber,
    totalReviews,
    totalAttendees,
    capacity,
    soldTickets,
    isFeatured,
  } = event;

  const availability = capacity - soldTickets;
  const availabilityPercentage = (availability / capacity) * 100;

  return (
    <Card
      sx={{
        p: 0,
        width: 1,
        boxShadow: (theme) => theme.customShadows.card,
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.cardHover,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {isFeatured && (
          <Chip
            label="Featured"
            color="primary"
            sx={{
              top: 12,
              left: 12,
              position: 'absolute',
              zIndex: 9,
            }}
          />
        )}

        <Box
          onClick={handleFavorite}
          sx={{
            top: 12,
            right: 12,
            position: 'absolute',
            cursor: 'pointer',
            zIndex: 9,
          }}
        >
          <Iconify
            icon={favorite ? 'solar:heart-bold' : 'solar:heart'}
            sx={{
              color: favorite ? 'error.main' : 'common.white',
              width: 24,
              height: 24,
            }}
          />
        </Box>

        <Image
          src={coverUrl}
          alt={slug}
          sx={{
            height: 200,
          }}
        />
      </Box>

      <Stack spacing={2.5} sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Chip
            label={eventType}
            size="small"
            color="primary"
            variant="soft"
          />
          <Stack direction="row" spacing={0.5}>
            <Rating
              size="small"
              value={ratingNumber}
              precision={0.1}
              readOnly
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ({totalReviews})
            </Typography>
          </Stack>
        </Stack>

        <Link href={`/events/${id}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            sx={(theme) => ({
              ...theme.mixins.maxLine({ line: 2 }),
            })}
          >
            {slug}
          </Typography>
        </Link>

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:calendar-bold" width={16} />
            <Typography variant="body2" color="text.secondary">
              {fDate(eventDate)} at {startTime}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:map-point-bold" width={16} />
            <Typography variant="body2" color="text.secondary">
              {venue}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:users-group-rounded-bold" width={16} />
            <Typography variant="body2" color="text.secondary">
              {soldTickets.toLocaleString()} / {capacity.toLocaleString()} tickets sold
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            {priceSale > 0 && (
              <Typography
                variant="h6"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }}
              >
                {fCurrency(price)}
              </Typography>
            )}
            <Typography variant="h6" color="primary">
              {fCurrency(priceSale > 0 ? priceSale : price)}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: 60,
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${100 - availabilityPercentage}%`,
                height: '100%',
                bgcolor: availabilityPercentage < 20 ? 'error.main' : 'success.main',
              }}
            />
          </Box>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          {availability} tickets remaining
        </Typography>
      </Stack>
    </Card>
  );
}
