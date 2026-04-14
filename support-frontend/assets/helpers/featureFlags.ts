// Usage : const { feature } = getFeatureFlags();
interface FeatureFlags {
	feature: boolean;
}

export function getFeatureFlags(): FeatureFlags {
	const urlParams = new URLSearchParams(window.location.search);

	return {
		feature: urlParams.has('feature'),
	};
}
