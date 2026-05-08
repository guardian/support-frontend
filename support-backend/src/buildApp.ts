import express from 'express';
import { apiRouter } from './apiRouter';

export function buildApp() {
	const app = express();

	app.use('/api', apiRouter);

	app.get('/healthcheck-express', (req, res) => {
		res.json({ status: 'OK' });
	});

	return app;
}
