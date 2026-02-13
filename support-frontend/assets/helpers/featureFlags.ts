interface FeatureFlags {
	enableDigitalAccess: boolean;
	enableWeeklyDigital: boolean;
	enableWeeklyDigitalPlans: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		enableDigitalAccess: urlParams.has('enableDigitalAccess'),
		enableWeeklyDigital: urlParams.has('enableWeeklyDigital'),
		enableWeeklyDigitalPlans: urlParams.has('enableWeeklyDigitalPlans'),
	};
}
