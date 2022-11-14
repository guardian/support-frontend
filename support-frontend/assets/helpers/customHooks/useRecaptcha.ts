import { useEffect, useState } from 'react';
import { loadRecaptchaV2 } from 'helpers/forms/recaptcha';

export function useRecaptchaV2(
	placeholderId: string,
	onCompletionCallback: (token: string) => void,
	onExpireCallback?: () => void,
): void {
	const [recaptchaId, setRecaptchaId] = useState<number | undefined>();

	useEffect(() => {
		if (window.guardian.recaptchaEnabled) {
			window.v2OnloadCallback = () => {
				try {
					const id = window.grecaptcha?.render(placeholderId, {
						sitekey: window.guardian.v2recaptchaPublicKey,
						callback: onCompletionCallback,
						'expired-callback': onExpireCallback,
					});

					setRecaptchaId(id);
				} catch (error) {
					window.grecaptcha?.reset(recaptchaId);
				}
			};
			void loadRecaptchaV2();
		}
	}, []);
}
