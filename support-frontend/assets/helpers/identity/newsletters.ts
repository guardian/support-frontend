import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { fetchJson, getRequestOptions, requestOptions } from '../async/fetch';

/**
 * Determine current stage for frontend logic.
 * Attempts to read a serverside-provided stage flag, falling back to hostname heuristics.
 */
function getStage(): 'CODE' | 'PROD' {
	const host = window.location.hostname.toLowerCase();
	if (host.includes('.code.dev-theguardian.') || host.includes('.thegulocal.')) {
		return 'CODE';
	}
	return 'PROD';
}

/**
 * Newsletter IDs mapping (runtime-resolved)
 * These are the authoritative identifiers for newsletters from the Identity API
 * The values can differ per environment (CODE vs PROD).
 */
export const NewslettersIds = {
	SaturdayEdition: getStage() === 'PROD' ? '6031' : '6042',
} as const;

type NewsletterId = typeof NewslettersIds[keyof typeof NewslettersIds];

export interface NewsletterSubscription {
	listId: string;
}

interface NewslettersApiResponse extends Record<string, unknown> {
	newsletters?: NewsletterSubscription[];
	errors?: string[];
}

/**
 * Fetches available newsletters subscriptions from the Identity API
 * @param csrf - CSRF state for authentication
 * @returns Promise resolving to an array of newsletters subscriptions
 * @throws Error if the API returns an error
 */
export async function getNewslettersSubscriptions(
	csrf: CsrfState,
): Promise<NewsletterSubscription[]> {
	const response = await fetchJson<NewslettersApiResponse>(
		'/identity/newsletters',
		getRequestOptions('same-origin', csrf),
	);

	if (response.errors && response.errors.length > 0) {
		const errorMessage = response.errors.join(', ');
		console.error('Error fetching newsletters:', errorMessage);
		throw new Error(`Failed to fetch newsletters: ${errorMessage}`);
	}

	console.debug('Newsletters fetched successfully:', response.newsletters);
	return response.newsletters ?? [];
}

/**
 * Updates a newsletter subscription
 * @param csrf - CSRF state for authentication
 * @param id - The newsletter ID
 * @param subscribed - Whether to subscribe (true) or unsubscribe (false)
 * @returns Promise resolving to void
 */
export async function updateNewsletterSubscription(
	csrf: CsrfState,
	id: string,
	subscribed: boolean,
): Promise<void> {
	try {
		const response = await fetch(
			'/identity/newsletters',
			requestOptions(
				{
					id,
					subscribed,
				},
				'same-origin',
				'PATCH',
				csrf,
			),
		);
		if (!response.ok) {
			throw new Error(`Failed to update newsletter: ${response.status}`);
		}
		console.debug('Newsletter updated:', id, subscribed);
	} catch (error) {
		console.error('Error updating newsletter:', error);
		throw error;
	}
}

/**
 * Finds a newsletter subscription by newsletter enum ID
 * @param newslettersSubscriptions - Array of newsletters subscriptions to search
 * @param id - The newsletter ID value
 * @returns The matching newsletter subscription, or undefined if not found
 */
export function getNewsletterSubscriptionById(
	newslettersSubscriptions: NewsletterSubscription[],
	id: NewsletterId,
): NewsletterSubscription | undefined {
	return newslettersSubscriptions.find(
		(newsletterSubscription) => newsletterSubscription.listId === String(id),
	);
}
