import { css } from '@emotion/react';
import { ExpressCheckoutElement, useElements } from '@stripe/react-stripe-js';
import type { ExpressPaymentType } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';

/**
 * The ExpressCheckoutElement has to be mounted for Stripe to tell us, via its
 * onReady callback, whether Apple Pay is available to this user. We therefore
 * always render it, but keep it visually hidden until the user selects Apple
 * Pay as their payment method, at which point it takes the place of the
 * standard payment CTA.
 *
 * We deliberately collapse the height rather than using `display: none` or
 * `visibility: hidden` so that the element keeps its width and Stripe is able
 * to render and measure the button.
 */
const hiddenStyles = css`
	height: 0;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;
`;

type ExpressCheckoutApplePayProps = {
	/** Whether the user has selected Apple Pay as their payment method */
	selected: boolean;
	/** The price, excluding any estimated sales tax, in major currency units */
	amountExcludingTax: number;
	/** The estimated sales tax, in major currency units. Zero when tax inclusive */
	estimatedTaxAmount: number;
	taxExclusive: boolean;
	formRef: React.RefObject<HTMLFormElement>;
	/** Called with the result of Stripe's Apple Pay availability detection */
	setApplePayIsAvailable: (applePayIsAvailable: boolean) => void;
	/** Called once the user has authorised the payment in the Apple Pay sheet */
	onConfirmed: (expressPaymentType: ExpressPaymentType) => void;
	setErrorMessage: (message: string) => void;
};

export function ExpressCheckoutApplePay({
	selected,
	amountExcludingTax,
	estimatedTaxAmount,
	taxExclusive,
	formRef,
	setApplePayIsAvailable,
	onConfirmed,
	setErrorMessage,
}: ExpressCheckoutApplePayProps) {
	const elements = useElements();

	const totalAmount = amountExcludingTax + estimatedTaxAmount;

	useEffect(() => {
		// Keep the total shown in the Apple Pay sheet in step with any tax we've
		// estimated from the billing address the user has entered in the form.
		void elements?.update({ amount: Math.round(totalAmount * 100) });
	}, [elements, totalAmount]);

	return (
		<div css={selected ? undefined : hiddenStyles} aria-hidden={!selected}>
			<ExpressCheckoutElement
				onReady={({ availablePaymentMethods }) => {
					setApplePayIsAvailable(!!availablePaymentMethods?.applePay);
				}}
				onClick={({ resolve, reject }) => {
					/** @see https://docs.stripe.com/elements/express-checkout-element/accept-a-payment?locale=en-GB#handle-click-event */

					// The rest of the checkout form is filled in before the Apple Pay
					// sheet is opened, so don't open it if the form isn't valid. We call
					// checkValidity twice because the first call does not give an
					// accurate result, seemingly because we use setCustomValidity on
					// some of the elements.
					formRef.current?.checkValidity();
					if (formRef.current?.checkValidity() === false) {
						formRef.current.reportValidity();
						reject();
						return;
					}

					// We collect the customer's details in the form, so there's no need
					// to ask for them again in the payment sheet.
					const options: NonNullable<Parameters<typeof resolve>[0]> = {
						emailRequired: false,
						billingAddressRequired: false,
					};

					if (taxExclusive) {
						// Show the tax breakdown in the payment sheet
						options.lineItems = [
							{
								name: 'Subtotal (excl. tax)',
								amount: Math.round(amountExcludingTax * 100),
							},
							{
								name: 'Estimated tax',
								amount: Math.round(estimatedTaxAmount * 100),
							},
						];
					}

					// Track payment method selection with QM
					sendEventPaymentMethodSelected('StripeExpressCheckoutElement');

					resolve(options);
				}}
				onConfirm={async (event) => {
					if (!elements) {
						console.error('Stripe not loaded');
						return;
					}

					const { error: submitError } = await elements.submit();

					if (submitError) {
						setErrorMessage(
							submitError.message ?? 'Sorry, something went wrong',
						);
						return;
					}

					onConfirmed(event.expressPaymentType);
				}}
				options={{
					paymentMethods: {
						applePay: 'auto',
						googlePay: 'never',
						link: 'never',
						amazonPay: 'never',
						paypal: 'never',
					},
				}}
			/>
		</div>
	);
}
