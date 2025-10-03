'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { EventCard } from '../event-card';

// ----------------------------------------------------------------------

export function EventsList({ events }) {
  const [page, setPage] = useState(1);

  const eventsPerPage = 6;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (page - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        {currentEvents.map((event) => (
          <Grid key={event.id} xs={12} sm={6} md={4} item>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Stack>
  );
}

