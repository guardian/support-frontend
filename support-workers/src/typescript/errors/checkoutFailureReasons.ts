export const checkoutFailureReasons = [
	'insufficient_funds',
	'payment_details_incorrect',
	'payment_method_temporarily_declined',
	'payment_method_unacceptable',
	'payment_recently_taken',
	'unknown',
] as const;
export type CheckoutFailureReason = (typeof checkoutFailureReasons)[number];

export const stripeDeclineCodeMap: Record<string, CheckoutFailureReason> = {
	approve_with_id: 'payment_method_temporarily_declined',
	call_issuer: 'payment_method_unacceptable',
	card_not_supported: 'payment_method_unacceptable',
	card_velocity_exceeded: 'payment_method_unacceptable',
	currency_not_supported: 'payment_method_unacceptable',
	do_not_honor: 'payment_method_unacceptable',
	do_not_try_again: 'payment_method_unacceptable',
	duplicate_transaction: 'payment_recently_taken',
	expired_card: 'payment_method_unacceptable',
	fraudulent: 'payment_method_unacceptable',
	generic_decline: 'payment_method_unacceptable',
	incorrect_number: 'payment_details_incorrect',
	incorrect_cvc: 'payment_details_incorrect',
	incorrect_pin: 'payment_details_incorrect',
	incorrect_zip: 'payment_details_incorrect',
	insufficient_funds: 'insufficient_funds',
	invalid_account: 'payment_method_unacceptable',
	invalid_amount: 'payment_method_unacceptable',
	invalid_cvc: 'payment_details_incorrect',
	invalid_expiry_year: 'payment_details_incorrect',
	invalid_number: 'payment_details_incorrect',
	invalid_pin: 'payment_details_incorrect',
	issuer_not_available: 'payment_method_temporarily_declined',
	lost_card: 'payment_method_unacceptable',
	new_account_information_available: 'payment_method_unacceptable',
	no_action_taken: 'payment_method_unacceptable',
	not_permitted: 'payment_method_unacceptable',
	pickup_card: 'payment_method_unacceptable',
	pin_try_exceeded: 'payment_method_unacceptable',
	processing_error: 'payment_method_temporarily_declined',
	reenter_transaction: 'payment_method_temporarily_declined',
	restricted_card: 'payment_method_unacceptable',
	revocation_of_all_authorizations: 'payment_method_unacceptable',
	revocation_of_authorization: 'payment_method_unacceptable',
	security_violation: 'payment_method_unacceptable',
	service_not_allowed: 'payment_method_unacceptable',
	stolen_card: 'payment_method_unacceptable',
	stop_payment_order: 'payment_method_unacceptable',
	transaction_not_allowed: 'payment_method_unacceptable',
	try_again_later: 'payment_method_temporarily_declined',
	withdrawal_count_limit_exceeded: 'payment_method_unacceptable',
};

export function checkoutFailureReasonFromErrorMessage(
	errorMessage: string,
): CheckoutFailureReason {
	for (const [declineCode, reason] of Object.entries(stripeDeclineCodeMap)) {
		if (errorMessage.includes(declineCode)) {
			return reason;
		}
	}
	return 'unknown';
}
