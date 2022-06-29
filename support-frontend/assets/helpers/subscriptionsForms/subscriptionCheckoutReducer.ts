import { combineReducers } from 'redux';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	billingAddressReducer,
	deliveryAddressReducer,
} from 'helpers/redux/checkout/address/reducer';
import type { AddressState } from 'helpers/redux/checkout/address/state';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { giftingReducer } from 'helpers/redux/checkout/giftingState/reducer';
import type { GiftingState } from 'helpers/redux/checkout/giftingState/state';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import type { MarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { productReducer } from 'helpers/redux/checkout/product/reducer';
import type { ProductState } from 'helpers/redux/checkout/product/state';
import { recaptchaReducer } from 'helpers/redux/checkout/recaptcha/reducer';
import type { RecaptchaState } from 'helpers/redux/checkout/recaptcha/state';
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
	product: ProductState;
	marketingConsent: MarketingConsentState;
	csrf: CsrfState;
	recaptcha: RecaptchaState;
	billingAddress: AddressState;
	deliveryAddress: AddressState;
};

export type CheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	user: User;
	directDebit: DirectDebitState;
}>;

export type WithDeliveryCheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	directDebit: DirectDebitState;
}>;

export type AnyCheckoutState = CheckoutState | WithDeliveryCheckoutState;

export function createReducer(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	startDate: Option<string>,
	productOption: Option<ProductOptions>,
	fulfilmentOption: Option<FulfilmentOptions>,
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
			product: productReducer,
			gifting: giftingReducer,
			marketingConsent: marketingConsentReducer,
			csrf: csrfReducer,
			recaptcha: recaptchaReducer,
			deliveryAddress: deliveryAddressReducer,
			billingAddress: billingAddressReducer,
		}),
		user: createUserReducer(),
		directDebit,
	});
}

export const getFulfilmentOption = (
	state: WithDeliveryCheckoutState,
): Option<FulfilmentOptions> =>
	state.page.checkoutForm.product.fulfilmentOption;
