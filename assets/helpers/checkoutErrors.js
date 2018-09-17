// @flow

// ----- Types ----- //

// See https://github.com/guardian/support-models/blob/master/src/main/scala/com/gu/support/workers/model/CheckoutFailureReasons.scala
export type CheckoutFailureReason =
  'insufficient_funds' |
  'payment_details_incorrect' |
  'payment_method_temporarily_declined' |
  'payment_method_unacceptable' |
  'payment_provider_unavailable' |
  'payment_recently_taken' |
  'unknown';

// ----- Functions ----- //

function appropriateErrorMessage(checkoutFailureReason: ?CheckoutFailureReason): ?string {
  switch (checkoutFailureReason) {
    case 'insufficient_funds':
      return 'The transaction was declined due to insufficient funds in your account. Please use a different card or contact your bank.';
    case 'payment_details_incorrect':
      return 'An error occurred while trying to process your payment. Please double check your card details and try again. Alternatively, try another card or payment method.';
    case 'payment_method_temporarily_declined':
      return 'The transaction was temporarily declined. Please try entering your payment details again. Alternatively, try another payment method.';
    case 'payment_method_unacceptable':
      return 'The transaction was unsuccessful and you have not been charged. Please use a different card or choose another payment method.';
    case 'payment_provider_unavailable':
      return 'The transaction was unsuccessful. This does not mean there’s anything wrong with your card, and you have not been charged. Please try using an alternative payment method.';
    default:
      return 'The transaction was temporarily declined. Please try entering your payment details again. Alternatively, try another payment method.';
  }
}

// ----- Exports ----- //

export { appropriateErrorMessage };
