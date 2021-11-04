import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { setUserTypeFromIdentityResponse } from 'helpers/subscriptionsForms/formActions';
import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

export const fetchAndStoreUserType =
	(email: string) =>
	(
		dispatch: (...args: any[]) => any,
		getState: () =>
			| CheckoutState
			| WithDeliveryCheckoutState
			| RedemptionPageState,
	): void => {
		const state = getState();
		const { csrf } = state.page;
		const { isSignedIn } = state.page.checkout;
		void getUserTypeFromIdentity(
			email,
			isSignedIn,
			csrf,
			(userType: UserTypeFromIdentityResponse) =>
				void dispatch(setUserTypeFromIdentityResponse(userType)),
		);
	};
