export type FeatureFlag = {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
};

export function getFeatureFlags(): FeatureFlag {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: urlParams.has('enablePremiumDigital'),
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
	};
}
