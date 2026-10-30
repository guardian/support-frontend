import { ZuoraError } from '@modules/zuora/errors';
import { RetryErrorType } from '../errors/retryError';
import {
	isTransactionDeclinedError,
	mapZuoraError,
} from '../errors/transactionDeclinedErrors';

describe('isTransactionDeclinedError', () => {
	it('returns true if the message is an exact match for one in the list of decline messages', () => {
		const errorMessage =
			'The payment method you provided has already been attached to a customer.';

		const result = isTransactionDeclinedError(errorMessage);

		expect(result).toBe(true);
	});

	it('returns false if the message does not match any of the list of decline messages', () => {
		const errorMessage = 'We have no idea what happened';

		const result = isTransactionDeclinedError(errorMessage);

		expect(result).toBe(false);
	});

	it('returns true if the message is prefixed by one of the list of decline messages', () => {
		const errorMessage =
			'Transaction declined.402 - [card_error/card_declined/insufficient_funds] Your card has insufficient funds. Use a different payment method to complete this purchase.';

		const result = isTransactionDeclinedError(errorMessage);

		expect(result).toBe(true);
	});
});

describe('mapZuoraError', () => {
	it('returns a RetryNone error if the message is prefixed by one of the list of decline messages', () => {
		const errorMessage =
			'Transaction declined.402 - [card_error/card_declined/insufficient_funds] Your card has insufficient funds. Use a different payment method to complete this purchase.';
		const zuoraError = new ZuoraError(
			errorMessage,
			{ status: 402, responseBody: '', responseHeaders: {} },
			[],
		);

		const result = mapZuoraError(zuoraError);

		expect(result.name).toBe(RetryErrorType.RetryNone);
		expect(result.message).toBe(errorMessage);
	});

	it('returns a RetryNone error is the message is an exact match for one of the list of decline messages', () => {
		const errorMessage =
			'Transaction declined.10417 - Instruct the customer to retry the transaction using an alternative payment method from the customers PayPal wallet.';

		const zuoraError = new ZuoraError(
			errorMessage,
			{ status: 100, responseBody: '', responseHeaders: {} },
			[],
		);

		const result = mapZuoraError(zuoraError);

		expect(result.name).toBe(RetryErrorType.RetryNone);
		expect(result.message).toBe(errorMessage);
	});

	it('returns a RetryLimited error if the message is not prefixed by one of the list of decline messages', () => {
		const errorMessage = 'Something totally unexpected happened!';
		const zuoraError = new ZuoraError(
			errorMessage,
			{ status: 500, responseBody: '', responseHeaders: {} },
			[],
		);

		const result = mapZuoraError(zuoraError);

		expect(result.name).toBe(RetryErrorType.RetryLimited);
		expect(result.message).toBe(errorMessage);
	});
});
