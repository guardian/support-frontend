import { isProd } from './urls/url';

interface FeatureFlags {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: !(isProd() || urlParams.has('disablePremiumDigital')),
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
	};
}
