// SPIKE - do not merge.
// Public (non-secret) Okta config values, copied from support-frontend's
// conf/{CODE,PROD,DEV}.public.conf (see app/config/Identity.scala: oauth.client.id,
// oauth.issuer.url, oauth.audience). These are not secrets - no SSM lookup needed.
import type { Stage } from '../utils/stage';

export type OktaConfig = {
	issuer: string;
	audience: string;
	clientId: string;
	// Mirrors Scala's `oauth.scopes` (Identity.scala / application.conf), checked
	// against the access token's `scp` claim in UserFromAuthCookiesActionBuilder.
	requiredAccessTokenScopes: string[];
};

const requiredAccessTokenScopes = ['openid', 'profile', 'email'];

const oktaConfigByStage: Record<Stage, OktaConfig> = {
	PROD: {
		issuer: 'https://profile.theguardian.com/oauth2/aus3xgj525jYQRowl417',
		audience: 'https://profile.theguardian.com/',
		clientId: '0oa79m3ecvbJXDSqg417',
		requiredAccessTokenScopes,
	},
	CODE: {
		issuer:
			'https://profile.code.dev-theguardian.com/oauth2/aus3v9gla95Toj0EE0x7',
		audience: 'https://profile.code.dev-theguardian.com/',
		clientId: '0oa53x6v3bZw4pdsJ0x7',
		requiredAccessTokenScopes,
	},
	DEV: {
		// DEV shares CODE's Okta environment.
		issuer:
			'https://profile.code.dev-theguardian.com/oauth2/aus3v9gla95Toj0EE0x7',
		audience: 'https://profile.code.dev-theguardian.com/',
		clientId: '0oa53x6v3bZw4pdsJ0x7',
		requiredAccessTokenScopes,
	},
};

export const getOktaConfig = (stage: Stage): OktaConfig =>
	oktaConfigByStage[stage];
