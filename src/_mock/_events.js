import dayjs from 'dayjs';

import { _mock } from './_mock';
import { _tags } from './assets';

// ----------------------------------------------------------------------

const ORGANIZERS = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  totalEvents: 48,
  totalReviews: 3458,
  totalAttendees: 18000,
  role: 'Event Organizer',
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
  ratingNumber: _mock.number.rating(index),
}));

const EVENT_SESSIONS = Array.from({ length: 5 }, (_, index) => ({
  id: _mock.id(index),
  duration: 120 - (index * 15),
  title: `Session ${index + 1}`,
  time: `${9 + index}:00 AM`,
  description: _mock.sentence(index),
  speaker: _mock.fullName(index),
}));

const getPrice = (index) => (index % 2 ? 29.99 : 59.99);

const getPriceSale = (index) => {
  if (index === 2) return 19.99;
  if (index === 5) return 39.99;
  return 0;
};

const getOrganizers = (index) => {
  if (index === 0) return ORGANIZERS.slice(0, 3);
  if (index === 1) return ORGANIZERS.slice(2, 4);
  if (index === 2) return ORGANIZERS.slice(3, 5);
  return [ORGANIZERS[4]];
};

const getEventType = (index) => {
  const types = ['Concert', 'Conference', 'Workshop', 'Festival', 'Seminar', 'Exhibition'];
  return types[index % types.length];
};

const getVenue = (index) => {
  const venues = [
    'Madison Square Garden',
    'Convention Center',
    'Central Park',
    'Times Square',
    'Brooklyn Bridge',
    'Empire State Building'
  ];
  return venues[index % venues.length];
};

const getEventHighlights = () => [
  'Live performances and entertainment',
  'Networking opportunities with industry professionals',
  'Interactive workshops and sessions',
  'Exclusive merchandise and giveaways',
  'Food and beverage options available',
  'Photo opportunities and social media moments',
];

// ----------------------------------------------------------------------

export const _events = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  sessions: EVENT_SESSIONS,
  totalSessions: 5,
  totalDuration: 8,
  totalReviews: 3458,
  totalAttendees: 180000,
  eventType: getEventType(index),
  category: _tags[index],
  price: getPrice(index),
  tags: _tags.slice(0, 5),
  highlights: getEventHighlights(),
  organizers: getOrganizers(index),
  slug: _mock.courseNames(index),
  priceSale: getPriceSale(index),
  isFeatured: index === 2 || index === 5,
  coverUrl: _mock.image.course(index),
  eventDate: dayjs().add(index, 'day').format(),
  startTime: '6:00 PM',
  endTime: '10:00 PM',
  venue: getVenue(index),
  address: '123 Event Street, New York, NY 10001',
  description: _mock.description(index),
  ratingNumber: _mock.number.rating(index),
  languages: ['English'],
  shareLinks: {
    facebook: 'https://facebook.example.com',
    instagram: 'https://instagram.example.com',
    linkedin: 'https://linkedin.example.com',
    twitter: 'https://twitter.example.com',
  },
  capacity: 1000 + (index * 100),
  soldTickets: Math.floor((1000 + (index * 100)) * (0.3 + (index * 0.05))),
  ticketTypes: [
    { name: 'General Admission', price: getPrice(index), available: true },
    { name: 'VIP', price: getPrice(index) * 2, available: index % 3 !== 0 },
    { name: 'Student', price: getPrice(index) * 0.7, available: true },
  ],
}));

export const _eventsByCategories = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  name: _tags[index],
  totalEvents: _mock.number.nativeM(index),
}));

