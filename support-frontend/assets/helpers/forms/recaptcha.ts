const recaptchaScriptSrc =
	'https://www.google.com/recaptcha/api.js?onload=v2OnloadCallback&render=explicit';

const loadRecaptchaV2 = (): Promise<void> => {
	if (document.querySelector(`script[src="${recaptchaScriptSrc}"]`)) {
		// We already have the script loaded, so just re-execute the callback to render a new recaptcha
		window.v2OnloadCallback();
		return Promise.resolve();
	}
	return new Promise<void>((resolve, reject) => {
		const recaptchaScript = document.createElement('script');
		recaptchaScript.src = recaptchaScriptSrc;
		recaptchaScript.onerror = reject;
		recaptchaScript.onload = () => resolve();

		document.head.appendChild(recaptchaScript);
	});
};

export { loadRecaptchaV2 };
