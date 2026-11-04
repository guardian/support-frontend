import { apiUrl } from 'helpers/abTests/apiRoutes';
import type { Participations } from 'helpers/abTests/models';

export type DeliveryAgentsResponse = {
	type:
		| 'Covered'
		| 'NotCovered'
		| 'UnknownPostcode'
		| 'ProblemWithInput'
		| 'PaperRoundError';
	agents?: DeliveryAgentOption[];
};
export type DeliveryAgentOption = {
	agentId: number;
	agentName: string;
	deliveryMethod: string;
	nbrDeliveryDays: number;
	postcode: string;
	refGroupId: number;
	summary: string;
};

export async function getDeliveryAgents(
	postcode: string,
	abParticipations: Participations,
): Promise<DeliveryAgentsResponse> {
	const agentsResponse = await fetch(
		apiUrl({
			apiRouteKey: 'deliveryAgents',
			param: postcode,
			abParticipations,
		}),
	);
	const response = (await agentsResponse.json()) as DeliveryAgentsResponse;
	return response;
}
