import { stripeCardSlice } from './reducer';

export const {
	setStripeFieldsCompleted,
	setClientSecret,
	setStripePaymentMethod,
} = stripeCardSlice.actions;
