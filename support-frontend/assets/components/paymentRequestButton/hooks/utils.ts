import type { PaymentMethod } from '@stripe/stripe-js';
import {
	findIsoCountry,
	stateProvinceFromString,
} from 'helpers/internationalisation/country';
import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import { logException } from 'helpers/utilities/logger';
import {
	updateBillingCountry,
	updateBillingState,
} from 'pages/contributions-landing/contributionsLandingActions';

export function setPayerName(
	dispatch: ContributionsDispatch,
	payerName?: string,
): void {
	// This turns "    jean    claude    van    damme     " into ["jean", "claude", "van", "damme"]
	const nameParts = payerName?.trim().replace(/\s+/g, ' ').split(' ') ?? [];

	if (nameParts.length > 1) {
		dispatch(setFirstName(nameParts[0]));
		dispatch(setLastName(nameParts.slice(1).join(' ')));
	} else if (nameParts.length === 1) {
		logException(
			`Failed to set name: no spaces in data object: ${nameParts.join('')}`,
		);
	} else {
		logException('Failed to set name: no name in data object');
	}
}

export function setPayerEmail(
	dispatch: ContributionsDispatch,
	payerEmail?: string,
): void {
	if (payerEmail) {
		dispatch(setEmail(payerEmail));
	} else {
		logException('Failed to set email: no email in data object');
	}
}

export function setBillingCountryAndState(
	dispatch: ContributionsDispatch,
	billingDetails: PaymentMethod.BillingDetails,
): void {
	const { country, state } = billingDetails.address ?? {};

	const validatedCountry = findIsoCountry(country ?? undefined);

	if (validatedCountry) {
		const validatedState = stateProvinceFromString(
			validatedCountry,
			state ?? undefined,
		);

		dispatch(updateBillingCountry(validatedCountry));
		dispatch(updateBillingState(validatedState ?? ''));
	}
}
