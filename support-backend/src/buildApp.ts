import express from 'express';
import { apiRouter } from './routers/apiRouter';

export function buildApp() {
	const app = express();

	app.use('/api', apiRouter);

	app.get('/healthcheck-express', (req, res) => {
		console.log(`HealthCheck processed from port: ${req.socket.localPort}`);
		res.json({ status: 'OK' });
	});

	return app;
}
