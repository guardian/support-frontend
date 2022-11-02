import React from 'react';
import ReactDOM from 'react-dom';
import { fetchJson } from 'helpers/async/fetch';
import type {
	PayPalCheckoutDetails,
	SetupPayPalRequestType,
} from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import { onThirdPartyPaymentAuthorised } from 'pages/contributions-landing/contributionsLandingActions';

function getPayPalOptions(
	currencyId: IsoCurrency,
	csrf: CsrfState,
	onPayPalCheckoutCompleted: (arg0: PayPalCheckoutDetails) => void,
	onClick: () => void,
	isTestUser: boolean,
	amount: number,
	billingPeriod: BillingPeriod,
	setupPayPalPayment: SetupPayPalRequestType,
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
		payment: (
			resolve: (arg0: string) => void,
			reject: (error: Error) => void,
		) =>
			setupPayPalPayment(
				resolve,
				reject,
				currencyId,
				csrf,
				amount,
				billingPeriod,
			),
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
	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);
	const amount = useContributionsSelector(getUserSelectedAmount);
	const contributionType = useContributionsSelector(getContributionType);

	function onCheckoutCompleted(payPalCheckoutDetails: PayPalCheckoutDetails) {
		void dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: PayPal,
				token: payPalCheckoutDetails.baid,
			}),
		);
	}

	const buttonProps = getPayPalOptions(
		currencyId,
		csrf,
		onCheckoutCompleted,
		console.log,
		isTestUser ?? false,
		amount,
		contributionType.toLowerCase(),
		console.log,
	);

	const Button = window.paypal.Button.driver('react', {
		React,
		ReactDOM,
	});
	return <Button {...buttonProps} />;
}
