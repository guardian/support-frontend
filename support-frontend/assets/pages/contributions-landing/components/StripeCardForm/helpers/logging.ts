import type { StripeError } from '@stripe/stripe-js';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';

export function logCreateSetupIntentError(err: Error): void {
	logException(
		`Error getting Setup Intent client_secret from ${routes.stripeSetupIntentRecaptcha}: ${err.message}`,
	);
}

export function logCreatePaymentMethodError(errorData: StripeError): void {
	logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);
}
