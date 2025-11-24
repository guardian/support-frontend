import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { fetchJson, getRequestOptions, requestOptions } from '../async/fetch';

/**
 * Newsletter IDs enum
 * These are the authoritative identifiers for newsletters from the Identity API
 * Used to safely reference newsletters throughout the application
 */
export enum NewsletterId {
	SaturdayEdition = '6042',
}

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
		'/api/newsletters',
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
			'/api/newsletters',
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
 * @param id - The newsletter ID enum value
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
