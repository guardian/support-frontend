export type AddressMetaState = {
	billingAddressMatchesDelivery: boolean;
	deliveryInstructions?: string;
	deliveryAgent?: string;
};

export const initialState: AddressMetaState = {
	billingAddressMatchesDelivery: true,
};
