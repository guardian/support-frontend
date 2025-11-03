import type { ZuoraError } from '@guardian/support-service-lambdas/modules/zuora/src/errors/zuoraError';
import { retryLimited, retryNone } from './retryError';

const transactionDeclinedMessages = [
	'Transaction declined.402 - [card_error/card_declined/invalid_account] Invalid account.',
	'Transaction declined.402 - [card_error/card_declined/do_not_honor] Your card was declined.',
	'Transaction declined.402 - [card_error/card_declined/insufficient_funds] Your card has insufficient funds.',
	'Transaction declined.402 - [card_error/card_declined/try_again_later] Your card was declined.',
	'Transaction declined.402 - [card_error/card_declined/transaction_not_allowed] Your card does not support this type of purchase.',
	'Transaction declined.402 - [card_error/card_declined/pickup_card] Your card was declined.',
	'Transaction declined.402 - [card_error/card_declined/generic_decline] Your card was declined.',
	"Transaction declined.402 - [card_error/incorrect_cvc/incorrect_cvc] Your card's security code is incorrect.",
	'Transaction declined.402 - [card_error/incorrect_number/incorrect_number] Your card number is incorrect.',
	'Transaction declined.402 - [card_error/card_declined/card_velocity_exceeded] Your card was declined for making repeated attempts too frequently or exceeding its amount limit.',
	'Transaction declined.402 - [card_error/card_declined/revocation_of_authorization] Your card was declined.',
	'Transaction declined.402 - [card_error/card_declined/revocation_of_all_authorizations] Your card was declined.',
	'Transaction declined.402 - [card_error/authentication_required/authentication_required] Your card was declined. This transaction requires authentication.',
	'Transaction declined.402 - [card_error/card_declined/fraudulent] Your card was declined.',
	'Transaction declined.402 - [card_error/expired_card/expired_card] Your card has expired.',
	'Transaction declined.402 - [card_error/processing_error/processing_error] An error occurred while processing your card. Try again in a little bit.',
	'Transaction declined.10417 - Instruct the customer to retry the transaction using an alternative payment method from the customers PayPal wallet.',
	'Error occurred while processing payment method.code=validation_failed,message=account_number did not pass modulus check',
	'Error occurred while processing payment method.code=validation_failed,message=account_number is the wrong length (should be 8 characters)',
	'Error occurred while processing payment method.code=validation_failed,message=account_number does not match sort code',

	// This list should be kept in sync with the list in src/main/scala/com/gu/support/workers/exceptions/CardDeclinedMessages.scala
];

const isTransactionDeclinedError = (error: ZuoraError) =>
	transactionDeclinedMessages.includes(error.message);

export function mapZuoraError(error: ZuoraError) {
	if (isTransactionDeclinedError(error)) {
		return retryNone(error.message);
	}
	return retryLimited(`${error.message}`);
}
