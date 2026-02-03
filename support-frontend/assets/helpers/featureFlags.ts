interface FeatureFlags {
	enableDigitalAccess: boolean;
	enableWeeklyDigital: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
		enableWeeklyDigital: urlParams.has('enableWeeklyDigital'),
	};
}
