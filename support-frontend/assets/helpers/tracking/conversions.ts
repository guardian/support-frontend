import { getAbsoluteURL } from '../urls/url';
import { pageView } from './ophan';

export default function trackConversion(currentRoute: string): void {
	// Send an Ophan pageview. Because this function is used to track page views
	// from client side routed thank you pages, the referrer will always be the current location
	pageView(getAbsoluteURL(currentRoute), document.location.href);
}
