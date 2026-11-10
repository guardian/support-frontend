declare module '@mparticle/web-adwords-kit' {
	import type { SDKInitConfig } from '@mparticle/web-sdk';

	const googleAdsKit: { register: (config: SDKInitConfig) => void };
	export default googleAdsKit;
}
