// ----- Imports ----- //
import type { Dispatch } from 'redux';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import * as storage from 'helpers/storage/storage';
import type { Option } from 'helpers/types/option';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import { billingPeriodFromContrib, getAmount } from '../../contributions';

export type SetupPayPalRequestType = (
	resolve: (arg0: string) => void,
	reject: (arg0: Error) => void,
	isoCurrency: IsoCurrency,
	csrfState: CsrfState,
	amount: number,
	billingPeriod: BillingPeriod,
) => void;

export type PayPalUserDetails = {
	firstName: string;
	lastName: string;
	email: string;
	shipToStreet: string;
	shipToCity: string;
	shipToState: Option<string>;
	shipToZip: string;
	shipToCountryCode: string;
};

export type PayPalCheckoutDetails = {
	baid: string;
	user: Option<PayPalUserDetails>;
};

// ----- Functions ----- //
const loadPayPalRecurring = (): Promise<void> => {
	return new Promise((resolve) => {
		const script: HTMLScriptElement = document.createElement('script');
		script.onload = () => resolve();
		script.src = 'https://www.paypalobjects.com/api/checkout.js';

		document.head.appendChild(script);
	});
};

const payPalRequestData = (
	bodyObj: Record<string, unknown>,
	csrfToken: string,
): Partial<RequestInit> => {
	return {
		credentials: 'include',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrfToken,
		},
		body: JSON.stringify(bodyObj),
	};
};

// This is the recurring PayPal equivalent of the "Create a payment" Step 1 described above.
// It happens when the user clicks the recurring PayPal button,
// before the PayPal popup in which they authorise the payment appears.
// It should probably be called createOneOffPayPalPayment but it's called setupPayment
// on the backend so pending a far-reaching rename, I'll keep the terminology consistent with the backend.
const setupRecurringPayPalPayment =
	(
		resolve: (arg0: string) => void,
		reject: (arg0: Error) => void,
		currency: IsoCurrency,
		csrf: CsrfState,
	) =>
	(_dispatch: Dispatch, getState: () => State): void => {
		const state = getState();
		const csrfToken = csrf.token;
		const contributionType = getContributionType(state);
		const amount = getAmount(
			state.page.checkoutForm.product.selectedAmounts,
			state.page.checkoutForm.product.otherAmounts,
			contributionType,
		);
		const billingPeriod = billingPeriodFromContrib(contributionType);
		storage.setSession('selectedPaymentMethod', 'PayPal');
		const requestBody = {
			amount,
			billingPeriod,
			currency,
			requireShippingAddress: false,
		};
		fetch(
			routes.payPalSetupPayment,
			payPalRequestData(requestBody, csrfToken ?? ''),
		)
			.then((response) => (response.ok ? response.json() : null))
			.then(
				(
					token: {
						token: string;
					} | null,
				) => {
					if (token) {
						resolve(token.token);
					} else {
						logException('PayPal token came back blank');
					}
				},
			)
			.catch((err: Error) => {
				logException(err.message);
				reject(err);
			});
	};

// This is the recurring PayPal Express version of the PayPal checkout.
// It happens when the user clicks the PayPal button, and before the PayPal popup
// appears to allow the user to authorise the payment.
const setupSubscriptionPayPalPayment =
	(
		resolve: (arg0: string) => void,
		reject: (arg0: Error) => void,
		currency: IsoCurrency,
		csrf: CsrfState,
		amount: number,
		billingPeriod: BillingPeriod,
		requireShippingAddress: boolean,
	) =>
	(): void => {
		const csrfToken = csrf.token;
		storage.setSession('selectedPaymentMethod', PayPal);
		const requestBody = {
			amount,
			billingPeriod,
			currency,
			requireShippingAddress,
		};
		fetch(
			routes.payPalSetupPayment,
			payPalRequestData(requestBody, csrfToken ?? ''),
		)
			.then((response) => (response.ok ? response.json() : null))
			.then(
				(
					token: {
						token: string;
					} | null,
				) => {
					if (token) {
						resolve(token.token);
					} else {
						logException('PayPal token came back blank');
					}
				},
			)
			.catch((err: Error) => {
				logException(err.message);
				reject(err);
			});
	};

