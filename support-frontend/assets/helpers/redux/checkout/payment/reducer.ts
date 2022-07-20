import { combineReducers } from 'redux';
import { amazonPayReducer } from './amazonPay/reducer';
import type { AmazonPayState } from './amazonPay/state';
import { directDebitReducer } from './directDebit/reducer';
import type { DirectDebitState } from './directDebit/state';

export type PaymentState = {
	directDebit: DirectDebitState;
	amazonPay: AmazonPayState;
};

export const paymentReducer = combineReducers({
	directDebit: directDebitReducer,
	amazonPay: amazonPayReducer,
});
