'use client';

import { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import { StripeCheckoutForm } from 'src/components/stripe-checkout-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';

import { fCurrency } from 'src/utils/format-number';

import { _socials } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';

// ----------------------------------------------------------------------


const eventData = {
  id: 'comedy-dublin-stitches',
  title: 'In Stitches Comedy Club: Sun - Wed - Stand Up Comedy',
  organizer: 'In Stitches Comedy Club',
  description: 'In Stitches Comedy Club is the funniest night out with live comedy shows 7 nights a week at the basement of Peadar Kearney Pub in Dublin.',
  image: '/assets/images/stiches-comdey.jpg',
  venue: 'Peadar Kearney\'s Pub - Cellar',
  address: '64 Dame Street D02 RT72 Dublin 8',
  price: 12.00, // EUR
  category: 'Comedy',
  rating: 4.8,
  totalReviews: 89,
  capacity: 80,
  soldTickets: 67,
  isMultipleDates: true,
  organizerAvatar: '/assets/images/stiches-comdey.jpg',
  socialLinks: {
    facebook: 'https://facebook.com/institchesdublin',
    instagram: 'https://instagram.com/institchesdublin',
    twitter: 'https://twitter.com/institchesdublin',
  },
  agenda: [
    { time: '8:30 PM', activity: 'Doors Open' },
    { time: '9:00 PM', activity: 'Show Start' },
    { time: '9:45 PM - 10:00 PM', activity: 'Break' },
    { time: '10:00 PM - 10:30 PM', activity: '2nd Half' },
    { time: '10:30 PM', activity: 'Show Finish' },
  ],
  ticketTypes: [
    { name: 'General Admission', price: 12.00, available: true, description: 'Standard seating' },
  ],
  faqs: [
    {
      question: 'What is your refund policy?',
      answer: 'All bookings are non-refundable and non-exchangeable. The only exception to this policy is if the event you have booked for is cancelled by In Stitches Comedy, or in a Force Major occurrence such as government restrictions on live events.'
    },
    {
      question: 'Is it wheelchair accessible?',
      answer: 'Unfortunately we are not wheelchair accessible as we are located at the basement of a bar but, we will gladly help accommodate anyone in anyway we can to bring them down the stairs.'
    },
    {
      question: 'Where is in Stitches Comedy Club Located?',
      answer: 'In Stitches Comedy Club is located at the basement of Peadar Kearney Pub Cellar on Dame Street, Dublin.'
    },
    {
      question: 'What Is \'Heckling\' And Am I Allowed To Do It?',
      answer: 'NO! If the comedian hasn\'t asked you a question, any sort of yelling out, talking amongst yourselves or distracting behaviour during the performance is considered \'heckling.\' It distracts the comedians and the other audience members (who are here to watch the show) SO PLEASE DON\'T'
    },
    {
      question: 'I\'m coming with a group, can we book reserve seats?',
      answer: 'Yes. If you email info@institchescomedy.com.'
    },
    {
      question: 'Can I book the venue?',
      answer: 'Yes. Our venue is available for private bookings, solo show, live podcast, WIP show, tour show & more. Email: info@institchescomedy.com'
    },
    {
      question: 'Can I buy Tickets On The Door?',
      answer: 'Yes! But we highly recommend buying tickets on our website before the show as we frequently sell out.'
    },
    {
      question: 'Is there an age limit?',
      answer: 'You must be 18 years or older to ride this laugh train. In at event of parents accompanying their underage child to the show it depends on the venues to allow them in.'
    }
  ],
};

// Helper function to format EUR currency
const fCurrencyEUR = (value) => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function ComedyDublinView() {
  const [selectedTicket, setSelectedTicket] = useState(eventData.ticketTypes[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState('9:00 PM');
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);

  // Debug: Log quantity changes
  useEffect(() => {
    console.log('🔄 Quantity state changed:', quantity);
  }, [quantity]);
  
  // Available show times for the comedy club
  const availableTimes = [
    { label: '6:30 PM', value: '6:30 PM', day: 'Sunday' },
    { label: '9:00 PM', value: '9:00 PM', day: 'Sunday' },
  ];
  // const [stripePromise, setStripePromise] = useState(null);

  // useEffect(() => {
  //   // Initialize Stripe
  //   if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  //     setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
  //   }
  // }, []);

  const handlePaymentSuccess = (paymentIntentId) => {
    setOpenCheckoutDialog(false);
    
    // Redirect to success page
    window.location.href = `/checkout/success?payment_intent=${paymentIntentId}`;
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please check your card details and try again.');
  };

  const renderHero = () => (
    <Box sx={{ position: 'relative', mb: 5 }}>
      <Image
        src={eventData.image}
        alt={eventData.title}
        ratio="21/9"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{ 
            minWidth: 'auto', 
            width: 40, 
            height: 40, 
            bgcolor: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' } 
          }}
        >
          <Iconify icon="solar:heart-bold" />
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ 
            minWidth: 'auto', 
            width: 40, 
            height: 40, 
            bgcolor: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' } 
          }}
        >
          <Iconify icon="solar:share-bold" />
        </Button>
      </Box>
    </Box>
  );

  const renderHeader = () => (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Chip label={eventData.category} color="primary" variant="soft" />
        <Typography variant="body2" color="text.secondary">
          By {eventData.organizer}
        </Typography>
      </Stack>

      <Typography variant="h3" sx={{ mb: 2 }}>
        {eventData.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {eventData.description}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:star-bold" sx={{ color: 'warning.main' }} />
          <Typography variant="h6">{eventData.rating}</Typography>
          <Typography variant="body2" color="text.secondary">
            ({eventData.totalReviews} reviews)
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:map-point-bold" />
          <Typography variant="body2" color="text.secondary">
            {eventData.venue}
          </Typography>
        </Stack>

      </Stack>
    </Box>
  );

  const renderOrganizer = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={eventData.organizerAvatar} sx={{ width: 56, height: 56 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{eventData.organizer}</Typography>
            <Typography variant="body2" color="text.secondary">
              Comedy Club Organizer
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Iconify icon="solar:heart-outline" />}>
            Follow
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderLocation = () => (
    <Card sx={{ mb: 3, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Iconify icon="solar:map-point-bold" width={24} />
          <Typography variant="h6">Location</Typography>
        </Stack>
        
        <Typography variant="h6" sx={{ mb: 1 }}>
          {eventData.venue}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {eventData.address}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button variant="outlined" startIcon={<Iconify icon="solar:map-outline" />}>
            Get directions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderAgenda = () => (
    <Card sx={{ mb: 3, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Agenda
        </Typography>
        
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          {eventData.agenda.map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  minWidth: 120,
                  py: 0.5,
                  px: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {item.time}
                </Typography>
              </Box>
              <Typography variant="body2">{item.activity}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );


  const renderBooking = () => (
    <Card sx={{ position: 'sticky', top: 24, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
              From {fCurrencyEUR(selectedTicket.price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Multiple dates
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Check availability
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Secure checkout powered by EventHub
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderAbout = () => (
    <Card sx={{ mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          About In Stitches Comedy Club
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          In Stitches Comedy Club is the best comedy show in Dublin. Live stand up comedy 7+ night a week bringing the top local and international comedians to our stage.
        </Typography>

        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, color: 'primary.main' }}>
          Daily Lineup
        </Typography>

        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
              Mondays - "Retro Monday"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              A night where the best local and international comedians professional comedians drop in to work out their material before their television appearance or going on tour with drink deals on offer.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              This night gets a lot of surprises as you never know who might pop in - we have had acts like Mark Normand, Foil Arms and Hog, Joanne McNally, David McSavage and more.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We also offer a €6.50 drink deal which includes all pints & glasses of wine.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
              Tuesdays - "Two Mics Tuesday"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              A night where the best local and international comedians professional comedians drop in to work out their material before their television appearance or going on tour with drink deals on offer.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              This night gets a lot of surprises as you never know who might pop in - we have had acts like Mark Normand, Foil Arms and Hog, Joanne McNally, David McSavage and more.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We also offer a €6.50 drink deal which includes all pints & glasses of wine.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
              Wednesdays - "Raw Wednesdays"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              RAW Wednesday brings the best new comedy faces to our stage with the freshest comedians. A night to witness the next big comedy stars.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
              Sunday - "Sunday Best"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Sunday best comedy gig attracts the best comedians from around the world to our club.
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, color: 'primary.main' }}>
              Show Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Doors:</strong> 8:30pm
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Show:</strong> 9:00pm - 10:30pm
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Fee:</strong> Adult: €12 + Booking Fee / Student Fee: €10 + Booking Fee
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Location:</strong> Peadar Kearney's Pub (Cellar)
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderFAQ = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {eventData.faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1, '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<Iconify icon="solar:alt-arrow-down-linear" />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </CardContent>
    </Card>
  );


  const renderBookingDialog = () => (
    <Dialog
      open={openBookingDialog}
      onClose={() => setOpenBookingDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Select Date & Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Choose your preferred date, time and number of tickets
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={4} sx={{ mt: 2 }}>
          {/* Date Selection Cards */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'bold' }}>
              Select Date & Time
            </Typography>
            <Grid container spacing={2}>
              {Array.from({ length: 7 }, (_, index) => {
                const date = dayjs().add(index + 1, 'day'); // Start from tomorrow
                const dayName = date.format('dddd');
                const dateStr = date.format('DD MMM');
                
                return (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 1,
                        borderColor: selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') 
                          ? 'primary.main' 
                          : 'divider',
                        bgcolor: selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                          ? 'primary.50'
                          : 'background.paper',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50',
                        },
                      }}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime('9:00 PM'); // Always 9:00 PM
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {dayName}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {dateStr}
                        </Typography>
                        <Box>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            9:00 PM
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Opens 8:30 PM
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>


          {/* Ticket Quantity */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Number of Tickets
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="body2" color="text.secondary">
                  {selectedTicket.name} - {fCurrencyEUR(selectedTicket.price)} each
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Total Price */}
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 3, 
            borderRadius: 2,
            border: 1,
            borderColor: 'grey.200'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Total Amount
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                {fCurrencyEUR(selectedTicket.price * quantity)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenBookingDialog(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={() => {
            setOpenBookingDialog(false);
            setOpenCheckoutDialog(true);
          }}
        >
          Proceed to Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderCheckoutDialog = () => (
    <Dialog
      open={openCheckoutDialog}
      onClose={() => setOpenCheckoutDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Checkout
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Complete your booking for In Stitches Comedy Club
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {/* Debug: Log quantity being passed */}
        {console.log('📊 ComedyDublinView Quantity Debug:', {
          quantity,
          quantityType: typeof quantity,
          selectedTicket: selectedTicket?.name,
          totalCalculation: selectedTicket ? selectedTicket.price * quantity : 'N/A'
        })}
        
        <StripeCheckoutForm
          eventData={eventData}
          selectedDate={{
            date: selectedDate instanceof dayjs ? selectedDate.format('YYYY-MM-DD') : selectedDate,
            time: selectedTime,
            available: true,
          }}
          selectedTicket={selectedTicket}
          quantity={quantity}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenCheckoutDialog(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5, pb: 10 }}>
        {renderHero()}
        
        <Box>
          {renderHeader()}
          {renderOrganizer()}
          {/* Location & Agenda row */}
          <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexGrow: 1, flexBasis: { md: 0 }, minWidth: 0 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                {renderLocation()}
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexGrow: 1, flexBasis: { md: 0 }, minWidth: 0 }}>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                {renderAgenda()}
              </Box>
            </Grid>
          </Grid>

          {/* About & FAQ row */}
          <Grid container spacing={3} sx={{ mb: 4 }} alignItems="stretch">
            <Grid item xs={12} md={6}>
              {renderAbout()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderFAQ()}
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Sticky Bottom Booking Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          boxShadow: 3,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2,
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" color="primary">
                From {fCurrencyEUR(selectedTicket.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Multiple dates
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenBookingDialog(true)}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Book Tickets Now
            </Button>
          </Box>
        </Container>
      </Box>

      {renderBookingDialog()}
      {renderCheckoutDialog()}
    </>
  );
}
