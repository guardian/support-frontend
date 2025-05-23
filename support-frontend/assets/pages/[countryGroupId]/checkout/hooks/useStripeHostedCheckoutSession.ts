import { useEffect, useState } from 'react';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import {
	deleteFormDetails,
	getFormDetails,
} from '../helpers/stripeCheckoutSession';

export function useStripeHostedCheckoutSession(
	checkoutSessionId: string | null,
): [CheckoutSession | undefined, () => void] {
	const [checkoutSession, setCheckoutSession] = useState<
		CheckoutSession | undefined
	>();

	useEffect(() => {
		if (checkoutSessionId) {
			const persistedFormData = getFormDetails(checkoutSessionId);

			if (persistedFormData) {
				setCheckoutSession(persistedFormData);
			} else {
				setCheckoutSession(undefined);
			}
		} else {
			setCheckoutSession(undefined);
		}
	}, [checkoutSessionId]);

	return [
		checkoutSession,
		() => {
			deleteFormDetails();
			setCheckoutSession(undefined);
		},
	];
}
