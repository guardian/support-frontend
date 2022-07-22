import { combineReducers } from 'redux';
import { amazonPayReducer } from './amazonPay/reducer';
import type { AmazonPayState } from './amazonPay/state';
import { directDebitReducer } from './directDebit/reducer';
import type { DirectDebitState } from './directDebit/state';
import { sepaReducer } from './sepa/reducer';
import type { SepaState } from './sepa/state';

export type PaymentState = {
	directDebit: DirectDebitState;
	amazonPay: AmazonPayState;
	sepa: SepaState;
};

export const paymentReducer = combineReducers({
	directDebit: directDebitReducer,
	amazonPay: amazonPayReducer,
	sepa: sepaReducer,
});
