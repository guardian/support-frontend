import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { PayPalButton } from 'components/payPalPaymentButton/payPalButton';
import { isProd } from 'helpers/urls/url';
import {
	paypalOneClickCheckout,
	setupPayPalPayment,
} from '../checkout/helpers/paypal';
import type { PaymentToken } from '../checkout/helpers/paypalCompletePayments';
import {
	createSetupToken,
	exchangeSetupTokenForPaymentToken,
} from '../checkout/helpers/paypalCompletePayments';
import { getPayPalEnv } from '../checkout/helpers/payPalSdkOptions';
import { paypalSdkFundingBlocklist } from '../checkout/helpers/payPalSdkOptions';
import type { PaymentMethod } from './paymentFields';

type ApprovedSetupToken = {
	vaultSetupToken: string;
};

type SubmitButtonProps = {
	buttonText: string;
	paymentMethod: PaymentMethod | undefined;
	payPalLoaded: boolean;
	payPalBAID: string;
	setPayPalBAID: (baid: string) => void;
	payPalPaymentToken: PaymentToken | undefined;
	setPayPalPaymentToken: (paymentToken: PaymentToken) => void;
	isTestUser: boolean;
	finalAmount: number;
	currencyKey: IsoCurrency;
	billingPeriod: BillingPeriod;
	csrf: string;
	formRef: React.RefObject<HTMLFormElement>;
	paypalClientId: string;
	setErrorMessage: (message: string) => void;
	setErrorContext: (context: string) => void;
};

const useFormIsValid = (
	paymentMethod: PaymentMethod | undefined,
	formRef: React.RefObject<HTMLFormElement>,
) => {
	const [formIsValid, setFormIsValid] = useState<boolean>(false);
	const [hasAddedEventListener, setHasAddedEventListener] =
		useState<boolean>(false);

	// We need to handle these payment methods slightly differently, because their
	// button isn't part of the checkout form. We don't do this for all payment
	// methods because it makes the validation a bit aggressive.
	const shouldManageFormStateManually =
		paymentMethod === 'PayPal' || paymentMethod === 'PayPalCompletePayments';

	useEffect(() => {
		if (shouldManageFormStateManually) {
			setFormIsValid(formRef.current?.checkValidity() ?? false);
		}

		const callback = (event: Event) => {
			const element = event.currentTarget as HTMLFormElement;
			// We call this twice because the first time does not not give
			// us an accurate state of the form. This seems to be because
			// we use `setCustomValidity` on the elements
			element.checkValidity();
			const valid = element.checkValidity();

			setFormIsValid(valid);
		};

		// We want to add the form change event listener when the user selects
		// PayPal or PPCP, but we we also want to keep it if the user then
		// switches to another payment method, so that if they then fix any form
		// errors, the errors go away. That's why we don't remove us in a
		// cleanup handler returned from the useEffect. This behaves similarly
		// to the previous version of this code where the event listener was
		// added in the validate callpack prop of the PayPalButton component.
		if (shouldManageFormStateManually && !hasAddedEventListener) {
			// And then run it on form change
			formRef.current?.addEventListener('change', callback);

			setHasAddedEventListener(true);
		}
	}, [paymentMethod]);

	return formIsValid;
};

