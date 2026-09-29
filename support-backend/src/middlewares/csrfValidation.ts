import type { RequestHandler } from 'express';
import { compareSignedTokens } from '../csrf/playCsrfToken';

/**
 * SPIKE (issue #8246, Phase 0 item 2): validates a Play-issued CSRF token by
 * comparing the `Csrf-Token` header against the `GU_support_csrf` cookie, exactly
 * as Play's CSRF filter does for state-changing requests.
 *
 * This mirrors Play's `checkMethod` (only non-safe methods are checked) and its
 * cookie-vs-header comparison, and adds an `Origin`/`Referer` allow-list as
 * defence-in-depth — a mechanism that survives independently of the shared Play
 * secret (see Challenge 1, option C in the issue).
 */

const CSRF_COOKIE_NAME = 'GU_support_csrf';
const CSRF_HEADER_NAME = 'Csrf-Token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function readCookie(
	cookieHeader: string | undefined,
	name: string,
): string | undefined {
	if (!cookieHeader) {
		return undefined;
	}
	for (const part of cookieHeader.split(';')) {
		const separatorIndex = part.indexOf('=');
		if (separatorIndex === -1) {
			continue;
		}
		if (part.slice(0, separatorIndex).trim() === name) {
			return decodeURIComponent(part.slice(separatorIndex + 1).trim());
		}
	}
	return undefined;
}

// Prefer the Origin header; fall back to the origin of the Referer.
function resolveSourceOrigin(
	origin: string | undefined,
	referer: string | undefined,
): string | undefined {
	if (origin) {
		return origin;
	}
	if (referer) {
		try {
			return new URL(referer).origin;
		} catch {
			return undefined;
		}
	}
	return undefined;
}

export const buildCsrfValidationMiddleware =
	(playSecret: string, allowedOrigins: string[]): RequestHandler =>
	(req, res, next) => {
		if (SAFE_METHODS.has(req.method)) {
			next();
			return;
		}

		// Defence-in-depth: reject a definitively cross-origin request. When
		// neither header is present we fall through to the token check, which is
		// the primary protection.
		const sourceOrigin = resolveSourceOrigin(
			req.get('Origin'),
			req.get('Referer'),
		);
		if (sourceOrigin !== undefined && !allowedOrigins.includes(sourceOrigin)) {
			res.status(403).send();
			return;
		}

		const headerToken = req.get(CSRF_HEADER_NAME);
		const cookieToken = readCookie(req.headers.cookie, CSRF_COOKIE_NAME);

		if (!headerToken || !cookieToken) {
			res.status(403).send();
			return;
		}

		if (!compareSignedTokens(headerToken, cookieToken, playSecret)) {
			res.status(403).send();
			return;
		}

		next();
	};
