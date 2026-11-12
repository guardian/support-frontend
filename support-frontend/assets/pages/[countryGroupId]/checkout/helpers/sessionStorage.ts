import { storage } from '@guardian/libs';
import { z } from 'zod';
import * as zm from 'zod/mini';
import { dateTimeSchema } from 'helpers/globalsAndSwitches/window';
import type { SourceKey } from 'helpers/landingPage/sourceConfig';
import { toSafeReturnUrl, toSourceKey } from 'helpers/landingPage/sourceConfig';
import { getSession, setSession } from 'helpers/storage/storage';

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
 * The landing page sets where the reader came from (?source=...&returnUrl=...)
 * and the thank-you page reads it. Values are validated on the way in and on
 * the way out.
 */
const sourceContextKey = 'sourceContext';
const SourceContextSchema = zm.object({
	source: zm.optional(zm.string()),
	returnUrl: zm.optional(zm.string()),
});
type SourceContext = { source?: SourceKey; returnUrl?: string };
export function setSourceContext(sourceContext: SourceContext) {
	setSession(sourceContextKey, sourceContext);
}
export function getSourceContext(): SourceContext | undefined {
	const saved = getSession(sourceContextKey, SourceContextSchema);
	if (!saved) {
		return undefined;
	}
	const source = toSourceKey(saved.source);
	const returnUrl = toSafeReturnUrl(saved.returnUrl);
	return source ?? returnUrl ? { source, returnUrl } : undefined;
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
	finalAmount: z.number().optional(),
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
