import { storage } from '@guardian/libs';
import { type InferInput, object, picklist, safeParse, string } from 'valibot';

/**
 * The Guardian Ad-Lite Landing Page sets the returnLink in sessionStorage
 * And the thank-you page reads it.
 */
export const ReturnAddressSchema = object({
	link: string(),
});
export function setReturnAddress(link: InferInput<typeof ReturnAddressSchema>) {
	storage.session.set('returnAddress', link);
}
export function getReturnAddress() {
	const sessionStorageReturnAddress = storage.session.get('returnAddress');
	const parsedReturnAddress = safeParse(
		ReturnAddressSchema,
		sessionStorageReturnAddress,
	);
	return parsedReturnAddress.success
		? parsedReturnAddress.output.link
		: 'https://www.theguardian.com';
}

/**
 * The checkout page sets the order in sessionStorage
 * And the thank-you page reads it.
 */
export const OrderSchema = object({
	firstName: string(),
	email: string(),
	paymentMethod: picklist([
		'Stripe',
		'StripeExpressCheckoutElement',
		'PayPal',
		'DirectDebit',
		'Sepa',
		'None',
	]),
	status: picklist(['success', 'pending']),
});
export function setThankYouOrder(order: InferInput<typeof OrderSchema>) {
	storage.session.set('thankYouOrder', order);
}
export function getThankYouOrder() {
	const sessionStorageOrder = storage.session.get('thankYouOrder');
	const parsedOrder = safeParse(OrderSchema, sessionStorageOrder);
	if (parsedOrder.success) {
		return parsedOrder.output;
	} else {
		return undefined;
	}
}

export function unsetThankYouOrder() {
	storage.session.remove('thankYouOrder');
}
