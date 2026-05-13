import z from 'zod';
import type { Address } from '../models/Address';

const BASE_URL = 'https://api.ideal-postcodes.co.uk/v1/postcodes/';

const postcodeResponseSchema = z.object({
	result: z.array(
		z.object({
			line_1: z.string(),
			line_2: z.string(),
			line_3: z.string(),
			post_town: z.string(),
			county: z.string(),
			postcode: z.string(),
		}),
	),
});

export type PostcodeResponse = z.infer<typeof postcodeResponseSchema>;

export class IdealPostcodeService {
	private readonly apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async find(postcode: string): Promise<Address[]> {
		const url = `${BASE_URL}${encodeURIComponent(postcode)}`;

		const response = await fetch(url, {
			headers: {
				Authorization: `api_key="${this.apiKey}"`,
			},
		});

		if (!response.ok) {
			throw new Error('Received error response from Ideal Postcodes');
		}

		const parsed = postcodeResponseSchema.safeParse(await response.json());

		if (!parsed.success) {
			throw new Error(`Invalid postcode response: ${parsed.error.message}`);
		}

		return parsed.data.result.map((responseAddress) => ({
			lineOne: responseAddress.line_1,
			lineTwo: responseAddress.line_2,
			city: responseAddress.post_town,
			state: responseAddress.county,
			postCode: responseAddress.postcode,
			// We can assume UK as that's the only context we use this API in
			country: 'UK',
		}));
	}
}
