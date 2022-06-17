import { useEffect, useState } from 'react';
import { loadRecaptchaV2 } from 'helpers/forms/recaptcha';

type RecaptchaHookData = {
	isEnabled: boolean;
	hasLoaded: boolean;
};

export function useRecaptchaV2(
	placeholderId: string,
	onCompletionCallback: (token: string) => void,
): RecaptchaHookData {
	const [hasLoaded, setHasLoaded] = useState(false);

	useEffect(() => {
		window.v2OnloadCallback = () => {
			setHasLoaded(true);
			window.grecaptcha?.render(placeholderId, {
				sitekey: window.guardian.v2recaptchaPublicKey,
				callback: onCompletionCallback,
			});
		};
		void loadRecaptchaV2();
	}, []);

	return {
		isEnabled: window.guardian.recaptchaEnabled ?? false,
		hasLoaded,
	};
}
