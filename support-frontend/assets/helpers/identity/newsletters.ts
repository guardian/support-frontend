import { fetchJson, getRequestOptions, requestOptions } from '../async/fetch';

/**
 * Newsletter IDs enum
 * These are the authoritative identifiers for newsletters from the Identity API
 * Used to safely reference newsletters throughout the application
 */
export enum NewsletterId {
	SaturdayEdition = 'saturday-edition',
}

export interface Newsletter {
	id: string;
	theme: string;
	group: string;
	name: string;
	description: string;
	frequency: string;
	subscribed: boolean;
	exactTargetListId: number;
}

interface GetNewslettersResponse extends Record<string, unknown> {
	newsletters?: Newsletter[];
	error?: string;
}

/**
 * Fetches available newsletters from the Identity API
 * @returns Promise resolving to an array of newsletters
 * @throws Error if the API returns an error
 */
export async function getNewsletters(): Promise<Newsletter[]> {
	try {
		const response = await fetchJson<GetNewslettersResponse>(
			'/api/newsletters',
			getRequestOptions('same-origin', null),
		);
		console.debug('Newsletters fetched:', response);

		if (response.error) {
			throw new Error(`API Error: ${response.error}`);
		}

		if (response.newsletters) {
			return response.newsletters;
		}

		throw new Error('Invalid response format: no newsletters or error message');
	} catch (error) {
		console.error('Error fetching newsletters:', error);
		throw error;
	}
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
	return newsletters.find((newsletter) => newsletter.id === String(id));
}
