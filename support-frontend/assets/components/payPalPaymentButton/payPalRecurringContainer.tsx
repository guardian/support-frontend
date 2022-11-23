import { useEffect } from 'preact/hooks';
import { useState } from 'react';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { setUpPayPalPayment } from 'helpers/redux/checkout/payment/payPal/thunks';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
	sendFormSubmitEventForPayPalRecurring,
} from 'pages/contributions-landing/contributionsLandingActions';
import { PayPalButton } from './payPalButton';
import type { OnPaypalWindowOpen } from './payPalButtonProps';
import { getPayPalButtonProps } from './payPalButtonProps';

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
		dispatch(paymentWaiting(true));
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: PayPal,
				token: payPalCheckoutDetails.baid,
			}),
		);
	}

	const onWindowOpen: OnPaypalWindowOpen = (resolve, reject) => {
		dispatch(validateForm('PayPal'));
		void dispatch(setUpPayPalPayment({ resolve, reject }));
	};

	const buttonProps = getPayPalButtonProps({
		csrf,
		isTestUser: isTestUser ?? false,
		setValidationControls,
		onClick: () => dispatch(sendFormSubmitEventForPayPalRecurring()),
		onWindowOpen,
		onCompletion,
	});

	useEffect(() => {
		if (disabled) {
			validationControls.disable?.();
		} else {
			validationControls.enable?.();
		}
	}, [disabled, validationControls]);

	return <PayPalButton {...buttonProps} />;
}
