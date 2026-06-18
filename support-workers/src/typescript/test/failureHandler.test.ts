import type { CheckoutFailureReason } from '../errors/checkoutFailureReasons';
import { checkoutFailureReasonFromErrorMessage } from '../errors/checkoutFailureReasons';
import { errorFromStateSchema } from '../errors/errorFromStateSchema';
import type { FailureHandlerState } from '../model/failureHandlerState';
import { failureHandlerStateSchema } from '../model/failureHandlerState';
import type { WrappedState } from '../model/stateSchemas';
import { wrapperSchemaForState } from '../model/stateSchemas';
import callIssuerError from './fixtures/failureHandler/callIssuerError.json';
import doNotHonorError from './fixtures/failureHandler/doNotHonorError.json';
import insufficientFundsError from './fixtures/failureHandler/insufficientFundsError.json';
import stripeUsedTokenError from './fixtures/failureHandler/stripeUsedTokenError.json';

function testWithJson(
	json: unknown,
	errorMessage: string,
	checkoutFailureReason: CheckoutFailureReason,
) {
	const state: WrappedState<FailureHandlerState> = wrapperSchemaForState(
		failureHandlerStateSchema,
	).parse(json);
	const cause = errorFromStateSchema.parse(
		JSON.parse(state.error?.Cause ?? ''),
	);
	expect(cause.errorMessage).toEqual(errorMessage);
	expect(checkoutFailureReasonFromErrorMessage(cause.errorMessage)).toEqual(
		checkoutFailureReason,
	);
}

describe('FailureHandlerLambda parsing', () => {
	test('payment method has already been attached error', () => {
		testWithJson(
			stripeUsedTokenError,
			'The payment method you provided has already been attached to a customer.',
			'unknown',
		);
	});
	test('call_issuer error', () => {
		testWithJson(
			callIssuerError,
			'Transaction declined.402 - [card_error/card_declined/call_issuer] Your card was declined. You can call your bank for details.',
			'payment_method_unacceptable',
		);
	});
	test('do_not_honor error', () => {
		testWithJson(
			doNotHonorError,
			'Transaction declined.402 - [card_error/card_declined/do_not_honor] Your card was declined.',
			'payment_method_unacceptable',
		);
	});
	test('insufficient_funds error', () => {
		testWithJson(
			insufficientFundsError,
			'Transaction declined.402 - [card_error/card_declined/insufficient_funds] Your card has insufficient funds.',
			'insufficient_funds',
		);
	});
});
