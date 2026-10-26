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
	useExpressDeliveryAgentsLookup: boolean,
): Promise<DeliveryAgentsResponse> {
	const expressFolder = useExpressDeliveryAgentsLookup ? 'api/' : '';
	const agentsResponse = await fetch(
		`/${expressFolder}delivery-agents/${postcode}`,
	);
	const response = (await agentsResponse.json()) as DeliveryAgentsResponse;
	return response;
}
