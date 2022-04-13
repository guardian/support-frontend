import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { RedemptionPageState } from 'helpers/redux/redemptionsStore';
import { setUserTypeFromIdentityResponse } from 'helpers/subscriptionsForms/formActions';
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
		const { isSignedIn } = state.page.checkout;

		void getUserTypeFromIdentity(email, isSignedIn, csrf, callback);
	};
