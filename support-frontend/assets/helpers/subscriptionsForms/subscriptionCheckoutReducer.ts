import { combineReducers } from 'redux';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import type {
	FormFields as AddressFormFields,
	AddressReducer,
	State as AddressState,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { addressReducerFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { giftingReducer } from 'helpers/redux/checkout/giftingState/reducer';
import type { GiftingState } from 'helpers/redux/checkout/giftingState/state';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import type { CommonState } from 'helpers/redux/commonState/state';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import { createFormReducer } from 'helpers/subscriptionsForms/formReducer';
import type { Option } from 'helpers/types/option';
import type { User } from 'helpers/user/userReducer';
import { createUserReducer } from 'helpers/user/userReducer';

export type ReduxState<PageState> = {
	common: CommonState;
	page: PageState;
};

export type CheckoutFormState = {
	personalDetails: PersonalDetailsState;
	gifting: GiftingState;
};

export type CheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	user: User;
	csrf: CsrfState;
	marketingConsent: MarketingConsentState;
	billingAddress: AddressState;
	deliveryAddress?: AddressState;
	directDebit: DirectDebitState;
}>;

export type WithDeliveryCheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	csrf: CsrfState;
	marketingConsent: MarketingConsentState;
	billingAddress: AddressState;
	deliveryAddress: AddressState;
	fulfilmentOption: Option<FulfilmentOptions>;
	directDebit: DirectDebitState;
}>;
export type AnyCheckoutState = CheckoutState | WithDeliveryCheckoutState;
type AddressReducers = {
	billingAddress: AddressReducer;
	deliveryAddress?: AddressReducer;
};

function createReducer(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
	addressReducers: AddressReducers,
) {
	return combineReducers({
		checkout: createFormReducer(
			product,
			initialBillingPeriod,
			startDate,
			productOption,
			fulfilmentOption,
		),
		checkoutForm: combineReducers({
			personalDetails: personalDetailsReducer,
			gifting: giftingReducer,
		}),
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
