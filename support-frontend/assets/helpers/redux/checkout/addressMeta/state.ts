export type AddressMetaState = {
	billingAddressMatchesDelivery: boolean;
	deliveryInstructions?: string;
};

export const initialState: AddressMetaState = {
	billingAddressMatchesDelivery: true,
};
