import express from 'express';
import { buildApiRouterWithServices } from './routers/apiRouter';

export const buildApp = async () => {
	const app = express();

	app.use('/api', await buildApiRouterWithServices());

	app.get('/healthcheck-express', (req, res) => {
		console.log(`HealthCheck processed from port: ${req.socket.localPort}`);
		res.json({ status: 'OK' });
	});

	return app;
};
