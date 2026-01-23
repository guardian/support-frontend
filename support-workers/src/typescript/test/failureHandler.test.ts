import { errorFromStateSchema } from '../errors/errorFromStateSchema';
import type { FailureHandlerState } from '../model/failureHandlerState';
import { failureHandlerStateSchema } from '../model/failureHandlerState';
import type { WrappedState } from '../model/stateSchemas';
import { wrapperSchemaForState } from '../model/stateSchemas';
import stripeUsedTokenError from './fixtures/failureHandler/stripeUsedTokenError.json';
import transactionDeclinedError from './fixtures/failureHandler/transactionDeclinedError.json';

test('parsing works ok', () => {
	const state: WrappedState<FailureHandlerState> = wrapperSchemaForState(
		failureHandlerStateSchema,
	).parse(stripeUsedTokenError);
	const cause = errorFromStateSchema.parse(
		JSON.parse(state.error?.Cause ?? ''),
	);
	expect(cause.errorMessage).toEqual(
		'The payment method you provided has already been attached to a customer.',
	);
});
test('parsing works ok 2', () => {
	const state: WrappedState<FailureHandlerState> = wrapperSchemaForState(
		failureHandlerStateSchema,
	).parse(transactionDeclinedError);
	const cause = errorFromStateSchema.parse(
		JSON.parse(state.error?.Cause ?? ''),
	);
	expect(cause.errorMessage).toEqual(
		'Transaction declined.402 - [card_error/card_declined/call_issuer] Your card was declined. You can call your bank for details.',
	);
});
