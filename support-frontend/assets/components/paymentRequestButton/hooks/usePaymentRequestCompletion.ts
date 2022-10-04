import type { PaymentRequest } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { trackComponentEvents } from 'helpers/tracking/ophan';
import { paymentWaiting } from 'pages/contributions-landing/contributionsLandingActions';
import { setPayerEmail, setPayerName } from './utils';

export function usePaymentRequestCompletion(
	paymentRequest: PaymentRequest | null,
): void {
	const dispatch = useContributionsDispatch();

	useEffect(() => {
		if (paymentRequest) {
			paymentRequest.on('paymentmethod', (paymentMethodEvent) => {
				const { complete, paymentMethod, payerName, payerEmail } =
					paymentMethodEvent;

				complete('success');

				setPayerName(dispatch, payerName);
				setPayerEmail(dispatch, payerEmail);
				trackComponentClick(
					`${paymentMethodEvent.walletName}-paymentAuthorised`,
				);

				dispatch(paymentWaiting(true));

				const walletType =
					(paymentMethod.card?.wallet?.type as string | null) ?? 'no-wallet';

				trackComponentEvents({
					component: {
						componentType: 'ACQUISITIONS_OTHER',
					},
					action: 'CLICK',
					id: 'stripe-prb-wallet',
					value: walletType,
				});
			});
		}
	}, [paymentRequest]);
}
