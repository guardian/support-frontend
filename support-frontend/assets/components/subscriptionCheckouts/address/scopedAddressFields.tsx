import { connect } from 'react-redux';
import {
	addressActionCreatorsFor,
	getFormFields,
	getStateFormErrors,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import { AddressFields } from './addressFields';
import { postcodeFinderActionCreatorsFor } from './postcodeFinderStore';

// Billing
function mapBillingAddressStateToProps(state: SubscriptionsState) {
	return {
		scope: 'billing' as AddressType,
		...getFormFields(state.page.billingAddress),
		formErrors: getStateFormErrors(state.page.billingAddress),
		postcodeState: state.page.billingAddress.postcode,
	};
}

const mapBillingAddressDispatchToProps = {
	...addressActionCreatorsFor('billing'),
	...postcodeFinderActionCreatorsFor('billing'),
};

export const BillingAddress = connect(
	mapBillingAddressStateToProps,
	mapBillingAddressDispatchToProps,
)(AddressFields);

// Delivery
function mapDeliveryAddressStateToProps(state: SubscriptionsState) {
	return {
		scope: 'delivery' as AddressType,
		...getFormFields(state.page.deliveryAddress),
		formErrors: getStateFormErrors(state.page.deliveryAddress),
		postcodeState: state.page.deliveryAddress.postcode,
	};
}

const mapDeliveryAddressDispatchToProps = {
	...addressActionCreatorsFor('delivery'),
	...postcodeFinderActionCreatorsFor('delivery'),
};

export const DeliveryAddress = connect(
	mapDeliveryAddressStateToProps,
	mapDeliveryAddressDispatchToProps,
)(AddressFields);
