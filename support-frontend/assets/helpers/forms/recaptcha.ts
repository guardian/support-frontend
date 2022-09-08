import { logException } from 'helpers/utilities/logger';

const loadRecaptchaV2 = (): Promise<void> =>
	new Promise<void>((resolve, reject) => {
		const recaptchaScript = document.createElement('script');
		recaptchaScript.src =
			'https://www.google.com/recaptcha/api.js?onload=v2OnloadCallback&render=explicit';
		recaptchaScript.onerror = (error) => {
			logException(`Recaptcha failed to load:  ${JSON.stringify(error)}`);
			reject(error);
		};
		recaptchaScript.onload = () => resolve();

		document.head.appendChild(recaptchaScript);
	});

export { loadRecaptchaV2 };
