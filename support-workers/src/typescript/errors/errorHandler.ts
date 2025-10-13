import type { ZuoraError } from '@modules/zuora/errors/zuoraError';
import Stripe from 'stripe';
import { SalesforceError, salesforceErrorCodes } from '../services/salesforce';
import { retryLimited, retryNone, retryUnlimited } from './retryError';
import { mapZuoraError } from './zuoraErrors';

function isZuoraError(error: unknown): error is ZuoraError {
	return error instanceof Error && error.name === 'ZuoraError';
}

export const asRetryError = (error: unknown) => {
	if (error instanceof Stripe.errors.StripeError) {
		console.log('Mapping StripeError:', error);
		return mapStripeError(error);
	}
	if (error instanceof SalesforceError) {
		console.log('Mapping SalesforceError:', error);
		return mapSalesforceError(error);
	}
	if (isZuoraError(error)) {
		console.log('Mapping ZuoraError:', error);
		return mapZuoraError(error);
	}
	if (error instanceof Error) {
		console.log('Generic Error:', error);
		return retryLimited(error.message);
	}
	console.log('Unknown error type:', error);
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
