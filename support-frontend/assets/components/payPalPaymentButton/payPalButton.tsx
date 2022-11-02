import React from 'react';
import ReactDOM from 'react-dom';
import { fetchJson } from 'helpers/async/fetch';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type {
	PayPalTokenReject,
	PayPalTokenResolve,
} from 'helpers/redux/checkout/payment/payPal/thunks';
import { setUpPayPalPayment } from 'helpers/redux/checkout/payment/payPal/thunks';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

function getPayPalOptions(
	csrf: CsrfState,
	onPayPalCheckoutCompleted: (arg0: PayPalCheckoutDetails) => void,
	onClick: () => void,
	isTestUser: boolean,
	setUpForPayment: (
		resolve: PayPalTokenResolve,
		reject: PayPalTokenReject,
	) => void,
): PayPalButtonProps {
	return {
		env: isTestUser
			? window.guardian.payPalEnvironment.uat
			: window.guardian.payPalEnvironment.default,
		style: {
			color: 'blue',
			size: 'responsive',
			label: 'pay',
			tagline: false,
			layout: 'horizontal',
			fundingicons: false,
		},
		// Defines whether user sees 'Agree and Continue' or 'Agree and Pay now' in overlay.
		commit: true,
		validate: console.log,
		funding: {
			disallowed: [window.paypal.FUNDING.CREDIT],
		},
		onClick,
		// This function is called when user clicks the PayPal button.
		payment: setUpForPayment,
		// This function is called when the user finishes with PayPal interface (approves payment).
		onAuthorize: async (payPalData: Record<string, unknown>) => {
			try {
				const body = {
					token: payPalData.paymentToken,
				};
				const csrfToken = csrf.token;
				const payPalCheckoutDetails = await fetchJson(
					routes.payPalOneClickCheckout,
					{
						credentials: 'include',
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Csrf-Token': csrfToken ?? '',
						},
						body: JSON.stringify(body),
					},
				);
				onPayPalCheckoutCompleted(
					payPalCheckoutDetails as PayPalCheckoutDetails,
				);
			} catch (error) {
				logException((error as Error).message);
			}
		},
	};
}

export function PayPalButton(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);

	function onCheckoutCompleted(payPalCheckoutDetails: PayPalCheckoutDetails) {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: PayPal,
				token: payPalCheckoutDetails.baid,
			}),
		);
	}

	const buttonProps = getPayPalOptions(
		csrf,
		onCheckoutCompleted,
		console.log,
		isTestUser ?? false,
		(resolve, reject) => void dispatch(setUpPayPalPayment({ resolve, reject })),
	);

	const Button = window.paypal.Button.driver('react', {
		React,
		ReactDOM,
	});

	return <Button {...buttonProps} />;
}
