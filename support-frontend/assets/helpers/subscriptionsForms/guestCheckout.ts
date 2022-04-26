import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { setUserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/actions';
import type { RedemptionPageState } from 'helpers/redux/redemptionsStore';
import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

export const fetchAndStoreUserType =
	(email: string) =>
	(
		dispatch: (...args: any[]) => any,
		getState: () =>
			| CheckoutState
			| WithDeliveryCheckoutState
			| RedemptionPageState,
		callback = (userType: UserTypeFromIdentityResponse) =>
			void dispatch(setUserTypeFromIdentityResponse(userType)),
	): void => {
		const state = getState();
		const { csrf } = state.page;
		const { isSignedIn } = state.page.checkoutForm.personalDetails;

		void getUserTypeFromIdentity(email, isSignedIn, csrf, callback);
	};
