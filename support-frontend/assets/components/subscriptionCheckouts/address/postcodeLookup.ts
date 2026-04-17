import { getFeatureFlags } from 'helpers/featureFlags';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { postcodeLookupUrl } from 'helpers/urls/routes';

export type PostcodeFinderResult = {
	lineOne?: string;
	lineTwo?: string;
	city?: string;
};

function handleErrors(response: Response) {
	if (response.ok) {
		return response;
	}

	if (response.status === 500) {
		throw new Error(
			'External address service temporarily unavailable. Please proceed with checkout. We apologise for the inconvenience',
		);
	} else if (response.status === 400) {
		throw new Error(
			"We couldn't find this postcode, please check and try again or enter your address below.",
		);
	} else {
		throw new Error(
			`Error while contacting address API: ${response.statusText}`,
		);
	}
}

export async function findAddressesForPostcode(
	postcode: string,
): Promise<PostcodeFinderResult[]> {
	const postcodeLookup = getGlobal('checkoutPostcodeLookup');
	const { express } = getFeatureFlags(); // cd support-api + pnpm start
	if (postcodeLookup) {
		const url = express
			? `http://localhost:3000/postcode-lookup/${postcode}`
			: postcodeLookupUrl(postcode);
		console.log(
			`*** Calling ${
				express ? 'express' : 'standard'
			} postcode lookup API for postcode: ${postcode} url:${url}`,
		);
		const response = await fetch(url).then(handleErrors);
		const obj = response.json() as Promise<PostcodeFinderResult[]>;
		console.log(`*** Response: ${JSON.stringify(obj)}`);
		return obj;
	}

	return [];
}
