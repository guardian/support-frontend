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
): Promise<DeliveryAgentsResponse> {
	const agentsResponse = await fetch(`/delivery-agents/${postcode}`);
	const response = (await agentsResponse.json()) as DeliveryAgentsResponse;
	return response;
}
