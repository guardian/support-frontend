import type { RequestHandler } from 'express';

export const noCache: RequestHandler = (_req, res, next) => {
	res.setHeader('Cache-Control', 'no-cache, private');
	next();
};
