// ----- Imports ----- //
import type { ErrorReason } from 'helpers/forms/errorReasons';

export type Action =
	| {
			type: 'PAYMENT_FAILURE';
			paymentError: ErrorReason;
	  }
	| {
			type: 'PAYMENT_WAITING';
			isWaiting: boolean;
	  }
	| {
			type: 'PAYMENT_SUCCESS';
	  };

const paymentWaiting = (isWaiting: boolean): Action => ({
	type: 'PAYMENT_WAITING',
	isWaiting,
});

const paymentFailure = (paymentError: ErrorReason): Action => ({
	type: 'PAYMENT_FAILURE',
	paymentError,
});

export { paymentFailure, paymentWaiting };
