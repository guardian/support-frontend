import type { Participations } from '../../abTests/abtest';
import type { OphanABPayload } from '../trackingOphan';
import { buildOphanPayload } from '../trackingOphan';

describe('Ophan AB Payload', () => {
	it('should build a payload from participations', () => {
		const input: Participations = {
			test1: 'control',
			test2: 'variant',
		};
		const expected: OphanABPayload = {
			test1: {
				variantName: 'control',
				complete: false,
				campaignCodes: [],
			},
			test2: {
				variantName: 'variant',
				complete: false,
				campaignCodes: [],
			},
		};
		const payload = buildOphanPayload(input);
		expect(payload).toEqual(expected);
	});
});
