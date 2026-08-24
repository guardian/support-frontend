import express from 'express';
import { buildApiRouterWithServices } from './routers/apiRouter';

export const buildApp = async () => {
	const app = express();

	// Disable Express default behaviour to set an etag header on all responses
	app.set('etag', false);

	app.use('/api', await buildApiRouterWithServices());

	app.get('/healthcheck-express', (req, res) => {
		res.json({ status: 'OK' });
	});

	return app;
};
