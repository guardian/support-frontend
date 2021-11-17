import type { Participations } from 'helpers/abTests/abtest';

declare global {
	/* ~ Here, declare things that go in the global namespace, or augment
	 *~ existing declarations in the global namespace
	 */
	interface Window {
		guardian: {
			mdapiUrl: string;
			serversideTests?: Participations | null;
			enableContributionsCampaign: boolean;
			forceContributionsCampaign: boolean;
		};
		googleTagManagerDataLayer?: Array<Record<string, unknown>>;
		gtag_enable_tcf_support?: boolean;
	}
}
/* ~ this line is required as per TypeScript's global-modifying-module.d.ts instructions */
export {};
