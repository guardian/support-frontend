import { buildApp } from './buildApp';

const app = buildApp();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
