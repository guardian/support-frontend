import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { setUserTypeFromIdentityResponse } from 'helpers/subscriptionsForms/formActions';
import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

export const fetchAndStoreUserType =
	(email: string) =>
	(
		dispatch: (...args: any[]) => any,
		getState: () => CheckoutState | WithDeliveryCheckoutState,
	): void => {
		const state = getState();
		const { csrf } = state.page;
		const { isSignedIn } = state.page.checkout;
		getUserTypeFromIdentity(
			email,
			isSignedIn,
			csrf,
			(userType: UserTypeFromIdentityResponse) =>
				dispatch(setUserTypeFromIdentityResponse(userType)),
		);
	};
