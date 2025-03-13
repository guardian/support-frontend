import { stripeCreateCheckoutSession } from '../checkout/helpers/stripe';

export const submitStripeCheckoutSession = async () => {
	const checkoutSession = await stripeCreateCheckoutSession();
	return checkoutSession;
};
