/**
 * @group integration
 */

import { getPaperRoundConfig, PaperRoundService } from '../services/paperRound';

describe('PaperRoundService Integration Tests', () => {
	test('Fetch agents from PaperRound API', async () => {
		// We test against the PROD service here as the CODE service often fails to
		// respond in time for the test to complete successfully.
		const paperRoundConfig = await getPaperRoundConfig('PROD');
		const paperRoundService = new PaperRoundService(paperRoundConfig);
		const agents = await paperRoundService.agents();
		expect(agents.length).toBeGreaterThan(0);
	}, 30000);
});
