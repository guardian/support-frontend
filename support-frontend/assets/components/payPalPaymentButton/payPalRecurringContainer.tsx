import { useEffect } from 'preact/hooks';
import { useState } from 'react';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import { setUpPayPalPayment } from 'helpers/redux/checkout/payment/payPal/thunks';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';
import { PayPalButton } from './payPalButton';
import type { OnPaypalWindowOpen } from './utils';
import { getPayPalOptions } from './utils';

type PayPalButtonControls = {
	enable?: () => void;
	disable?: () => void;
};

type PayPalButtonRecuringContainerProps = {
	disabled: boolean;
};

export function PayPalButtonRecurringContainer({
	disabled,
}: PayPalButtonRecuringContainerProps): JSX.Element {
	const [validationControls, setValidationControls] =
		useState<PayPalButtonControls>({});

	const dispatch = useContributionsDispatch();
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);

	function onCompletion(payPalCheckoutDetails: PayPalCheckoutDetails) {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: PayPal,
				token: payPalCheckoutDetails.baid,
			}),
		);
	}

	const onWindowOpen: OnPaypalWindowOpen = (resolve, reject) =>
		void dispatch(setUpPayPalPayment({ resolve, reject }));

	const buttonProps = getPayPalOptions({
		csrf,
		isTestUser: isTestUser ?? false,
		setValidationControls,
		onClick: console.log,
		onWindowOpen,
		onCompletion,
	});

	useEffect(() => {
		if (disabled) {
			validationControls.disable?.();
		} else {
			validationControls.enable?.();
		}
	}, [disabled]);

	return <PayPalButton {...buttonProps} />;
}
