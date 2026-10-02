import type { RequestHandler } from 'express';

/**
 * SPIKE (issue #8246, Phase 0 item 2): throwaway endpoint used to confirm Play
 * CSRF token validation end to end against a real CODE page. Reached only after
 * `buildCsrfValidationMiddleware` has already validated the token, so a 200 here
 * means validation passed; a failed token yields a 403 from the middleware.
 *
 * This endpoint is NOT intended to be merged — it exists to de-risk the real
 * CSRF middleware built in Phase 3 of the migration.
 */
export const csrfValidationSpikeHandler: RequestHandler = (_req, res) => {
	res.json({ valid: true });
};
