// ----- Types ----- //
// See https://github.com/guardian/support-frontend/blob/main/support-models/src/main/scala/com/gu/support/workers/CheckoutFailureReasons.scala
const errorReasons = [
	'insufficient_funds',
	'payment_details_incorrect',
	'personal_details_incorrect',
	'payment_method_temporarily_declined',
	'payment_method_unacceptable',
	'payment_provider_unavailable',
	'payment_recently_taken',
	'all_payment_methods_unavailable',
	'invalid_form_mobile',
	'marketing_consent_api_error',
	'incompatible_payment_method_and_contribution_type',
	'internal_error',
	'card_authentication_error',
	'incomplete_payment_request_details',
	'amazon_pay_try_other_card',
	'amazon_pay_try_again',
	'amazon_pay_fatal',
	'email_provider_rejected',
	'invalid_email_address',
	'recaptcha_validation_failed',
	'unknown',
] as const;
function isErrorReason(value: string): value is ErrorReason {
	return errorReasons.includes(value as ErrorReason);
}
export type ErrorReason = (typeof errorReasons)[number];

// ----- Functions ----- //
function appropriateErrorMessage(errorReason: string): string {
	if (isErrorReason(errorReason)) {
		switch (errorReason) {
			case 'insufficient_funds':
				return 'The transaction was declined due to insufficient funds in your account. Please use a different card or contact your bank.';

			case 'payment_details_incorrect':
				return 'An error occurred while trying to process your payment. Please double check your card details and try again. Alternatively, try another card or payment method.';

			case 'amazon_pay_try_again':
				return 'An error occurred while trying to process your payment. You have not been charged. Please try entering your payment details again.';

			case 'personal_details_incorrect':
				return 'Please double check the name and contact details you provided and try again.';

			case 'payment_method_temporarily_declined':
				return 'The transaction was temporarily declined. Please try entering your payment details again. Alternatively, try another payment method.';

			case 'payment_method_unacceptable':
			case 'amazon_pay_try_other_card':
				return 'The transaction was unsuccessful and you have not been charged. Please use a different card or choose another payment method.';

			case 'payment_provider_unavailable':
				return 'The transaction was unsuccessful. This does not mean there’s anything wrong with your card, and you have not been charged. Please try using an alternative payment method.';

			case 'amazon_pay_fatal':
				return 'The transaction was unsuccessful and you have not been charged. Please try using an alternative payment method.';

			case 'all_payment_methods_unavailable':
				return 'Sorry, our payment methods are unavailable at this time. We are working hard to fix the problem and hope to be back up and running soon. Please come back later to complete your contribution or consider another type of contribution from the tabs above. Thank you.';

			case 'invalid_form_mobile':
				return 'Please check the fields above and try again.';

			case 'marketing_consent_api_error':
				return 'We are unable to sign you up at this time';

			case 'internal_error':
				return 'Sorry, something has gone wrong. Please try again, or come back later.';

			case 'card_authentication_error':
				return 'You have not been charged. Please check your payment details and try again, or choose another payment method.';

			case 'incomplete_payment_request_details':
				return 'Please complete all relevant fields for your saved cards and billing addresses within your browser settings and try your payment again. Alternatively, you can use the form below.';

			case 'email_provider_rejected':
				return 'Please use an email address from a different provider';

			case 'invalid_email_address':
				return 'Please enter a valid email address';

			case 'recaptcha_validation_failed':
				return 'Please prove you are not a robot';
		}
	}
	return 'The transaction was temporarily declined. Please try entering your payment details again. Alternatively, try another payment method.';
}

// ----- Exports ----- //
export { appropriateErrorMessage };
