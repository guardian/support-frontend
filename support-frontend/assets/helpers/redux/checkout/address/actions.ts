import {
	billingAddressFieldsSlice,
	deliveryAddressFieldsSlice,
} from './reducer';

export const {
	setCountry: setDeliveryCountry,
	setState: setDeliveryState,
	setLineOne: setDeliveryAddressLineOne,
	setLineTwo: setDeliveryAddressLineTwo,
	setPostcode: setDeliveryPostcode,
	setTownCity: setDeliveryTownCity,
	setFormErrors: setDeliveryAddressFormErrors,
} = deliveryAddressFieldsSlice.actions;

export const {
	setCountry: setBillingCountry,
	setState: setBillingState,
	setLineOne: setBillingAddressLineOne,
	setLineTwo: setBillingAddressLineTwo,
	setPostcode: setBillingPostcode,
	setTownCity: setBillingTownCity,
	setFormErrors: setBillingAddressFormErrors,
} = billingAddressFieldsSlice.actions;
