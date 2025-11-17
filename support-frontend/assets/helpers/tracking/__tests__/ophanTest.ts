import type { AbTestRegister } from '@guardian/ophan-tracker-js/support';
import type { Participations } from '../../abTests/models';
import { buildAbTestRegister, buildOphanPayload } from '../trackingOphan';

describe('Ophan AB Payload', () => {
	it('should build a payload from participations', () => {
		const input: Participations = {
			test1: 'control',
			test2: 'variant',
		};
		const expected: AbTestRegister = {
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- buildOphanPayload returns AbTestRegister
		const payload: AbTestRegister = buildOphanPayload(input);
		expect(payload).toEqual(expected);
	});

	it('builds abTestRegister payload from participations', () => {
		const input: Participations = {
			test1: 'control',
			test2: 'variant',
		};
		const expected: AbTestRegister = {
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- buildAbTestRegister returns AbTestRegister
		const payload: AbTestRegister = buildAbTestRegister(input);
		expect(payload).toEqual(expected);
	});
});
