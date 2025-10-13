import { storage } from '@guardian/libs';
import { z } from 'zod';
import { dateTimeSchema } from 'helpers/globalsAndSwitches/window';

/**
 * The Guardian Ad-Lite Landing Page sets the returnLink in sessionStorage
 * And the thank-you page reads it.
 */
const returnAddressKey = 'returnAddress';
const ReturnAddressSchema = z.object({
	link: z.string(),
});
type ReturnAddressSchemaType = z.infer<typeof ReturnAddressSchema>;
export function setReturnAddress(link: ReturnAddressSchemaType) {
	storage.session.set(returnAddressKey, link);
}
export function getReturnAddress(): string {
	const parsedReturnAddress = ReturnAddressSchema.safeParse(
		storage.session.get(returnAddressKey),
	);
	return parsedReturnAddress.success
		? parsedReturnAddress.data.link
		: 'https://www.theguardian.com';
}

/**
 * The checkout page sets the order in sessionStorage
 * And the thank-you page reads it.
 */
const orderKey = 'thankYouOrder';
const OrderSchema = z.object({
	firstName: z.string(),
	email: z.string(),
	paymentMethod: z.enum([
		'Stripe',
		'StripeExpressCheckoutElement',
		'StripeHostedCheckout',
		'PayPal',
		'DirectDebit',
		'Sepa',
		'None',
	]),
	status: z.enum(['success', 'pending']),
	deliveryDate: dateTimeSchema.optional(),
});
type OrderSchemaType = z.infer<typeof OrderSchema>;
export function setThankYouOrder(order: OrderSchemaType) {
	storage.session.set(orderKey, order);
}
export function getThankYouOrder(): OrderSchemaType | undefined {
	const parsedOrder = OrderSchema.safeParse(storage.session.get(orderKey));
	return parsedOrder.success ? parsedOrder.data : undefined;
}
