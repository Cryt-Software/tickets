'use client';

import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { _tags } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { EventsFilters } from '../events-filters';
import { EventsNewsletter } from '../events-newsletter';
import { EventsList } from '../list/events-list';

// ----------------------------------------------------------------------

export function EventsView({ events }) {
  const openMobile = useBoolean();

  const filters = useSetState({
    fee: [],
    level: [],
    keyword: '',
    duration: [],
    rating: null,
    language: [],
    categories: [],
  });

  return (
    <>
      <Container>
        <Box
          sx={{
            pb: 5,
            display: 'flex',
            alignItems: 'center',
            pt: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h2" sx={{ flexGrow: 1 }}>
            Events
          </Typography>

          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify width={18} icon="solar:filter-outline" />}
            onClick={openMobile.onTrue}
            sx={{ display: { md: 'none' } }}
          >
            Filters
          </Button>
        </Box>

        <Box
          sx={{
            gap: { xs: 0, md: 8 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <EventsFilters
            filters={filters}
            open={openMobile.value}
            onClose={openMobile.onFalse}
            options={{
              ratings: ['Up 4 stars', 'Up 3 stars', 'Up 2 stars'],
              dates: ['Today', 'This Week', 'This Month', 'Next Month'],
              categories: _tags,
              eventTypes: ['Concert', 'Conference', 'Workshop', 'Festival', 'Seminar', 'Exhibition'],
              prices: ['Free', 'Under $50', '$50-$100', '$100+'],
              venues: ['Madison Square Garden', 'Convention Center', 'Central Park', 'Times Square'],
            }}
          />

          <Box
            sx={(theme) => ({ [theme.breakpoints.up('md')]: { minWidth: 0, flex: '1 1 auto' } })}
          >
            <EventsList events={events || []} />
          </Box>
        </Box>
      </Container>
      <EventsNewsletter />
    </>
  );
}

