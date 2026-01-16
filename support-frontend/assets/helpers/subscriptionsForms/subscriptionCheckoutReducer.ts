import { combineReducers } from 'redux';
import {
	billingAddressReducer,
	deliveryAddressReducer,
} from 'helpers/redux/checkout/address/reducer';
import { addressMetaReducer } from 'helpers/redux/checkout/addressMeta/reducer';
import { csrfReducer } from 'helpers/redux/checkout/csrf/reducer';
import { giftingReducer } from 'helpers/redux/checkout/giftingState/reducer';
import { marketingConsentReducer } from 'helpers/redux/checkout/marketingConsent/reducer';
import { personalDetailsReducer } from 'helpers/redux/checkout/personalDetails/reducer';
import { productReducer } from 'helpers/redux/checkout/product/reducer';
import { recaptchaReducer } from 'helpers/redux/checkout/recaptcha/reducer';
import { userReducer } from 'helpers/redux/user/reducer';
import { createFormReducer } from 'helpers/subscriptionsForms/formReducer';

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
		}),
		user: userReducer,
	});
}
