import { connect } from 'react-redux';
import {
	setBillingAddressLineOne,
	setBillingAddressLineTwo,
	setBillingCountry,
	setBillingPostcode,
	setBillingState,
	setBillingTownCity,
	setDeliveryAddressLineOne,
	setDeliveryAddressLineTwo,
	setDeliveryCountry,
	setDeliveryPostcode,
	setDeliveryState,
	setDeliveryTownCity,
} from 'helpers/redux/checkout/address/actions';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { AddressFields } from './addressFields';
import { postcodeFinderActionCreatorsFor } from './postcodeFinderStore';

// ---- Billing address ---- //

function mapBillingAddressStateToProps(state: SubscriptionsState) {
	return {
		scope: 'billing' as AddressType,
		postcodeState: state.page.checkoutForm.billingAddress.postcode,
		lineOne: state.page.checkoutForm.billingAddress.fields.lineOne,
		lineTwo: state.page.checkoutForm.billingAddress.fields.lineTwo,
		city: state.page.checkoutForm.billingAddress.fields.city,
		country: state.page.checkoutForm.billingAddress.fields.country,
		postCode: state.page.checkoutForm.billingAddress.fields.postCode,
		state: state.page.checkoutForm.billingAddress.fields.state,
		errors: state.page.checkoutForm.billingAddress.fields.errors,
	};
}

const mapBillingAddressDispatchToProps = {
	setLineOne: setBillingAddressLineOne,
	setLineTwo: setBillingAddressLineTwo,
	setTownCity: setBillingTownCity,
	setState: setBillingState,
	setPostcode: setBillingPostcode,
	setCountry: setBillingCountry,
	...postcodeFinderActionCreatorsFor('billing'),
};

export const BillingAddress = connect(
	mapBillingAddressStateToProps,
	mapBillingAddressDispatchToProps,
)(AddressFields);

// ---- Delivery address ---- //

function mapDeliveryAddressStateToProps(state: SubscriptionsState) {
	return {
		scope: 'delivery' as AddressType,
		postcodeState: state.page.checkoutForm.deliveryAddress.postcode,
		lineOne: state.page.checkoutForm.deliveryAddress.fields.lineOne,
		lineTwo: state.page.checkoutForm.deliveryAddress.fields.lineTwo,
		city: state.page.checkoutForm.deliveryAddress.fields.city,
		country: state.page.checkoutForm.deliveryAddress.fields.country,
		postCode: state.page.checkoutForm.deliveryAddress.fields.postCode,
		state: state.page.checkoutForm.deliveryAddress.fields.state,
		errors: state.page.checkoutForm.deliveryAddress.fields.errors,
	};
}

const mapDeliveryAddressDispatchToProps = {
	setLineOne: setDeliveryAddressLineOne,
	setLineTwo: setDeliveryAddressLineTwo,
	setTownCity: setDeliveryTownCity,
	setState: setDeliveryState,
	setPostcode: setDeliveryPostcode,
	setCountry: setDeliveryCountry,
	...postcodeFinderActionCreatorsFor('delivery'),
};

export const DeliveryAddress = connect(
	mapDeliveryAddressStateToProps,
	mapDeliveryAddressDispatchToProps,
)(AddressFields);
