import { stripeCardSlice } from './reducer';

export const {
	setStripeFieldsCompleted,
	setClientSecret,
	setStripePaymentMethod,
	setStripeFormError,
} = stripeCardSlice.actions;
