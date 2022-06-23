import { recaptchaSlice } from './reducer';

export const { setRecaptchaToken, expireRecaptchaToken } =
	recaptchaSlice.actions;
