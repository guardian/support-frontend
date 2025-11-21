import { fetchJson, getRequestOptions, requestOptions } from '../async/fetch';

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
	newsletters: Newsletter[];
}

/**
 * Fetches available newsletters from the Identity API
 * @returns Promise resolving to an array of newsletters
 */
export async function getNewsletters(): Promise<Newsletter[]> {
	try {
		const response = await fetchJson<GetNewslettersResponse>(
			'/api/newsletters',
			getRequestOptions('same-origin', null),
		);
		console.debug('Newsletters fetched:', response);
		return response.newsletters;
	} catch (error) {
		console.error('Error fetching newsletters:', error);
		return [];
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
