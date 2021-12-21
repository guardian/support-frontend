const loadRecaptchaV2 = (): Promise<void> =>
	new Promise<void>((resolve, reject) => {
		const recaptchaScript = document.createElement('script');
		recaptchaScript.src =
			'https://www.google.com/recaptcha/api.js?onload=v2OnloadCallback&render=explicit';
		recaptchaScript.onerror = reject;
		recaptchaScript.onload = () => resolve();

		document.head.appendChild(recaptchaScript);
	});

export { loadRecaptchaV2 };
