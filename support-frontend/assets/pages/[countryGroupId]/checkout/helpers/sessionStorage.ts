import { storage } from '@guardian/libs';
import type { InferInput } from 'valibot';
import { is, object, picklist, safeParse, string } from 'valibot';

function fromSessionStorage(
	key: string,
	schema: typeof OrderSchema | typeof ReturnAddressSchema,
) {
	const sessionStorage = storage.session.get(key);
	const parsed = safeParse(schema, sessionStorage);
	return parsed.success ? parsed.output : undefined;
}

/**
 * The Guardian Ad-Lite Landing Page sets the returnLink in sessionStorage
 * And the thank-you page reads it.
 */
const returnAddressKey = 'returnAddress';
const ReturnAddressSchema = object({
	link: string(),
});
type ReturnAddressSchemaType = InferInput<typeof ReturnAddressSchema>;
export function setReturnAddress(link: ReturnAddressSchemaType) {
	storage.session.set(returnAddressKey, link);
}
export function getReturnAddress(): string {
	const parsedReturnAddress = fromSessionStorage(
		returnAddressKey,
		ReturnAddressSchema,
	);
	return is(ReturnAddressSchema, parsedReturnAddress)
		? parsedReturnAddress.link
		: 'https://www.theguardian.com';
}

/**
 * The checkout page sets the order in sessionStorage
 * And the thank-you page reads it.
 */
const orderKey = 'thankYouOrder';
const OrderSchema = object({
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
type OrderSchemaType = InferInput<typeof OrderSchema>;
export function setThankYouOrder(order: OrderSchemaType) {
	storage.session.set(orderKey, order);
}
export function getThankYouOrder(): OrderSchemaType | undefined {
	const parsedOrder = fromSessionStorage(orderKey, OrderSchema);
	return is(OrderSchema, parsedOrder) ? parsedOrder : undefined;
}
export function unsetThankYouOrder() {
	storage.session.remove(orderKey);
}
