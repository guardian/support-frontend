import { isProd } from './urls/url';

type FeatureFlag = {
	enablePremiumDigital: boolean;
};

export function getFeatureFlags(): FeatureFlag {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: !(isProd() || urlParams.has('disablePremiumDigital')),
	};
}
