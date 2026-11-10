import { apiUrl } from './apiRoutes';
import type { Participations } from './models';

describe('apiUrl', () => {
	const postcode = 'N1 9GU';
	it.each([
		['deliveryAgents', postcode, 'control', '/delivery-agents/N1%209GU'],
		['deliveryAgents', postcode, 'variant', '/api/delivery-agents/N1%209GU'],
		['postcodeLookup', postcode, 'control', '/api/postcode-lookup/N1%209GU'], // scala endpoint deprecated, uses typescript
		['postcodeLookup', postcode, 'variant', '/api/postcode-lookup/N1%209GU'],
	] as const)(
		`returns route for {apiRouteKey:%s, param:%s, participant:%s}: %s`,
		(apiRouteKey, param, participant, expected) => {
			const abParticipations: Participations = {
				deliveryAgentsLookupExpress:
					participant as Participations['deliveryAgentsLookupExpress'],
			};
			const result = apiUrl({ apiRouteKey, param, abParticipations });
			expect(result).toEqual(expected);
		},
	);
});
