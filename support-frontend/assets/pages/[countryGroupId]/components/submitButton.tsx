import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { PayPalButton } from 'components/payPalPaymentButton/payPalButton';
import { isProd } from 'helpers/urls/url';
import {
	paypalOneClickCheckout,
	setupPayPalPayment,
} from '../checkout/helpers/paypal';
import type { PaymentMethod } from './paymentFields';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createSetupToken } from '../checkout/helpers/paypalCompletePayments';

type SubmitButtonProps = {
	buttonText: string;
	paymentMethod: PaymentMethod | undefined;
	payPalLoaded: boolean;
	payPalBAID: string;
	setPayPalBAID: (baid: string) => void;
	isTestUser: boolean;
	finalAmount: number;
	currencyKey: IsoCurrency;
	billingPeriod: BillingPeriod;
	csrf: string;
	formRef: React.RefObject<HTMLFormElement>;
};

export function SubmitButton({
	buttonText,
	paymentMethod,
	payPalLoaded,
	payPalBAID,
	setPayPalBAID,
	formRef,
	isTestUser,
	finalAmount,
	currencyKey,
	billingPeriod,
	csrf,
}: SubmitButtonProps) {
	switch (paymentMethod) {
		case 'PayPal':
			return payPalLoaded ? (
				<>
					<input type="hidden" name="payPalBAID" value={payPalBAID} />

					<PayPalButton
						env={isProd() && !isTestUser ? 'production' : 'sandbox'}
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
							/** We run this initially to set the button to the correct state */
							const valid = formRef.current?.checkValidity();
							if (valid) {
								enable();
							} else {
								disable();
							}

							/** And then run it on form change */
							formRef.current?.addEventListener('change', (event) => {
								const element = event.currentTarget as HTMLFormElement;
								/* We call this twice because the first time does not
                   not give us an accurate state of the form.
                   This seems to be because we use `setCustomValidity` on the elements */
								element.checkValidity();
								const valid = element.checkValidity();

								if (valid) {
									enable();
								} else {
									disable();
								}
							});
						}}
						funding={{
							disallowed: [window.paypal.FUNDING.CREDIT],
						}}
						onClick={() => {
							// TODO - add tracking

							// The button won't actually submit if the form
							// isn't valid but we can check here and if invalid
							// the browser will scroll the user to the first
							// error if necessary
							const valid = formRef.current?.checkValidity();
							if (!valid) {
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
				<PayPalScriptProvider
					options={{
						clientId: 'sb',
						vault: true,
						intent: 'tokenize',
						environment: 'sandbox',
						currency: 'GBP',
						debug: false,
					}}
				>
					<PayPalButtons
						style={{ layout: 'horizontal' }}
						// createVaultSetupToken={() => {
						// 	return Promise.resolve('TEST_VAULT_SETUP_TOKEN');
						// }}
						createBillingAgreement={async () => {
							// OLD CODE BELOW
							// const setupToken = await setupPayPalPayment(
							// 	10,
							// 	'GBP',
							// 	BillingPeriod.Monthly,
							// 	csrf,
							// );
							const setupToken = await createSetupToken(csrf);
							console.log({ setupToken });
							return setupToken;
						}}
						onApprove={(data, actions) => {
							console.log({ data });
							// Set the state here to submit the form with the BAID/Vault token
							return Promise.resolve();
						}}
					/>
				</PayPalScriptProvider>
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
