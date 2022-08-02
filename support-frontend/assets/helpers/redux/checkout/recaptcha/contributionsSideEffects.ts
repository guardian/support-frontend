import { isAnyOf } from '@reduxjs/toolkit';
import type { ContributionsStartListening } from 'helpers/redux/contributionsStore';
import { enableOrDisableForm } from 'pages/contributions-landing/checkoutFormIsSubmittableActions';
import { expireRecaptchaToken, setRecaptchaToken } from '../recaptcha/actions';

export function addRecaptchaSideEffects(
	startListening: ContributionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_action, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}

// ---- Matchers ---- //

const shouldCheckFormEnabled = isAnyOf(setRecaptchaToken, expireRecaptchaToken);
