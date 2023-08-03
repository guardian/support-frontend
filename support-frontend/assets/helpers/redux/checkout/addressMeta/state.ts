export type AddressMetaState = {
	billingAddressMatchesDelivery: boolean;
	deliveryInstructions?: string;
	deliveryAgent: DeliveryAgentState;
};

type DeliveryAgentState = {
	isLoading: boolean;
	error?: any;
	agents: any[];
	chosenAgent?: number;
};

export const initialState: AddressMetaState = {
	billingAddressMatchesDelivery: true,
	deliveryAgent: { isLoading: false, agents: [] },
};
