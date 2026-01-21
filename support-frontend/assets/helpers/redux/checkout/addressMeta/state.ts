import type { DeliveryAgentsResponse } from '../../../../pages/[countryGroupId]/checkout/helpers/getDeliveryAgents';

export type DeliveryAgentState = {
	isLoading: boolean;
	error?: string;
	response?: DeliveryAgentsResponse;
	chosenAgent?: number;
};
