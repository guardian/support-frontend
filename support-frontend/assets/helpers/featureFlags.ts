import { isCode } from './urls/url';

interface FeatureFlags {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: isCode() || urlParams.has('enablePremiumDigital'),
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
	};
}
