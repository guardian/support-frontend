import { isCode } from './urls/url';

interface FeatureFlags {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	const enablePremiumDigitalParam = urlParams.get('enablePremiumDigital');

	return {
		enablePremiumDigital:
			(isCode() && enablePremiumDigitalParam !== 'false') ||
			(enablePremiumDigitalParam !== null &&
				enablePremiumDigitalParam === 'true'),
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
	};
}
