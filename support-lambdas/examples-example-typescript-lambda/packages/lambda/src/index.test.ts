import { main } from './index';

describe('The lambda', () => {
	beforeAll(() => {
		// Override the STAGE value from `.env`
		process.env.STAGE = 'TEST';
	});

	it('should return a greeting', async () => {
		const response = await main();
		expect(response).toContain(
			'Hello from example-typescript-lambda in TEST! The time is ',
		);
	});
});
