import { addressMetaSlice } from './reducer';

export const {
	setBillingAddressMatchesDelivery,
	setDeliveryInstructions,
	setDeliveryAgent,
	clearDeliveryAgentResponse,
} = addressMetaSlice.actions;
