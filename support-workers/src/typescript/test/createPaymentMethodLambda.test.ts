import { BillingPeriod } from '@modules/product/billingPeriod';
import { handler } from '../lambdas/createPaymentMethodLambda';
import type { CreatePaymentMethodState } from '../model/stateSchemas';
import { createPaymentMethodStateSchema } from '../model/stateSchemas';
import createPaymentDirectDebitPaper from './fixtures/createPaymentMethod/paperDirectDebit.json';

const wrapPayload = (payload: CreatePaymentMethodState) => ({
	state: payload,
	error: null,
	requestInfo: {
		testUser: false,
		failed: false,
		messages: [],
		accountExists: true,
	},
});

describe('handler', () => {
	describe('Direct Debit', () => {
		it('uses the GoCardless payment gateway for a non-Sunday newspaper subscription', async () => {
			const payload: CreatePaymentMethodState =
				createPaymentMethodStateSchema.parse(createPaymentDirectDebitPaper);
			payload.product = {
				productType: 'Paper',
				currency: 'GBP',
				billingPeriod: BillingPeriod.Monthly,
				fulfilmentOptions: 'HomeDelivery',
				productOptions: 'Everyday',
			};

			const result = await handler(wrapPayload(payload));

			expect(result.state.paymentMethod.PaymentGateway).toBe('GoCardless');
		});

		it('uses the Tortoise payment gateway for a Sunday newspaper subscription', async () => {
			const payload: CreatePaymentMethodState =
				createPaymentMethodStateSchema.parse(createPaymentDirectDebitPaper);
			payload.product = {
				productType: 'Paper',
				currency: 'GBP',
				billingPeriod: BillingPeriod.Monthly,
				fulfilmentOptions: 'HomeDelivery',
				productOptions: 'Sunday',
			};

			const result = await handler(wrapPayload(payload));

			expect(result.state.paymentMethod.PaymentGateway).toBe(
				'GoCardless - Observer - Tortoise Media',
			);
		});
	});
});
