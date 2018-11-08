// @flow

import { doNotTrack } from 'helpers/page/page';
import { getAbsoluteURL } from '../url';
import { pageView } from './ophanComponentEventTracking';
import { successfulConversion } from './googleTagManager';
import type { Participations } from '../abTests/abtest';

export default function trackConversion(
  participations: Participations,
  currentRoute: string,
) {
  // Send an Ophan pageview. Because this function is used to track page views
  // from client side routed thank you pages, the referrer will always be the current location
  pageView(getAbsoluteURL(currentRoute), document.location.href);
}

