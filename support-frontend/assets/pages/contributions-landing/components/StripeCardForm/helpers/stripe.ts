import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { routes } from 'helpers/urls/routes';
import { noClientSecretError } from './errors';
import { trackRecaptchaVerified } from './tracking';

export function createStripeSetupIntent(
	token: string,
	stripeKey: string,
	isTestUser: boolean,
	csrf: Csrf,
): Promise<string> {
	return fetchJson(
		routes.stripeSetupIntentRecaptcha,
		requestOptions(
			{
				token,
				stripePublicKey: stripeKey,
				isTestUser: isTestUser,
			},
			'same-origin',
			'POST',
			csrf,
		),
	).then((json) => {
		if (json.client_secret && typeof json.client_secret === 'string') {
			trackRecaptchaVerified();
			return json.client_secret;
		} else {
			throw noClientSecretError(json);
		}
	});
}
