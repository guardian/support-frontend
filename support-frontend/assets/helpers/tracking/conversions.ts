import type { Participations } from '../abTests/abtest';
import { getAbsoluteURL } from '../urls/url';
import { successfulConversion } from './googleTagManager';
import { pageView } from './ophan';

export default function trackConversion(
	participations: Participations,
	currentRoute: string,
): void {
	// Fire GTM conversion events
	successfulConversion(participations);
	// Send an Ophan pageview. Because this function is used to track page views
	// from client side routed thank you pages, the referrer will always be the current location
	pageView(getAbsoluteURL(currentRoute), document.location.href);
}
