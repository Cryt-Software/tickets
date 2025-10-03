import { CONFIG } from 'src/global-config';
import { ComedyDublinView } from 'src/sections/_events/view/comedy-dublin-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Comedy Dublin - In Stitches Comedy Club | ${CONFIG.appName}`,
  description: 'Experience the funniest night out with live comedy shows 7 nights a week at In Stitches Comedy Club in Dublin.',
  keywords: 'comedy,dublin,stand up,comedy club,ireland,entertainment',
};

export default function Page() {
  return <ComedyDublinView />;
}
