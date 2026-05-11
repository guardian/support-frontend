import { buildApp } from './buildApp';

const PORT = process.env.PORT ?? 3000;

buildApp()
	.then((app) => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Couldn't start server: ", error);
	});
