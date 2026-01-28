/**
 * @group integration
 */

import { zuoraDateFormat } from '@modules/zuora/utils/common';
import dayjs from 'dayjs';
import { RetryError, RetryErrorType } from '../errors/retryError';
import { handler } from '../lambdas/createZuoraSubscriptionTSLambda';
import { createZuoraSubscriptionStateSchema } from '../model/createZuoraSubscriptionState';
import { wrapperSchemaForState } from '../model/stateSchemas';
import digitalSubscriptionJson from './fixtures/createZuoraSubscription/digitalSubscriptionInput.json';
import guardianWeeklyJson from './fixtures/createZuoraSubscription/guardianWeeklyInput.json';
import paperJson from './fixtures/createZuoraSubscription/paperInput.json';
import transactionDeclinedJson from './fixtures/createZuoraSubscription/transactionDeclinedInput.json';

const testTimeout = 20000;

describe('createZuoraSubscriptionLambda integration', () => {
	test(
		'we handle a transaction declined error from Stripe appropriately',
		async () => {
			try {
				await handler(
					wrapperSchemaForState(createZuoraSubscriptionStateSchema).parse(
						transactionDeclinedJson,
					),
				);
				fail('Expected handler to throw');
			} catch (error) {
				if (error instanceof RetryError) {
					expect(error.name).toBe(RetryErrorType.RetryNone);
					expect(error.message).toContain('Transaction declined');
				} else {
					fail('Error is not an instance of RetryError');
				}
			}
		},
		testTimeout,
	);
	test(
		'we encode dates correctly in the output',
		async () => {
			const input = wrapperSchemaForState(
				createZuoraSubscriptionStateSchema,
			).parse(guardianWeeklyJson);
			input.state.requestId = new Date().getTime().toString(); // Ensure unique requestId because it is used as an idempotency key
			const firstDeliveryDate = dayjs().add(5, 'day').toDate();
			if (
				input.state.productSpecificState.productInformation?.product ===
				'GuardianWeeklyDomestic'
			) {
				input.state.productSpecificState.productInformation.firstDeliveryDate =
					firstDeliveryDate;
			}

			const output = await handler(input);
			if (
				output.state.sendThankYouEmailState.productType !== 'GuardianWeekly'
			) {
				fail('Expected productType to be GuardianWeekly');
			}
			expect(output.state.sendThankYouEmailState.firstDeliveryDate).toBe(
				zuoraDateFormat(dayjs(firstDeliveryDate)),
			);
		},
		testTimeout,
	);
	test(
		'we return the correct output for a digital subscription',
		async () => {
			const input = wrapperSchemaForState(
				createZuoraSubscriptionStateSchema,
			).parse(digitalSubscriptionJson);
			input.state.requestId = new Date().getTime().toString(); // Ensure unique requestId because it is used as an idempotency key
			const output = await handler(input);
			if (
				output.state.sendThankYouEmailState.productType !==
				'DigitalSubscription'
			) {
				fail('Expected productType to be DigitalSubscription');
			}
			expect(
				output.state.sendThankYouEmailState.paymentSchedule.payments.length,
			).toBeGreaterThan(0);
		},
		testTimeout,
	);
	test(
		'we get the correct payment schedule for a newspaper subscription',
		async () => {
			const input = wrapperSchemaForState(
				createZuoraSubscriptionStateSchema,
			).parse(paperJson);
			input.state.requestId = new Date().getTime().toString(); // Ensure unique requestId because it is used as an idempotency key
			const firstDeliveryDate = dayjs().add(5, 'day').toDate();
			if (
				input.state.productSpecificState.productInformation?.product ===
				'SubscriptionCard'
			) {
				input.state.productSpecificState.productInformation.firstDeliveryDate =
					firstDeliveryDate;
			}
			const output = await handler(input);
			if (output.state.sendThankYouEmailState.productType !== 'Paper') {
				fail('Expected productType to be Paper');
			}
			const payments =
				output.state.sendThankYouEmailState.paymentSchedule.payments;
			expect(payments.length).toBe(13); // We preview 13 months of payments to allow for annual subs to have a second invoice
			expect(payments[0]?.amount).toEqual(payments[11]?.amount); // Check that all payments are the same amount
		},
		testTimeout,
	);
});
