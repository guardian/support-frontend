import type {
	CheckoutState,
	WithDeliveryCheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getUserTypeFromIdentity } from 'helpers/identityApis';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { setUserTypeFromIdentityResponse } from 'helpers/subscriptionsForms/formActions';
export const fetchAndStoreUserType =
	(email: string) =>
	(
		dispatch: (...args: Array<any>) => any,
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
