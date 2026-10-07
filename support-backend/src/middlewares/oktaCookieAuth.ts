// Ports the "local" cookie-validation path of Scala's
// app/actions/UserFromAuthCookiesActionBuilder.scala (the `UserFromAuthCookiesActionBuilder`
// variant specifically - i.e. no redirect-to-auth-server fallback, since API/ajax endpoints
// can't usefully redirect mid-request - see MaybeAuthenticatedActionOnFormSubmission).
//
// Never redirects, never throws: always calls next(). Attaches a verification report to
// req.oktaUser.
import OktaJwtVerifier from '@okta/jwt-verifier';
import type { RequestHandler, Response } from 'express';
import type { OktaConfig } from '../config/okta';
import { noCache } from './noCache';

// These cookie names are stage-independent. Support frontend specifies this in config but we're
// not doing that here:
// signed.in.cookie.name, signed.out.cookie.name, id.token.cookie.name, access.token.cookie.name).
const SIGNED_IN_COOKIE = 'GU_U';
const SIGNED_OUT_COOKIE = 'GU_SO';
const ID_TOKEN_COOKIE = 'GU_ID_TOKEN';
const ACCESS_TOKEN_COOKIE = 'GU_ACCESS_TOKEN';

// cookie-parser types req.cookies as Record<string, any>; narrow it once here rather than
// casting at every call site.
function getCookie(cookies: unknown, name: string): string | undefined {
	return (cookies as Record<string, string | undefined>)[name];
}

type TokenCheckOutcome =
	| { present: false }
	| { present: true; valid: true; claims: OktaJwtVerifier.JwtClaims }
	| { present: true; valid: false; errorName: string; errorMessage: string };

type SignOutCheckOutcome =
	| { checked: false; reason: 'no-GU_SO-cookie' | 'no-valid-id-token' }
	| { checked: true; signedOutRecently: boolean };

export type OktaCookieCheckResult =
	| { signedIn: false }
	| {
			signedIn: true;
			idToken: TokenCheckOutcome;
			accessToken: TokenCheckOutcome;
			signOutCheck: SignOutCheckOutcome;
			// Mirrors UserFromAuthCookiesActionBuilder.UserClaims.toUser - only populated if
			// everything above passed.
			user?: {
				identityId: string;
				primaryEmailAddress: string;
				firstName?: string;
				lastName?: string;
			};
	  };

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- required to augment the Express namespace
	namespace Express {
		interface Request {
			oktaUser?: OktaCookieCheckResult;
		}
	}
}

function describeError(err: unknown): {
	errorName: string;
	errorMessage: string;
} {
	if (err instanceof Error) {
		return { errorName: err.name, errorMessage: err.message };
	}
	return { errorName: 'UnknownError', errorMessage: String(err) };
}

async function checkIdToken(
	verifier: OktaJwtVerifier,
	token: string | undefined,
	clientId: string,
): Promise<TokenCheckOutcome> {
	if (token === undefined) {
		return { present: false };
	}
	try {
		// Matches Scala's `validateIdTokenLocally`
		const jwt = await verifier.verifyIdToken(token, clientId);
		return { present: true, valid: true, claims: jwt.claims };
	} catch (err) {
		return { present: true, valid: false, ...describeError(err) };
	}
}

async function checkAccessToken(
	verifier: OktaJwtVerifier,
	token: string | undefined,
	audience: string,
): Promise<TokenCheckOutcome> {
	if (token === undefined) {
		return { present: false };
	}
	try {
		const jwt = await verifier.verifyAccessToken(token, audience);
		return { present: true, valid: true, claims: jwt.claims };
	} catch (err) {
		return { present: true, valid: false, ...describeError(err) };
	}
}

