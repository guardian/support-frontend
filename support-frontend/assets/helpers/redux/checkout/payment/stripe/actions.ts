import { stripeCardSlice } from './reducer';

export const { setFormComplete, setClientSecret, setStripePaymentMethod } =
	stripeCardSlice.actions;
