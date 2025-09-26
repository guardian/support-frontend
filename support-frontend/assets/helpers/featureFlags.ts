type FeatureFlag = {
	enablePremiumDigital: boolean;
};

export function getFeatureFlags(): FeatureFlag {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: urlParams.has('enablePremiumDigital'),
	};
}
