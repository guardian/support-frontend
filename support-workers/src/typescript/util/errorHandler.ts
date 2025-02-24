import Stripe from 'stripe';

class RetryError extends Error {
	constructor(errorType: string, message: string) {
		super(message);
		this.name = errorType; // This is what the step function retry policy uses
	}
}

const retryNone = (message: string) => new RetryError('RetryNone', message);

const retryLimited = (message: string) =>
	new RetryError('RetryLimited', message);

const retryUnlimited = (message: string) =>
	new RetryError('RetryUnlimited', message);

export const asRetryError = (error: unknown) => {
	if (error instanceof Stripe.errors.StripeError) {
		return mapStripeError(error);
	}
	if (error instanceof Error) {
		return retryLimited(error.message);
	}
	return retryLimited(`Unknown error type: ${JSON.stringify(error)}`);
};

function mapStripeError(error: Stripe.errors.StripeError) {
	switch (error.type) {
		// These errors are transient and should be retried
		case 'StripeConnectionError':
		case 'StripeAPIError':
		case 'StripeRateLimitError':
			return retryUnlimited(error.message);
		// These errors are fatal and should not be retried
		case 'StripeCardError':
		case 'StripeInvalidRequestError':
			return retryNone(error.message);
		// Not so sure about these ones, let's retry a couple of times
		case 'StripeAuthenticationError':
		case 'StripeError':
		default:
			return retryLimited(error.message);
	}
}