export function SubmitButton({
	buttonText,
	paymentMethod,
	payPalLoaded,
	payPalBAID,
	setPayPalBAID,
	payPalPaymentToken,
	setPayPalPaymentToken,
	formRef,
	isTestUser,
	finalAmount,
	currencyKey,
	billingPeriod,
	csrf,
	paypalClientId,
	setErrorMessage,
	setErrorContext,
}: SubmitButtonProps) {
	// We only need this for PayPal and PayPalCompletePayments
	const formIsValid = useFormIsValid(paymentMethod, formRef);

	switch (paymentMethod) {
		case 'PayPal':
			return payPalLoaded ? (
				<>
					<input type="hidden" name="payPalBAID" value={payPalBAID} />

					<PayPalButton
						env={getPayPalEnv(isProd(), isTestUser)}
						style={{
							color: 'blue',
							size: 'responsive',
							label: 'pay',
							tagline: false,
							layout: 'horizontal',
							fundingicons: false,
						}}
						commit={true}
						validate={({ disable, enable }) => {
							if (formIsValid) {
								enable();
							} else {
								disable();
							}
						}}
						funding={{
							disallowed: [
								(window.paypal as unknown as PayPalLegacyWindow).FUNDING.CREDIT,
							],
						}}
						onClick={() => {
							// The button won't actually submit if the form
							// isn't valid but we can check here and if invalid
							// the browser will scroll the user to the first
							// error if necessary
							if (!formIsValid) {
								/** We run this so the form validation happens and focus on errors */
								formRef.current?.requestSubmit();
							}
						}}
						/** the order is Button.payment(opens PayPal window).then(Button.onAuthorize) */
						payment={(resolve, reject) => {
							setupPayPalPayment(finalAmount, currencyKey, billingPeriod, csrf)
								.then((token) => {
									resolve(token);
								})
								.catch((error) => {
									console.error(error);
									reject(error as Error);
								});
						}}
						onAuthorize={(payPalData: Record<string, unknown>) => {
							void paypalOneClickCheckout(payPalData.paymentToken, csrf).then(
								(baid) => {
									// The state below has a useEffect that submits the form
									setPayPalBAID(baid);
								},
							);
						}}
					/>
				</>
			) : null;

		case 'StripeHostedCheckout':
			return (
				<DefaultPaymentButton
					buttonText="Continue to payment"
					onClick={() => {
						// no-op
						// This isn't needed because we are now using the formOnSubmit handler
					}}
					type="submit"
				/>
			);

		case 'PayPalCompletePayments':
			return (
				<>
					{payPalPaymentToken && (
						<>
							<input
								type="hidden"
								name="payPalPaymentToken"
								value={payPalPaymentToken.token}
							/>
							<input
								type="hidden"
								name="payPalEmail"
								value={payPalPaymentToken.email}
							/>
						</>
					)}
					<PayPalScriptProvider
						options={{
							clientId: paypalClientId,
							environment: getPayPalEnv(isProd(), isTestUser),
							currency: currencyKey,
							debug: false,
							disableFunding: paypalSdkFundingBlocklist,
						}}
					>
						<PayPalButtons
							style={{ color: 'blue', layout: 'horizontal', tagline: false }}
							createVaultSetupToken={async () => {
								const setupToken = await createSetupToken(csrf);
								return setupToken;
							}}
							onApprove={async (data) => {
								const approvedSetupToken = (
									data as unknown as ApprovedSetupToken
								).vaultSetupToken;

								const paymentToken = await exchangeSetupTokenForPaymentToken(
									csrf,
									approvedSetupToken,
								);

								// This will trigger a form submission
								setPayPalPaymentToken(paymentToken);
							}}
							onClick={(_data, actions) => {
								// The button won't actually submit if the form
								// isn't valid but we can check here and if invalid
								// the browser will scroll the user to the first
								// error if necessary
								if (!formIsValid) {
									/** We run this so the form validation happens and focus on errors */
									formRef.current?.requestSubmit();
									// We reject here so that the PayPal flow doesn't start.
									// Unfortunately it does result in a brief flash of the modal.
									// The PayPalButtons component does support a disabled prop
									// but when set to true this renders the button in a clearly
									// disabled state. The UI pattern used on the form is to leave
									// the button clickable and then scroll to any validation
									// errors if necessary. Rendering the button in a clearly
									// disabled state isn't compatible with this pattern.
									return actions.reject();
								}

								return actions.resolve();
							}}
							onError={() => {
								// TODO: Get proper copy for this:
								setErrorMessage('Sorry, something went wrong');
								setErrorContext('Please try again.');
							}}
						/>
					</PayPalScriptProvider>
				</>
			);

		default:
			return (
				<DefaultPaymentButton
					buttonText={buttonText}
					onClick={() => {
						// no-op
						// This isn't needed because we are now using the formOnSubmit handler
					}}
					type="submit"
				/>
			);
	}
}
