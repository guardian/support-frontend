import type { StateProvince } from 'helpers/internationalisation/country';
import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { updateBillingState } from 'pages/contributions-landing/contributionsLandingActions';
import type { PersonalDetailsProps } from './personalDetails';

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null =>
	formValue === null || formValue === '' ? userValue : formValue;

type PersonalDetailsContainerProps = {
	renderPersonalDetails: (props: PersonalDetailsProps) => JSX.Element;
};

export function PersonalDetailsContainer({
	renderPersonalDetails,
}: PersonalDetailsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { email, firstName, lastName } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);
	const contributionType = getContributionType(
		useContributionsSelector((state) => state),
	);
	const bState = useContributionsSelector(
		(state) => state.page.form.formData.billingState,
	);
	const stateField = useContributionsSelector(
		(state) => state.page.user.stateField,
	);
	const billingState = getCheckoutFormValue(bState, stateField) ?? '';
	const checkoutFormHasBeenSubmitted = useContributionsSelector(
		(state) => state.page.form.formData.checkoutFormHasBeenSubmitted,
	);
	const userTypeFromIdentityResponse = useContributionsSelector(
		(state) =>
			state.page.checkoutForm.personalDetails.userTypeFromIdentityResponse,
	);
	function onEmailChange(email: string) {
		dispatch(setEmail(email));
	}
	const isSignedIn = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails.isSignedIn,
	);

	function onFirstNameChange(firstName: string) {
		dispatch(setFirstName(firstName));
	}
	function onLastNameChange(lastName: string) {
		dispatch(setLastName(lastName));
	}
	function updateBillState(billingState: StateProvince | null) {
		dispatch(updateBillingState(billingState));
	}

	return renderPersonalDetails({
		email,
		firstName,
		lastName,
		billingState,
		checkoutFormHasBeenSubmitted,
		contributionType,
		isSignedIn,
		userTypeFromIdentityResponse,
		onEmailChange,
		onFirstNameChange,
		onLastNameChange,
		updateBillState,
	});
}
