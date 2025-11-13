/**
 * @group integration
 */

import { getPaperRoundConfig, PaperRoundService } from '../services/paperRound';

describe('PaperRoundService Integration Tests', () => {
	test('Fetch agents from PaperRound API', async () => {
		const paperRoundConfig = await getPaperRoundConfig('PROD');
		const paperRoundService = new PaperRoundService(paperRoundConfig);
		const agents = await paperRoundService.agents();
		expect(agents.length).toBeGreaterThan(0);
	}, 30000);
});
