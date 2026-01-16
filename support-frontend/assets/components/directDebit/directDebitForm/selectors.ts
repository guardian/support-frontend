import type { DirectDebitState } from 'helpers/redux/checkout/payment/directDebit/state';

export type DirectDebitFormDisplayErrors = DirectDebitState['errors'] & {
	recaptcha?: string[];
};
