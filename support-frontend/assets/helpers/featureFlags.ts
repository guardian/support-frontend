import { isDev } from './urls/url';

const featureFlagEnableDigitalAccess = 'enableDigitalAccess';
export const featureFlagEnableWeeklyDigital = 'enableWeeklyDigital';

interface FeatureFlags {
	enableDigitalAccess: boolean;
	enableWeeklyDigital: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enableDigitalAccess: urlParams.has(featureFlagEnableDigitalAccess),
		enableWeeklyDigital:
			isDev() || urlParams.has(featureFlagEnableWeeklyDigital),
	};
}
