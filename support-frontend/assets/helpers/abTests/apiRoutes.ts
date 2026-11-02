import type { Participations } from 'helpers/abTests/models';

const apiRoutes = {
	deliveryAgents: {
		test: 'deliveryAgentsLookupExpress',
		scala: '/delivery-agents',
		express: '/api/delivery-agents',
	},
} as const;

export type ApiRouteKey = keyof typeof apiRoutes;

type ApiUrlParams = {
	apiRouteKey: ApiRouteKey;
	param: string;
	abParticipations?: Participations;
};

export function apiUrl({
	apiRouteKey,
	param,
	abParticipations,
}: ApiUrlParams): string {
	const { test, scala, express } = apiRoutes[apiRouteKey];
	const useExpress = abParticipations?.[test] === 'variant';
	return `${useExpress ? express : scala}/${encodeURIComponent(param)}`;
}
