// Usage : const { feature } = getFeatureFlags();
interface FeatureFlags {
	express: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		express: urlParams.has('express'),
	};
}
