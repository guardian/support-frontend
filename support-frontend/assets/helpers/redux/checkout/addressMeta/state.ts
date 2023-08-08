export type AddressMetaState = {
	billingAddressMatchesDelivery: boolean;
	deliveryInstructions?: string;
	deliveryAgent: DeliveryAgentState;
};

export type DeliveryAgentState = {
	isLoading: boolean;
	error?: string;
	response?: DeliveryAgentsResponse;
	chosenAgent?: number;
};

export const initialState: AddressMetaState = {
	billingAddressMatchesDelivery: true,
	deliveryAgent: { isLoading: false, response: undefined },
};

export type DeliveryAgentsResponse = {
	type:
		| 'Success'
		| 'NotCovered'
		| 'UnknownOrInvalidPostcode'
		| 'PaperRoundError';
	agents: DeliveryAgentOption[];
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