// Mirrors the GU_SO vs iat comparison in UserFromAuthCookiesActionBuilder.validateUserLocally:
// if GU_SO (last sign-out time, unix seconds) is in the past AND after the id token's iat claim,
// the user has signed out more recently than these tokens were issued, so they're stale.
function checkSignOut(
	signedOutCookieValue: string | undefined,
	idTokenOutcome: TokenCheckOutcome,
): SignOutCheckOutcome {
	if (signedOutCookieValue === undefined) {
		return { checked: false, reason: 'no-GU_SO-cookie' };
	}
	if (!idTokenOutcome.present || !idTokenOutcome.valid) {
		return { checked: false, reason: 'no-valid-id-token' };
	}
	const lastSignedOutTime = Number(signedOutCookieValue);
	const nowSeconds = Math.floor(Date.now() / 1000);
	const iat = idTokenOutcome.claims.iat ?? 0;
	const signedOutRecently =
		lastSignedOutTime < nowSeconds && lastSignedOutTime > iat;
	return { checked: true, signedOutRecently };
}

function clearAuthCookies(res: Response) {
	res.clearCookie(ID_TOKEN_COOKIE, { secure: true });
	res.clearCookie(ACCESS_TOKEN_COOKIE, { secure: true });
}

// Returns noCache bundled with the auth check, so any route using this is structurally
// guaranteed to also get no-cache headers - Express flattens handler arrays, so callers
// just spread this in: apiRouter.get(path, ...buildOktaCookieAuth(config), handler).
export function buildOktaCookieAuth(config: OktaConfig): RequestHandler[] {
	// Built once, not per-request - OktaJwtVerifier maintains its own JWKS cache.
	const idTokenVerifier = new OktaJwtVerifier({ issuer: config.issuer });

	const accessTokenVerifier = new OktaJwtVerifier({
		issuer: config.issuer,
		// `scp.includes` is the library's documented syntax for asserting the access
		// token's scope claim contains every required scope - mirrors Scala's
		// validateScopes/MissingRequiredScope check in identity-auth-core.
		assertClaims: { 'scp.includes': config.requiredAccessTokenScopes },
	});

	const authCheck: RequestHandler = async (req, res, next) => {
		const isSignedIn = getCookie(req.cookies, SIGNED_IN_COOKIE) !== undefined;

		if (!isSignedIn) {
			req.oktaUser = { signedIn: false };
			clearAuthCookies(res);
			next();
			return;
		}

		const [idToken, accessToken] = await Promise.all([
			checkIdToken(
				idTokenVerifier,
				getCookie(req.cookies, ID_TOKEN_COOKIE),
				config.clientId,
			),
			checkAccessToken(
				accessTokenVerifier,
				getCookie(req.cookies, ACCESS_TOKEN_COOKIE),
				config.audience,
			),
		]);

		const signOutCheck = checkSignOut(
			getCookie(req.cookies, SIGNED_OUT_COOKIE),
			idToken,
		);

		const fullyValid =
			idToken.present &&
			idToken.valid &&
			accessToken.present &&
			accessToken.valid &&
			(!signOutCheck.checked || !signOutCheck.signedOutRecently);

		if (!fullyValid) {
			clearAuthCookies(res);
		}

		req.oktaUser = {
			signedIn: true,
			idToken,
			accessToken,
			signOutCheck,
			// Claim names match com.gu.identity.auth.IdentityClaims (identity-auth-core):
			// IDENTITY_ID_CLAIM_NAME = "legacy_identity_id", EMAIL_CLAIM_NAME = "email",
			// OKTA_ID_CLAIM_NAME = "sub" - see UserFromAuthCookiesActionBuilder.UserClaims.parser.
			user: fullyValid
				? {
						identityId: String(idToken.claims.legacy_identity_id),
						primaryEmailAddress: String(idToken.claims.email),
						firstName: idToken.claims.first_name as string | undefined,
						lastName: idToken.claims.last_name as string | undefined,
				  }
				: undefined,
		};
		next();
	};

	// We'd always want noCache if we're doing auth checking, since the response may vary based on the user
	return [noCache, authCheck];
}
