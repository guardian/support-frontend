import Stripe from 'stripe';
import { z } from 'zod';
import type { StripePaymentGateway } from '../model/paymentMethod';
import { stripePaymentGatewaySchema } from '../model/paymentMethod';
import type { Stage } from '../model/stage';
import { getIfDefined } from '../util/nullAndUndefined';
import { getConfig } from './config';

const stripeConfigSchema = z.object({
	accounts: z.object({
		australia: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
			paymentGateway: stripePaymentGatewaySchema,
		}),
		unitedStates: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
			paymentGateway: stripePaymentGatewaySchema,
		}),
		defaultAccount: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
			paymentGateway: stripePaymentGatewaySchema,
		}),
		tortoiseMediaAccount: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
			paymentGateway: stripePaymentGatewaySchema,
		}),
	}),
});
type StripeConfig = z.infer<typeof stripeConfigSchema>;

export const getStripeConfig = async (stage: Stage): Promise<StripeConfig> => {
	return getConfig(stage, 'stripe-config', stripeConfigSchema);
};

export class StripeService {
	stripeAccountForPublicKey: Record<
		string,
		{ paymentGateway: StripePaymentGateway; stripe: Stripe }
	>;
	constructor(config: StripeConfig) {
		this.stripeAccountForPublicKey = Object.fromEntries(
			Object.entries(config.accounts).map(([, account]) => [
				account.publicKey,
				{
					paymentGateway: account.paymentGateway,
					stripe: new Stripe(account.secretKey),
				},
			]),
		);
	}
	private stripeForPublicKey(publicKey: string) {
		const stripe = getIfDefined(
			this.stripeAccountForPublicKey[publicKey],
			`No Stripe client found for public key ${publicKey}`,
		);
		return stripe.stripe;
	}

	getPaymentGateway(publicKey: string) {
		const stripe = getIfDefined(
			this.stripeAccountForPublicKey[publicKey],
			`No Stripe client found for public key ${publicKey}`,
		);
		return stripe.paymentGateway;
	}

	createCustomer = async (publicKey: string, paymentMethodId: string) => {
		const stripe = this.stripeForPublicKey(publicKey);
		const params: Stripe.CustomerCreateParams = {
			payment_method: paymentMethodId,
		};

		const customer: Stripe.Customer = await stripe.customers.create(params);
		console.log(`Created Stripe customer with id ${customer.id}`);
		return customer;
	};

	retrievePaymentMethodIdFromCheckoutSession = async (
		publicKey: string,
		checkoutSessionId: string,
	) => {
		const stripe = this.stripeForPublicKey(publicKey);
		const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
			expand: ['setup_intent.payment_method'],
		});
		const setupIntent = session.setup_intent;
		if (setupIntent) {
			const paymentMethod = (setupIntent as Stripe.SetupIntent)
				.payment_method as Stripe.PaymentMethod;
			return paymentMethod.id;
		}
		return;
	};

	getPaymentMethod = async (publicKey: string, paymentMethodId: string) => {
		const stripe = this.stripeForPublicKey(publicKey);
		const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
		return paymentMethod;
	};
}
