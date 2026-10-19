import { putMetric } from './aws/cloudwatch';
import { buildApp } from './buildApp';

const PORT = process.env.PORT ?? 3000;

buildApp()
	.then((app) => {
		const server = app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});

		// The keep alive timout should be > the idle timeout on the load
		// balancer (60s by default) otherwise there's a danger that the app
		// closes the connection, but the load balancer things the connection is
		// still good.
		// See: https://repost.aws/knowledge-center/elb-alb-troubleshoot-502-errors
		server.keepAliveTimeout = 61000; // In milliseconds
		// CoPilot recommended keeping this just higher than keepAliveTimeout.
		// It sounds like it's _mostly_ unneeded in modern Node versions, but
		// suggested it was pretty harmless and costs nothing. This is only a
		// touch greater than the default of 60s.
		server.headersTimeout = 62000; // In milliseconds
	})
	.catch((error) => {
		console.error("Couldn't start server: ", error);
		void putMetric('SupportBackendServerFailedToStart');
	});
