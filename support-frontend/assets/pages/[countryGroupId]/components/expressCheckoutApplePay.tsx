import { css } from '@emotion/react';
import {
	ExpressCheckoutElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { isCaState } from 'helpers/salesTax/getEstimatedSalesTaxConfig';
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
	/**
	 * Called when the user selects an address in the payment sheet, with the
	 * state/province from that address. Should return the estimated tax, in
	 * major currency units, or undefined if tax can't be estimated for it.
	 */
	getEstimatedTaxForState: (state: string) => number | undefined;
	/** Called once the user has authorised the payment in the Apple Pay sheet */
	onConfirmed: (event: StripeExpressCheckoutElementConfirmEvent) => void;
	setErrorMessage: (message: string) => void;
};

export function ExpressCheckoutApplePay({
	selected,
	amountExcludingTax,
	estimatedTaxAmount,
	taxExclusive,
	formRef,
	setApplePayIsAvailable,
	getEstimatedTaxForState,
	onConfirmed,
	setErrorMessage,
}: ExpressCheckoutApplePayProps) {
	const stripe = useStripe();
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

					// We collect the customer's details in the form, but we also ask
					// for them in the payment sheet so that the details authorised by
					// the customer are the ones we submit.
					const options: NonNullable<Parameters<typeof resolve>[0]> = {
						emailRequired: true,
					};

					if (taxExclusive) {
						/**
						 * Request an address inside the payment sheet so that we can
						 * recalculate tax via onShippingAddressChange if the customer
						 * picks a different address to the one entered in the form.
						 * shippingRates is required by Stripe whenever
						 * shippingAddressRequired is true.
						 */
						options.shippingAddressRequired = true;
						options.shippingRates = [
							{ id: 'free', displayName: 'Free', amount: 0 },
						];
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
				onShippingAddressChange={({ address, resolve, reject }) => {
					/**
					 * The "shipping" address is being used here as a proxy for billing
					 * address, solely to obtain the Canadian province before
					 * confirmation so that we can calculate the tax and update the
					 * payment total in real time.
					 */
					try {
						// Currently this will only work for Canada because of a
						// similar check in getEstimatedSalesTaxConfig
						if (!isCaState(address.state)) {
							return;
						}

						const taxAmount = getEstimatedTaxForState(address.state);

						if (taxAmount === undefined) {
							return;
						}

						// Update the Elements amount so the sheet total reflects tax
						void elements?.update({
							amount: Math.round((amountExcludingTax + taxAmount) * 100),
						});

						resolve({
							// Now that we have a tax amount we can
							// show the correct pricing information
							lineItems: [
								{
									name: 'Subtotal (excl. tax)',
									amount: Math.round(amountExcludingTax * 100),
								},
								{
									name: 'Estimated tax',
									amount: Math.round(taxAmount * 100),
								},
							],
						});
					} catch {
						reject();
					}
				}}
				onConfirm={async (event) => {
					if (!(stripe && elements)) {
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

					onConfirmed(event);
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
