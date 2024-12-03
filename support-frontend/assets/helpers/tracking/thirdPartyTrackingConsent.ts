import { onConsentChange } from '@guardian/libs';
import type { ConsentState } from '@guardian/libs';
import { logException } from 'helpers/utilities/logger';

const onConsentChangeEvent = async (
	onConsentChangeCallback: (
		thirdPartyTrackingConsent: Record<string, boolean>,
	) => void,
	vendorIds: Record<string, string>,
): Promise<void> => {
	let consentGranted = Object.keys(vendorIds).reduce(
		(accumulator, vendorKey) => ({ ...accumulator, [vendorKey]: false }),
		{},
	);

	/**
	 * @guardian/libs exports a function
	 * onConsentChange, this takes a callback, which is called
	 * each time consent changes. EG. if a user consents via the CMP.
	 * The callback will receive the user's consent as the parameter
	 * "state". We take process the state and call onConsentChangeCallback
	 * with the correct ThirdPartyTrackingConsent.
	 */
	try {
		onConsentChange((state: ConsentState) => {
			if (state.usnat) {
				consentGranted = Object.keys(vendorIds).reduce(
					(accumulator, vendorKey) => ({
						...accumulator,
						[vendorKey]: state.usnat ? !state.usnat.doNotSell : false,
					}),
					{},
				);
			} else if (state.aus) {
				consentGranted = Object.keys(vendorIds).reduce(
					(accumulator, vendorKey) => ({
						...accumulator,
						[vendorKey]: state.aus ? state.aus.personalisedAdvertising : false,
					}),
					{},
				);
			} else if (state.tcfv2) {
				/**
				 * Loop over vendorIds and pull
				 * vendor specific consent from state.
				 */
				consentGranted = Object.keys(vendorIds).reduce(
					(accumulator, vendorKey) => {
						const vendorId = vendorIds[vendorKey];

						if (state.tcfv2?.vendorConsents[vendorId] !== undefined) {
							return {
								...accumulator,
								[vendorKey]: state.tcfv2.vendorConsents[vendorId],
							};
						}

						/**
						 * If vendorId not in state.tcfv2.vendorConsents fallback
						 * to all 10 purposes having to be true for consentGranted to be
						 * true
						 */
						return {
							...accumulator,
							[vendorKey]: state.tcfv2
								? Object.values(state.tcfv2.consents).every(Boolean)
								: false,
						};
					},
					{},
				);
			}

			onConsentChangeCallback(consentGranted);
		});
	} catch (err: unknown) {
		logException(`CMP: ${err as string}`);
		// fallback to default consentGranted of false for all vendors in case of an error
		onConsentChangeCallback(consentGranted);
	}

	// fallback to default consentGranted of false for all vendors if server side rendering
	onConsentChangeCallback(consentGranted);
	// return Promise.resolve() for unit tests
	return Promise.resolve();
};

export { onConsentChangeEvent };
