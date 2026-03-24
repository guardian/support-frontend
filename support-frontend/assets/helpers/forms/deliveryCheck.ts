import { getGlobal } from 'helpers/globalsAndSwitches/globals';

const M25_POSTCODE_PREFIXES =
	getGlobal<string[]>('homeDeliveryPostcodes') ?? [];

export const postcodeHasPrefix = (
	postcode: string,
	expectedPrefix: string,
): boolean => {
	const formattedPostcode = postcode.replace(' ', '').toUpperCase();
	const actualPrefix = formattedPostcode.slice(0, -3);
	return actualPrefix === expectedPrefix;
};

const postcodeIsWithinDeliveryArea = (
	postcode: string,
	allowedPrefixes: string[] = M25_POSTCODE_PREFIXES,
): boolean =>
	allowedPrefixes.filter((prefix) => postcodeHasPrefix(postcode, prefix))
		.length > 0;

const postcodeIsWithinM25 = (postcode: string): boolean => {
	const [area = ''] = postcode.split(' ');
	return M25_POSTCODE_PREFIXES.includes(area.toUpperCase());
};

export { postcodeIsWithinDeliveryArea, postcodeIsWithinM25 };
