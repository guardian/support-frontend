import { storage } from '@guardian/libs';
import { z } from 'zod';
import { dateTimeSchema } from 'helpers/globalsAndSwitches/window';
import type { SourceKey } from 'helpers/landingPage/sourceConfig';
import {
	toSafeReturnPath,
	toSourceKey,
} from 'helpers/landingPage/sourceConfig';

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
 * The landing page sets where the reader came from (?source=...&returnTo=...)
 * and the thank-you page reads it. Values are validated on the way in and on
 * the way out.
 */
const sourceContextKey = 'sourceContext';
const SourceContextSchema = z.object({
	source: z.string().optional(),
	returnTo: z.string().optional(),
});
type SourceContext = { source?: SourceKey; returnTo?: string };
export function setSourceContext(sourceContext: SourceContext) {
	storage.session.set(sourceContextKey, sourceContext);
}
export function getSourceContext(): SourceContext | undefined {
	const parsed = SourceContextSchema.safeParse(
		storage.session.get(sourceContextKey),
	);
	if (!parsed.success) {
		return undefined;
	}
	const source = toSourceKey(parsed.data.source);
	const returnTo = toSafeReturnPath(parsed.data.returnTo);
	return source ?? returnTo ? { source, returnTo } : undefined;
}
export function clearSourceContext() {
	storage.session.remove(sourceContextKey);
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
