interface FeatureFlags {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: !urlParams.has('disableDigitalPlus'),
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
	};
}
