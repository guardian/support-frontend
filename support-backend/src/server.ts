import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.get('/healthcheck-express', (req, res) => {
	res.json({ status: 'OK' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
