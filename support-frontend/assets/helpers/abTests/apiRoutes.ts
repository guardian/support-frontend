import type { Participations } from 'helpers/abTests/models';

const apiRoutes = {
	deliveryAgents: {
		test: 'deliveryAgentsLookupExpress',
		scala: '/delivery-agents',
		express: '/api/delivery-agents',
	},
	postcodeLookup: {
		test: undefined, // already fully on Express
		scala: '/postcode-lookup',
		express: '/api/postcode-lookup',
	},
} as const;

export type ApiRouteKey = keyof typeof apiRoutes;

type ApiUrlParams = {
	apiRouteKey: ApiRouteKey;
	param?: string;
	abParticipations?: Participations;
};

export function apiUrl({
	apiRouteKey,
	param,
	abParticipations,
}: ApiUrlParams): string {
	const { test, scala, express } = apiRoutes[apiRouteKey];
	const useExpress =
		test === undefined || abParticipations?.[test] === 'variant';
	return `${useExpress ? express : scala}/${encodeURIComponent(param ?? '')}`;
}
