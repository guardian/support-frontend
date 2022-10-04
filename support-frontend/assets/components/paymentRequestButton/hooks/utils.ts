import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import { logException } from 'helpers/utilities/logger';

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
	}

	logException('Failed to set name: no name in data object');
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
