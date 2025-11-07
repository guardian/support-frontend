export enum FeatureFlagName {
	EnablePremiumDigital = 'enablePremiumDigital',
	EnableDigitalAccess = 'enableDigitalAccess',
}

interface FeatureFlags {
	enablePremiumDigital: boolean;
	enableDigitalAccess: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enablePremiumDigital: urlParams.has(FeatureFlagName.EnablePremiumDigital),
		enableDigitalAccess: urlParams.has(FeatureFlagName.EnableDigitalAccess),
	};
}
