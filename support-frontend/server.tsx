import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import render from 'preact-render-to-string';
import { Index } from './assets/pages/[countryGroupId]/index';

const server = fastify();

server.register(replyFrom, { base: 'http://localhost:9211/' });

server.get('/uk', async (request, reply) => {
	const config = await fetch('http://localhost:9210/api/config').then(
		(response) => response.json(),
	);
	reply.type('text/html');
	return render(<Index config={config} />);
});

server.get('/assets/*', async (request, reply) => {
	const path = request.params['*'];
	const response = await fetch(`http://localhost:9211/assets/${path}`);
	const text = await response.text();
	return text;
});

server.listen({ port: 3000 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
