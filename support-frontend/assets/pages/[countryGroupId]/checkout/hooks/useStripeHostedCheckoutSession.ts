import { useEffect, useState } from 'react';
import type { CheckoutSession } from '../helpers/stripeCheckoutSession';
import { getFormDetails } from '../helpers/stripeCheckoutSession';

export function useStripeHostedCheckoutSession(
	checkoutSessionId: string | null,
): [CheckoutSession | undefined, () => void] {
	const [checkoutSession, setCheckoutSession] = useState<
		CheckoutSession | undefined
	>();

	useEffect(() => {
		if (checkoutSessionId) {
			const persistedFormData = getFormDetails(checkoutSessionId);

			console.log('getting data for checkout session', checkoutSessionId);
			if (persistedFormData) {
				console.log('found persisted form data', persistedFormData);
				setCheckoutSession(persistedFormData);
			} else {
				setCheckoutSession(undefined);
			}
		} else {
			setCheckoutSession(undefined);
		}
	}, [checkoutSessionId]);

	return [checkoutSession, () => setCheckoutSession(undefined)];
}
