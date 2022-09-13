import { useEffect } from 'react';
import { loadRecaptchaV2 } from 'helpers/forms/recaptcha';

export function useRecaptchaV2(
	placeholderId: string,
	onCompletionCallback: (token: string) => void,
	onExpireCallback?: () => void,
): void {
	useEffect(() => {
		if (window.guardian.recaptchaEnabled) {
			window.v2OnloadCallback = () => {
				window.grecaptcha?.render(placeholderId, {
					sitekey: window.guardian.v2recaptchaPublicKey,
					callback: onCompletionCallback,
					'expired-callback': onExpireCallback,
				});
			};
			void loadRecaptchaV2();
		}
	}, []);
}
