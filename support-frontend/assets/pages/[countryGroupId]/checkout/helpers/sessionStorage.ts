import { storage } from '@guardian/libs';
import { z } from 'zod';
import { dateTimeSchema } from 'helpers/globalsAndSwitches/window';
import type { ReturnLabelKey } from './returnTo';
import { toReturnLabelKey, toSafeReturnPath } from './returnTo';

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
 * The landing page sets where to send the reader after the purchase
 * (?returnPath=...&returnLabel=...) and the thank-you page reads it.
 * Values are validated on the way in and on the way out.
 */
const returnToKey = 'returnTo';
const ReturnToSchema = z.object({
	path: z.string(),
	label: z.string().optional(),
});
type ReturnTo = { path: string; label?: ReturnLabelKey };
export function setReturnTo(returnTo: ReturnTo) {
	storage.session.set(returnToKey, returnTo);
}
export function getReturnTo(): ReturnTo | undefined {
	const parsed = ReturnToSchema.safeParse(storage.session.get(returnToKey));
	const path = parsed.success ? toSafeReturnPath(parsed.data.path) : undefined;
	return parsed.success && path
		? { path, label: toReturnLabelKey(parsed.data.label) }
		: undefined;
}
export function clearReturnTo() {
	storage.session.remove(returnToKey);
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
		'PayPalCompletePayments',
		'DirectDebit',
		'None',
	]),
	status: z.enum(['success', 'pending']),
	deliveryDate: dateTimeSchema.optional(),
	accountNumber: z.string().optional(),
	taxConfig: z
		.union([
			z.object({
				type: z.literal('tax_exclusive'),
				rate: z.number(),
			}),
			z.object({
				type: z.literal('tax_inclusive'),
			}),
			z.object({
				type: z.literal('not_enough_information'),
			}),
		])
		.optional(),
});
type OrderSchemaType = z.infer<typeof OrderSchema>;
export function setThankYouOrder(order: OrderSchemaType) {
	storage.session.set(orderKey, order);
}
export function getThankYouOrder(): OrderSchemaType | undefined {
	const parsedOrder = OrderSchema.safeParse(storage.session.get(orderKey));
	return parsedOrder.success ? parsedOrder.data : undefined;
}
