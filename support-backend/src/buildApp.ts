import express from 'express';

export function buildApp() {
	const app = express();

	app.get('/healthcheck-express', (req, res) => {
		console.log(`HealthCheck processed from port: ${req.socket.localPort}`);
		res.json({ status: 'OK' });
	});

	return app;
}
