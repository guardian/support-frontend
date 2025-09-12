import { isoCountries } from '@modules/internationalisation/country';
import { z } from 'zod';

export const countrySchema = z.enum(isoCountries);

export const addressSchema = z.object({
	lineOne: z.string().nullable(),
	lineTwo: z.string().nullish(),
	city: z.string().nullable(),
	state: z.string().nullable(),
	postCode: z.string().nullable(),
	country: countrySchema,
});

export type Address = z.infer<typeof addressSchema>;

type AddressLine = {
	streetNumber?: string;
	streetName: string;
};

export function combinedAddressLine(
	addressLine1: string | null,
	addressLine2?: string | null,
): AddressLine | undefined {
	const singleAddressLine = (addressLine: string): AddressLine => {
		const pattern = /([0-9]+) (.+)/;
		const match = addressLine.match(pattern);
		if (match) {
			const [, streetNumber, streetName] = match;
			return { streetNumber, streetName: streetName ?? '' };
		} else {
			return { streetName: addressLine };
		}
	};

	const addressLine1MaybeSplit = addressLine1
		? singleAddressLine(addressLine1)
		: undefined;
	const addressLine2MaybeSplit = addressLine2
		? singleAddressLine(addressLine2)
		: undefined;

	const concatStreetNames = (
		firstStreetName: string,
		secondStreetName: string,
	): string => `${firstStreetName}, ${secondStreetName}`;

	if (!addressLine1MaybeSplit && !addressLine2MaybeSplit) {
		return undefined;
	}
	if (addressLine1MaybeSplit && !addressLine2MaybeSplit) {
		return addressLine1MaybeSplit;
	}
	if (!addressLine1MaybeSplit && addressLine2MaybeSplit) {
		return addressLine2MaybeSplit;
	}
	if (addressLine1MaybeSplit && addressLine2MaybeSplit) {
		if (addressLine1MaybeSplit.streetNumber) {
			return {
				streetNumber: addressLine1MaybeSplit.streetNumber,
				streetName: concatStreetNames(
					addressLine1MaybeSplit.streetName,
					addressLine2MaybeSplit.streetName,
				),
			};
		} else if (addressLine2MaybeSplit.streetNumber) {
			return {
				streetNumber: addressLine2MaybeSplit.streetNumber,
				streetName: concatStreetNames(
					addressLine2MaybeSplit.streetName,
					addressLine1MaybeSplit.streetName,
				),
			};
		} else {
			return {
				streetName: concatStreetNames(
					addressLine1MaybeSplit.streetName,
					addressLine2MaybeSplit.streetName,
				),
			};
		}
	}
	return undefined;
}

export function getAddressLine(address: Address): string | undefined {
	const combinedAddressLineResult = combinedAddressLine(
		address.lineOne,
		address.lineTwo,
	);
	if (combinedAddressLineResult) {
		return asFormattedString(combinedAddressLineResult);
	}
	return undefined;
}

export function truncateForZuoraStreetNameLimit(
	addressLine: AddressLine,
): AddressLine {
	if (addressLine.streetName.length > 100) {
		return { ...addressLine, streetName: addressLine.streetName.slice(0, 100) };
	}
	return addressLine;
}

export function asFormattedString(addressLine: AddressLine): string {
	const streetNumberString = addressLine.streetNumber
		? `${addressLine.streetNumber} `
		: '';
	return `${streetNumberString}${addressLine.streetName}`;
}
