import { getAbsoluteURL } from "../urls/url";
import { pageView } from "./ophan";
import { successfulConversion } from "./googleTagManager";
import type { Participations } from "../abTests/abtest";
export default function trackConversion(participations: Participations, currentRoute: string) {
  // Fire GTM conversion events
  successfulConversion(participations);
  // Send an Ophan pageview. Because this function is used to track page views
  // from client side routed thank you pages, the referrer will always be the current location
  pageView(getAbsoluteURL(currentRoute), document.location.href);
}