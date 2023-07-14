/**
 * Returns the Okta authorization header iff we want to authorize the request with Okta,
 * otherwise returns undefined.
 */
const oktaAuthHeader = (
	authWithOkta: boolean,
	oktaAccessToken: string,
): { Authorization: string } | undefined =>
	authWithOkta ? { Authorization: `Bearer ${oktaAccessToken}` } : undefined;

export { oktaAuthHeader };
