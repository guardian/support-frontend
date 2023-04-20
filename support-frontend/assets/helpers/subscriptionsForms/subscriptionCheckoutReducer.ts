import { combineReducers } from 'redux';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	billingAddressReducer,
	deliveryAddressReducer,
} from 'helpers/redux/checkout/address/reducer';
import type { AddressState } from 'helpers/redux/checkout/address/state';
import { addressMetaReducer } from 'helpers/redux/checkout/addressMeta/reducer';
import type { AddressMetaState } from 'helpers/redux/checkout/addressMeta/state';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { giftingReducer } from 'helpers/redux/checkout/giftingState/reducer';
import type { GiftingState } from 'helpers/redux/checkout/giftingState/state';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import type { MarketingConsentState } from 'helpers/redux/checkout/marketingConsent/state';
import type { PaymentState } from 'helpers/redux/checkout/payment/reducer';
import { paymentReducer } from 'helpers/redux/checkout/payment/reducer';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { productReducer } from 'helpers/redux/checkout/product/reducer';
import type { ProductState } from 'helpers/redux/checkout/product/state';
import { recaptchaReducer } from 'helpers/redux/checkout/recaptcha/reducer';
import type { RecaptchaState } from 'helpers/redux/checkout/recaptcha/state';
import { thankYouReducer } from 'helpers/redux/checkout/thankYouState/reducer';
import type { CommonState } from 'helpers/redux/commonState/state';
import { userReducer } from 'helpers/redux/user/reducer';
import type { UserState } from 'helpers/redux/user/state';
import type { FormState } from 'helpers/subscriptionsForms/formFields';
import { createFormReducer } from 'helpers/subscriptionsForms/formReducer';
import type { Option } from 'helpers/types/option';

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
	addressMeta: AddressMetaState;
	payment: PaymentState;
};

export type CheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	user: UserState;
}>;

export type WithDeliveryCheckoutState = ReduxState<{
	checkout: FormState;
	checkoutForm: CheckoutFormState;
	user: UserState;
}>;

export type AnyCheckoutState = CheckoutState | WithDeliveryCheckoutState;

export function createReducer() {
	return combineReducers({
		checkout: createFormReducer(),
		checkoutForm: combineReducers({
			personalDetails: personalDetailsReducer,
			product: productReducer,
			gifting: giftingReducer,
			marketingConsent: marketingConsentReducer,
			csrf: csrfReducer,
			recaptcha: recaptchaReducer,
			deliveryAddress: deliveryAddressReducer,
			billingAddress: billingAddressReducer,
			addressMeta: addressMetaReducer,
			payment: paymentReducer,
			thankYou: thankYouReducer,
		}),
		user: userReducer,
	});
}

export const getFulfilmentOption = (
	state: WithDeliveryCheckoutState,
): Option<FulfilmentOptions> =>
	state.page.checkoutForm.product.fulfilmentOption;
