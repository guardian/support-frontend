import { apiUrl } from './apiRoutes';
import type { ApiRouteKey } from './apiRoutes';
import type { Participations } from './models';

describe('apiUrl', () => {
	const postcode = 'N1 9GU';
	it.each`
		routeKey            | parameter   | participant  | expected
		${'deliveryAgents'} | ${postcode} | ${'control'} | ${`/delivery-agents/N1%209GU`}
		${'deliveryAgents'} | ${postcode} | ${'variant'} | ${`/api/delivery-agents/N1%209GU`}
		${'deliveryAgents'} | ${''}       | ${'control'} | ${'/delivery-agents/'}
		${'deliveryAgents'} | ${''}       | ${'variant'} | ${'/api/delivery-agents/'}
		${'postcodeLookup'} | ${''}       | ${'control'} | ${'/api/postcode-lookup/'}
		${'postcodeLookup'} | ${''}       | ${'variant'} | ${'/api/postcode-lookup/'}
	`(
		`returns route $expected given {apiRouteKey:$routeKey, participant:$participant, param:$parameter}`,
		({ routeKey, parameter, participant, expected }) => {
			const apiRouteKey = routeKey as ApiRouteKey;
			const param = parameter === '' ? undefined : (parameter as string);
			const abParticipations: Participations = {
				deliveryAgentsLookupExpress:
					participant as Participations['deliveryAgentsLookupExpress'],
			};
			const result = apiUrl({ apiRouteKey, param, abParticipations });
			expect(result).toEqual(expected);
		},
	);
});
