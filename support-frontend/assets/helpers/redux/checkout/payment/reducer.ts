import { combineReducers } from 'redux';
import { directDebitReducer } from './directDebit/reducer';
import type { DirectDebitState } from './directDebit/state';

export type PaymentState = {
	directDebit: DirectDebitState;
};

export const paymentReducer = combineReducers({
	directDebit: directDebitReducer,
});
