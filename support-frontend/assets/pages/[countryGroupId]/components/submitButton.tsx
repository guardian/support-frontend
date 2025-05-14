import { DefaultPaymentButton } from 'components/paymentButton/defaultPaymentButton';
import { PayPalButton } from 'components/payPalPaymentButton/payPalButton';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type {
	Currency,
	IsoCurrency,
} from 'helpers/internationalisation/currency';
import {
	type BillingPeriod,
	getBillingPeriodNoun,
} from 'helpers/productPrice/billingPeriods';
import { isProd } from 'helpers/urls/url';
import {
	paypalOneClickCheckout,
	setupPayPalPayment,
} from '../checkout/helpers/paypal';
import type { PaymentMethod } from './paymentFields';

type SubmitButtonProps = {
	paymentMethod: PaymentMethod | undefined;
	payPalLoaded: boolean;
	payPalBAID: string;
	setPayPalBAID: (baid: string) => void;
	isTestUser: boolean;
	finalAmount: number;
	currencyKey: IsoCurrency;
	ratePlanDescription: {
		billingPeriod: BillingPeriod;
	};
	csrf: string;
	currency: Currency;
	formRef: React.RefObject<HTMLFormElement>;
};

export function SubmitButton({
	paymentMethod,
	payPalLoaded,
	payPalBAID,
	setPayPalBAID,
	formRef,
	isTestUser,
	finalAmount,
	currencyKey,
	ratePlanDescription,
	csrf,
	currency,
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
						}}
						/** the order is Button.payment(opens PayPal window).then(Button.onAuthorize) */
						payment={(resolve, reject) => {
							setupPayPalPayment(
								finalAmount,
								currencyKey,
								ratePlanDescription.billingPeriod,
								csrf,
							)
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
		default:
			return (
				<DefaultPaymentButton
					buttonText={`Pay ${simpleFormatAmount(
						currency,
						finalAmount,
					)} per ${getBillingPeriodNoun(ratePlanDescription.billingPeriod)}`}
					onClick={() => {
						// no-op
						// This isn't needed because we are now using the formOnSubmit handler
					}}
					type="submit"
				/>
			);
	}
}
