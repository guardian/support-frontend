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

export interface Newsletter {
	listId: string;
}

interface NewslettersApiResponse extends Record<string, unknown> {
	newsletters?: Newsletter[];
	errors?: string[];
}

/**
 * Fetches available newsletters from the Identity API
 * @param csrf - CSRF state for authentication
 * @returns Promise resolving to an array of newsletters
 * @throws Error if the API returns an error
 */
export async function getNewsletters(csrf: CsrfState): Promise<Newsletter[]> {
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
 * @param id - The newsletter ID
 * @param subscribed - Whether to subscribe (true) or unsubscribe (false)
 * @returns Promise resolving to void
 */
export async function updateNewsletter(
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
				null,
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
 * Finds a newsletter by its enum ID
 * @param newsletters - Array of newsletters to search
 * @param id - The newsletter ID enum value
 * @returns The matching newsletter, or undefined if not found
 */
export function getNewsletterById(
	newsletters: Newsletter[],
	id: NewsletterId,
): Newsletter | undefined {
	return newsletters.find((newsletter) => newsletter.listId === String(id));
}
