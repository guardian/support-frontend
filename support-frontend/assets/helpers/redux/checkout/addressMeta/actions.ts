import { addressMetaSlice } from './reducer';

export const {
	setBillingAddressMatchesDelivery,
	setDeliveryInstructions,
	setDeliveryAgent,
	setDeliveryAgentResponse,
} = addressMetaSlice.actions;
