import { _events } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { EventsView } from 'src/sections/_events/view/events-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Events | ${CONFIG.appName}`,
  description: 'Discover and book tickets for amazing events. Find concerts, conferences, workshops, festivals and more.',
  keywords: 'events,tickets,concerts,conferences,workshops,festivals,booking',
};

export default function Page() {
  return <EventsView events={_events} />;
}
