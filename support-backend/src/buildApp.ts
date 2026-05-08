import express from 'express';

export function buildApp() {
	const app = express();

	app.get('/healthcheck-express', (req, res) => {
		res.json({ status: 'OK' });
	});

	return app;
}
