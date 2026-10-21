import compression from 'compression';
import express from 'express';
import { loadConfig } from './config/config';
import { buildApiRouterWithServices } from './routers/apiRouter';

export const buildApp = async () => {
	const config = await loadConfig();
	const app = express();

	// Disable Express default behaviour to set an etag header on all responses
	app.set('etag', false);

	// Compress all responses
	app.use(compression());

	app.use('/api', buildApiRouterWithServices(config));

	app.get('/healthcheck-express', (req, res) => {
		res.json({ status: 'OK' });
	});

	return app;
};
