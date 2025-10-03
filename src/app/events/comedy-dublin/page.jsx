import { CONFIG } from 'src/global-config';
import { ComedyDublinView } from 'src/sections/_events/view/comedy-dublin-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Comedy Dublin - In Stitches Comedy Club | ${CONFIG.appName}`,
  description: 'Experience the funniest night out with live comedy shows 7 nights a week at In Stitches Comedy Club in Dublin. Stand-up comedy featuring talented comedians in an intimate basement setting.',
  keywords: 'comedy,dublin,stand up,comedy club,ireland,entertainment,in stitches comedy',
  openGraph: {
    title: `In Stitches Comedy Club - Stand Up Comedy Dublin`,
    description: 'Live comedy shows 7 nights a week at Peadar Kearney\'s Pub basement in Dublin. The funniest night out in Ireland!',
    siteName: 'EventHub',
    images: [
      {
        url: '/assets/images/@stiches-comdey.jpg',
        width: 1200,
        height: 630,
        alt: 'In Stitches Comedy Club Logo - Stand Up Comedy Dublin',
      },
    ],
    locale: 'en_IE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `In Stitches Comedy Club - Stand Up Comedy Dublin`,
    description: 'Live comedy shows 7 nights a week at Peadar Kearney\'s Pub basement in Dublin. The funniest night out in Ireland!',
    images: ['/assets/images/@stiches-comdey.jpg'],
  },
};

export default function Page() {
  return <ComedyDublinView />;
}
