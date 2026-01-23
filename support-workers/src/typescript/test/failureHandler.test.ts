import type { RetryError } from '../errors/retryError';
import type { FailureHandlerState } from '../model/failureHandlerState';
import { failureHandlerStateSchema } from '../model/failureHandlerState';
import type { WrappedState } from '../model/stateSchemas';
import { wrapperSchemaForState } from '../model/stateSchemas';
import stripeUsedTokenError from './fixtures/failureHandler/stripeUsedTokenError.json';

test('parsing works ok', () => {
	const state: WrappedState<FailureHandlerState> = wrapperSchemaForState(
		failureHandlerStateSchema,
	).parse(stripeUsedTokenError);
	const cause = JSON.parse(state.error?.Cause ?? '{}') as RetryError;
	expect(cause).toContain('The provided token has already been used');
});
