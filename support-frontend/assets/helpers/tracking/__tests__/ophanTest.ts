import type { Participations } from '../../abTests/models';
import type { OphanABPayload } from '../trackingOphan';
import { buildOphanPayload } from '../trackingOphan';

describe('Ophan AB Payload', () => {
	it('should build a payload from participations', () => {
		const input: Participations = {
			test1: 'control',
			test2: 'variant',
		};
		const expected: OphanABPayload = [
			{
				name: 'test1',
				variant: 'control',
				complete: false,
				campaignCodes: [],
			},
			{
				name: 'test2',
				variant: 'variant',
				complete: false,
				campaignCodes: [],
			},
		];
		const payload = buildOphanPayload(input);
		expect(payload).toEqual(expected);
	});
});
