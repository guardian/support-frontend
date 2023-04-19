export type AddressMetaState = {
	billingAddressIsSame: boolean;
	deliveryInstructions?: string;
};

export const initialState: AddressMetaState = {
	billingAddressIsSame: true,
};
