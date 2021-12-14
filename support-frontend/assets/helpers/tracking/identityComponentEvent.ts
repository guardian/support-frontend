export type AuthenticationComponentId =
	| 'signin_to_contribute'
	| 'contribution_thankyou_signin';

export const createAuthenticationEventParams = (
	componentId: AuthenticationComponentId,
): string => {
	const params = `componentType=identityauthentication&componentId=${componentId}`;
	return `componentEventParams=${encodeURIComponent(params)}`;
};
