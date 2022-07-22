import {
	billingAddressFieldsSlice,
	billingAddressPostcodeFinderSlice,
	deliveryAddressFieldsSlice,
	deliveryAddressPostcodeFinderSlice,
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
	setPostcode: setDeliveryPostcodeForFinder,
	setError: setDeliveryPostcodeErrorForFinder,
} = deliveryAddressPostcodeFinderSlice.actions;

export const {
	setCountry: setBillingCountry,
	setState: setBillingState,
	setLineOne: setBillingAddressLineOne,
	setLineTwo: setBillingAddressLineTwo,
	setPostcode: setBillingPostcode,
	setTownCity: setBillingTownCity,
	setFormErrors: setBillingAddressFormErrors,
} = billingAddressFieldsSlice.actions;

export const {
	setPostcode: setBillingPostcodeForFinder,
	setError: setBillingPostcodeErrorForFinder,
} = billingAddressPostcodeFinderSlice.actions;
