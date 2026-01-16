import type { DeliveryAgentsResponse } from '../../../../pages/[countryGroupId]/checkout/helpers/getDeliveryAgents';

type AddressMetaState = {
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