const setupSubscriptionPayPalPaymentNoShipping = (
	resolve: (arg0: string) => void,
	reject: (arg0: Error) => void,
	currency: IsoCurrency,
	csrf: CsrfState,
	amount: number,
	billingPeriod: BillingPeriod,
): (() => void) =>
	setupSubscriptionPayPalPayment(
		resolve,
		reject,
		currency,
		csrf,
		amount,
		billingPeriod,
		false,
	);

const setupSubscriptionPayPalPaymentWithShipping = (
	resolve: (arg0: string) => void,
	reject: (arg0: Error) => void,
	currency: IsoCurrency,
	csrf: CsrfState,
	amount: number,
	billingPeriod: BillingPeriod,
): (() => void) =>
	setupSubscriptionPayPalPayment(
		resolve,
		reject,
		currency,
		csrf,
		amount,
		billingPeriod,
		true,
	);

const setupPayment = (
	currencyId: IsoCurrency,
	csrf: CsrfState,
	amount: number,
	billingPeriod: BillingPeriod,
	setupPayPalPayment: SetupPayPalRequestType,
) => {
	return (resolve: (arg0: string) => void, reject: (error: Error) => void) => {
		setupPayPalPayment(
			resolve,
			reject,
			currencyId,
			csrf,
			amount,
			billingPeriod,
		);
	};
};

const getPayPalEnvironment = (isTestUser: boolean): string =>
	isTestUser
		? window.guardian.payPalEnvironment.uat
		: window.guardian.payPalEnvironment.default;

const createAgreement = async (
	payPalData: Record<string, unknown>,
	csrf: CsrfState,
) => {
	const body = {
		token: payPalData.paymentToken,
	};
	const csrfToken = csrf.token;
	const response = await fetch(
		routes.payPalOneClickCheckout,
		payPalRequestData(body, csrfToken ?? ''),
	);
	return (await response.json()) as Record<string, unknown>;
};

const getPayPalOptions = (
	currencyId: IsoCurrency,
	csrf: CsrfState,
	onPayPalCheckoutCompleted: (arg0: PayPalCheckoutDetails) => void,
	canOpen: () => boolean,
	onClick: () => void,
	_formClassName: string,
	isTestUser: boolean,
	amount: number,
	billingPeriod: BillingPeriod,
	setupPayPalPayment: SetupPayPalRequestType,
	updatePayPalButtonReady: (ready: boolean) => void,
): Record<string, unknown> => {
	function toggleButton(actions: {
		enable: () => void;
		disable: () => void;
	}): void {
		return canOpen() ? actions.enable() : actions.disable();
	}

	return {
		env: getPayPalEnvironment(isTestUser),
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

		validate(actions: { enable: () => void; disable: () => void }) {
			window.enablePayPalButton = actions.enable;
			window.disablePayPalButton = actions.disable;
			toggleButton(actions);
			updatePayPalButtonReady(true);
		},

		funding: {
			disallowed: [window.paypal.FUNDING.CREDIT],
		},
		onClick,
		// This function is called when user clicks the PayPal button.
		payment: setupPayment(
			currencyId,
			csrf,
			amount,
			billingPeriod,
			setupPayPalPayment,
		),
		// This function is called when the user finishes with PayPal interface (approves payment).
		onAuthorize: (data: Record<string, unknown>) => {
			createAgreement(data, csrf)
				.then((payPalCheckoutDetails) =>
					onPayPalCheckoutCompleted(
						payPalCheckoutDetails as PayPalCheckoutDetails,
					),
				)
				.catch((err: { message: string }) => {
					logException(err.message);
				});
		},
	};
};

// ----- Exports ----- //
export {
	getPayPalOptions,
	loadPayPalRecurring,
	payPalRequestData,
	setupSubscriptionPayPalPaymentNoShipping,
	setupRecurringPayPalPayment,
	setupSubscriptionPayPalPaymentWithShipping,
};
