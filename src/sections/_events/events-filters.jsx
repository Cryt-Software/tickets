'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { ElearningFilters } from '../_elearning/elearning-filters';

// ----------------------------------------------------------------------

export function EventsFilters({ filters, open, onClose, options }) {
  const handleReset = useCallback(() => {
    filters.reset();
  }, [filters]);

  const handleApply = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6">Filters</Typography>
      <Box onClick={onClose} sx={{ cursor: 'pointer' }}>
        <Iconify icon="mingcute:close-line" />
      </Box>
    </Stack>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 2.5 }}>
      <ElearningFilters
        filters={filters}
        onReset={handleReset}
        onApply={handleApply}
        options={{
          ratings: options.ratings,
          durations: options.dates,
          categories: options.categories,
          levels: options.eventTypes,
          fees: options.prices,
          languages: options.venues,
        }}
      />
    </Stack>
  );

  return (
    <>
      {/* Desktop */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
        }}
      >
        {renderContent}
      </Box>

      {/* Mobile */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: { width: 280 },
          },
        }}
      >
        {renderHead}
        {renderContent}
      </Drawer>
    </>
  );
}

