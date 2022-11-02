import { fetchJson } from 'helpers/async/fetch';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type {
	PayPalTokenReject,
	PayPalTokenResolve,
} from 'helpers/redux/checkout/payment/payPal/thunks';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';

export type PayPalButtonControls = {
	enable?: () => void;
	disable?: () => void;
};

export type OnPaypalWindowOpen = (
	resolve: PayPalTokenResolve,
	reject: PayPalTokenReject,
) => void;

type PayPalPropsRequirements = {
	csrf: CsrfState;
	isTestUser: boolean;
	setValidationControls: (controls: PayPalButtonControls) => void;
	onClick: () => void;
	onWindowOpen: OnPaypalWindowOpen;
	onCompletion: (arg0: PayPalCheckoutDetails) => void;
};

export function getPayPalOptions({
	csrf,
	isTestUser,
	setValidationControls,
	onClick,
	onWindowOpen,
	onCompletion,
}: PayPalPropsRequirements): PayPalButtonProps {
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
		validate: setValidationControls,
		funding: {
			disallowed: [window.paypal.FUNDING.CREDIT],
		},
		onClick,
		// This function is called when user clicks the PayPal button.
		payment: onWindowOpen,
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
				onCompletion(payPalCheckoutDetails as PayPalCheckoutDetails);
			} catch (error) {
				logException((error as Error).message);
			}
		},
	};
}
