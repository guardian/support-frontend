import { IsoCountry } from 'helpers/internationalisation/country';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { combineReducers } from 'redux';
import { createFormReducer } from 'helpers/subscriptionsForms/formReducer';
import { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { createUserReducer } from 'helpers/user/userReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import {
	FormFields as AddressFormFields,
	State as AddressState,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { addressReducerFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';
import { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { ReduxState } from 'helpers/page/page';
import { Option } from 'helpers/types/option';
import { FormState } from 'helpers/subscriptionsForms/formFields';
import { ProductOptions } from 'helpers/productPrice/productOptions';
import { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { DirectDebitState } from 'components/directDebit/directDebitReducer';
export type CheckoutState = ReduxState<{
	checkout: FormState;
	csrf: CsrfState;
	marketingConsent: MarketingConsentState;
	billingAddress: AddressState;
	hasDeliveryAddress: false;
	directDebit: DirectDebitState;
}>;
export type WithDeliveryCheckoutState = ReduxState<{
	checkout: FormState;
	csrf: CsrfState;
	marketingConsent: MarketingConsentState;
	billingAddress: AddressState;
	deliveryAddress: AddressState;
	hasDeliveryAddress: true;
	fulfilmentOption: Option<FulfilmentOptions>;
	directDebit: DirectDebitState;
}>;
export type AnyCheckoutState = CheckoutState | WithDeliveryCheckoutState;

function createReducer(
	initialCountry: IsoCountry,
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
	addressReducers,
) {
	return combineReducers({
		checkout: createFormReducer(
			initialCountry,
			product,
			initialBillingPeriod,
			startDate,
			productOption,
			fulfilmentOption,
		),
		user: createUserReducer(),
		directDebit,
		...addressReducers,
		csrf,
		marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
	});
}

function createCheckoutReducer(
	initialCountry: IsoCountry,
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
) {
	const address = {
		billingAddress: addressReducerFor('billing', initialCountry),
	};
	return createReducer(
		initialCountry,
		product,
		initialBillingPeriod,
		startDate,
		productOption,
		fulfilmentOption,
		address,
	);
}

function createWithDeliveryCheckoutReducer(
	initialCountry: IsoCountry,
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
) {
	const addresses = {
		billingAddress: addressReducerFor('billing', initialCountry),
		deliveryAddress: addressReducerFor('delivery', initialCountry),
	};
	return createReducer(
		initialCountry,
		product,
		initialBillingPeriod,
		startDate,
		productOption,
		fulfilmentOption,
		addresses,
	);
}

const addressFieldsFromAddress = (address: AddressState) => {
	const { formErrors, ...formFields } = address.fields;
	return formFields;
};

const getBillingAddress = (state: AnyCheckoutState): AddressState =>
	state.page.billingAddress;

const getBillingAddressFields = (state: AnyCheckoutState): AddressFormFields =>
	addressFieldsFromAddress(getBillingAddress(state));

const getDeliveryAddress = (state: WithDeliveryCheckoutState): AddressState =>
	state.page.deliveryAddress;

const getDeliveryAddressFields = (
	state: WithDeliveryCheckoutState,
): AddressFormFields => addressFieldsFromAddress(getDeliveryAddress(state));

const getFulfilmentOption = (
	state: WithDeliveryCheckoutState,
): Option<FulfilmentOptions> => state.page.checkout.fulfilmentOption;

export {
	createCheckoutReducer,
	createWithDeliveryCheckoutReducer,
	getBillingAddress,
	getBillingAddressFields,
	getDeliveryAddress,
	getDeliveryAddressFields,
	getFulfilmentOption,
};
