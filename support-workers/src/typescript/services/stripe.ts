import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import Stripe from 'stripe';
import { z } from 'zod';
import type { Stage } from '../model/stage';
import { awsConfig } from '../util/awsConfig';

const stripeConfigSchema = z.object({
	apiVersion: z.string(),
	accounts: z.object({
		australia: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
		}),
		unitedStates: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
		}),
		defaultAccount: z.object({
			secretKey: z.string(),
			publicKey: z.string(),
		}),
	}),
});

export const getStripeConfig = async (stage: Stage) => {
	const ssmClient = new SSMClient(awsConfig);
	const params = {
		Name: `/${stage}/support/support-workers/stripe-config`,
		WithDecryption: true,
	};
	const command = new GetParameterCommand(params);
	const response = await ssmClient.send(command);
	console.log(response.Parameter?.Value);

	return stripeConfigSchema.parse(JSON.parse(response.Parameter?.Value ?? ''));
};

const stripe = new Stripe('sk_test_...', {});

export const createCustomer = async () => {
	const params: Stripe.CustomerCreateParams = {
		description: 'test customer',
		payment_method: 'pm_card_visa',
	};

	const customer: Stripe.Customer = await stripe.customers.create(params);

	console.log(customer.id);
};
