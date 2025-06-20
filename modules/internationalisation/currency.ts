export const IsoCurrency = {
	GBP: 'GBP',
	EUR: 'EUR',
	USD: 'USD',
	CAD: 'CAD',
	AUD: 'AUD',
	NZD: 'NZD',
} as const;

export type IsoCurrency = (typeof IsoCurrency)[keyof typeof IsoCurrency];
