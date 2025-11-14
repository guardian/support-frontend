import { fetchJson, getRequestOptions } from '../async/fetch';

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

