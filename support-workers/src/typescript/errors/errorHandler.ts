import { ZuoraError } from '@modules/zuora/errors/zuoraError';
import Stripe from 'stripe';
import { SalesforceError, salesforceErrorCodes } from '../services/salesforce';
import { retryLimited, retryNone, retryUnlimited } from './retryError';
import { mapZuoraError } from './zuoraErrors';

export const asRetryError = (error: unknown) => {
	if (error instanceof Stripe.errors.StripeError) {
		return mapStripeError(error);
	}
	if (error instanceof SalesforceError) {
		return mapSalesforceError(error);
	}
	if (error instanceof ZuoraError) {
		return mapZuoraError(error);
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

function mapSalesforceError(error: SalesforceError) {
	if (Object.values(salesforceErrorCodes).includes(error.name)) {
		return retryUnlimited(error.message);
	}
	return retryNone(error.message);
}
