import { combineReducers } from 'redux';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { amazonPayReducer } from './amazonPay/reducer';
import type { AmazonPayState } from './amazonPay/state';
import { directDebitReducer } from './directDebit/reducer';
import type { DirectDebitState } from './directDebit/state';
import { paymentMethodReducer } from './paymentMethod/reducer';
import { paymentRequestButtonReducer } from './paymentRequestButton/reducer';
import type { PaymentRequestButtonState } from './paymentRequestButton/state';
import { payPalReducer } from './payPal/reducer';
import type { PayPalState } from './payPal/state';
import { sepaReducer } from './sepa/reducer';
import type { SepaState } from './sepa/state';
import { stripeCardReducer } from './stripe/reducer';
import type { StripeCardState } from './stripe/state';

export type PaymentState = {
	paymentMethod: PaymentMethod;
	directDebit: DirectDebitState;
	amazonPay: AmazonPayState;
	sepa: SepaState;
	payPal: PayPalState;
	stripe: StripeCardState;
	paymentRequestButton: PaymentRequestButtonState;
};

export const paymentReducer = combineReducers({
	paymentMethod: paymentMethodReducer,
	directDebit: directDebitReducer,
	amazonPay: amazonPayReducer,
	sepa: sepaReducer,
	payPal: payPalReducer,
	stripe: stripeCardReducer,
	paymentRequestButton: paymentRequestButtonReducer,
});
