import { useEffect } from 'preact/hooks';
import { useState } from 'react';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { setUpPayPalPayment } from 'helpers/redux/checkout/payment/payPal/thunks';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackCheckoutSubmitAttempt } from 'helpers/tracking/behaviour';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
} from 'pages/supporter-plus-landing/setup/legacyActionCreators';
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

	const contributionType = useContributionsSelector(getContributionType);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { userTypeFromIdentityResponse } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);
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
		isTestUser,
		setValidationControls,
		onClick: () =>
			trackCheckoutSubmitAttempt(
				`PayPal-${contributionType}-submit`,
				`npf-allowed-for-user-type-${userTypeFromIdentityResponse}`,
			),
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
