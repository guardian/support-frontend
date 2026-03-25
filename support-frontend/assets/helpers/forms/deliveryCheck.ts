import { getGlobal } from 'helpers/globalsAndSwitches/globals';

const M25_POSTCODE_PREFIXES =
	getGlobal<string[]>('homeDeliveryPostcodes') ?? [];

export const postcodeIsWithinM25 = (postcode: string): boolean => {
	const [area = ''] = postcode.split(' ');
	return M25_POSTCODE_PREFIXES.includes(area.toUpperCase());
};
